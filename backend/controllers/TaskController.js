//Importa Models
const Task = require('../models/Task')
const Device = require('../models/Device')

//Helpers
const {isValidId} = require("../helpers/validate-id")


module.exports = class TaskController {
    
    static async register (req, res) {

        const { deviceId, functionType, functionCode, address, elements, dataType, variablesName } = req.body
        
        //Validações
        if(!deviceId) {
            res.status(422).json({message: "O deviceId é obrigatório"})
            return;
        }

        //Verifica se é um ID valido
        try {
            isValidId(deviceId);
        } catch (error) {
            return res.status(422).json({ message: error.message });
        }

        //Verifica se o ID existe
        const deviceExists = await Device.findById(deviceId)

        if(!deviceExists) {
            res.status(422).json({message: "deviceId não existe!"})
            return;
        }

        if(!functionType) {
            res.status(422).json({message: "O functionType é obrigatório"})
            return;
        }

        if(!functionCode) {
            res.status(422).json({message: "O functionCode é obrigatório"})
            return;
        }

        if(!address) {
            res.status(422).json({message: "O address é obrigatório"})
            return;
        }

        if(!elements) {
            res.status(422).json({message: "O elements é obrigatório"})
            return;
        }

        if(!dataType) {
            res.status(422).json({message: "O dataType é obrigatório"})
            return;
        }

        if(!variablesName) {
            res.status(422).json({message: "O variablesName é obrigatório"})
            return;
        }

        let variablesNameLength = elements

        //Valida VariablesName 
            if(dataType === "int32" || dataType === "uint32" || dataType === "float32") {
                variablesNameLength = elements / 2
            } else {
                variablesNameLength = elements
            }

            if(!(Array.isArray(variablesName))) {
                res.status(422).json({message: "VariablesName deve ser um array"})
                return
            }

            if(!(variablesName.length === variablesNameLength)) {
                res.status(422).json({message: "Todas as variaveis deve possuir um nome"})
                return
            }

            //Verifica se os nomes de variaveis são validos
            function validarString(str) {
                // Expressão regular para verificar se a string começa com uma letra e contém apenas letras, números e underscores
                var regex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
                // Teste se a string corresponde à expressão regular
                return regex.test(str);
            }

            function validaNames(array) {
                
                for (let i = 0; i < array.length; i++) {
                    const test = validarString(array[i].variable);
                    if (!test) {
                        return { status: false, varName: array[i].variable };
                    }
                }
                return { status: true, varName: "" };
            }

            const validaNamesExe = validaNames(variablesName);

            if (!validaNamesExe.status) {
                res.status(422).json({ message: `O nome ${validaNamesExe.varName} é inválido. Exemplo de nome válido: temperature_2Tank` });
                return;
            }

            //Verifica se existe nomes repetidos dentro do array de variablesName
            function verificaRepetidos(array) {
                // Cria um objeto para armazenar a contagem de cada elemento
                let contador = {};
            
                // Itera sobre o array
                for (let i = 0; i < array.length; i++) {
                    // Se o elemento já existe no objeto contador, retorna true
                    if (contador[array[i].variable]) {
                        return true;
                    } else {
                        // Caso contrário, incrementa o contador para esse elemento
                        contador[array[i].variable] = 1;
                    }
                }
                // Se nenhum elemento foi repetido, retorna false
                return false;
            }

            if(verificaRepetidos(variablesName)) {
                res.status(422).json({message: "Esse nome de variavel já existe, insira um novo nome"})
                return
            }
        
        
            // Checa se algum nome já existe no banco de dados
            async function checkNameExists(variablesName) {
                return new Promise(async (resolve, reject) => {
                    try {
                        const itensPromises = variablesName.map(async (element) => {
                            // Aqui, estamos verificando se algum documento possui a variável com o mesmo nome
                            return await Task.findOne({ 'variablesName.variable': element.variable });
                        });

                        const itens = await Promise.all(itensPromises);
                        const found = itens.some(item => item !== null);
                        resolve(found);
                    } catch (error) {
                        reject(error);
                    }
                });
            }

            const variableNameExists = await checkNameExists(variablesName);

            if (variableNameExists) {
                res.status(422).json({ message: "Esse nome de variável já existe, insira um novo nome" });
                return;
            }

        //
        
        //Create
        const task = new Task ({
            deviceId,
            functionType,
            functionCode,
            address,
            elements,
            dataType,
            variablesName,
        })

        try {
            //Salva no mongoDB
            const newTask = await task.save();

            const device = await Device.findById(deviceId)

            device.task.push(task)

            //AdcionaTask ao Device
            await Device.findOneAndUpdate(
                {_id: device._id},
                { $set: device},
                { new: true},
            )

            res.status(201).json({message: `Task criada com sucesso!`, newTask})

        } catch (error) {
            res.status(500).json({message: error})
        }

    }

    static async getTaskById (req, res) {
        
        const id = req.body.id

        //Validações
        if(!id) {
            res.status(422).json({message: "O ID é obrigatório"})
            return;
        }

        //Verifica se é um ID valido
        try {
            isValidId(id);
        } catch (error) {
            return res.status(422).json({ message: error.message });
        }

        //Puxa Task pelo id no DB
        const task = await Task.findById(id)

        if(!task) {
            res.status(422).json({message: "Task não encontrada"})
            return;
        }

        res.status(200).json({task})

    }

    static async editTaskById (req, res) {

        const { id, functionType, functionCode, address, elements, dataType, variablesName } = req.body
        
        //Verifica se é um ID valido
        try {
            isValidId(id);
        } catch (error) {
            return res.status(422).json({ message: error.message });
        }

        //Puxa task no db
        const task = await Task.findById(id)

        if(!task) {
            res.status(422).json({message: "Task não existe"})
            return
        }

        if(!functionType) {
            res.status(422).json({message: "O functionType é obrigatório"})
            return;
        }

        task.functionType = functionType

        if(!functionCode) {
            res.status(422).json({message: "O functionCode é obrigatório"})
            return;
        }

        task.functionCode = functionCode

        if(!address) {
            res.status(422).json({message: "O address é obrigatório"})
            return;
        }

        task.address = address

        if(!elements) {
            res.status(422).json({message: "O elements é obrigatório"})
            return;
        }

        task.elements = elements

        if(!dataType) {
            res.status(422).json({message: "O dataType é obrigatório"})
            return;
        }

        task.dataType = dataType

        if(!variablesName) {
            res.status(422).json({message: "O variablesName é obrigatório"})
            return;
        }

        let variablesNameLength = elements

        //Valida VariablesName 
            if(dataType === "int32" || dataType === "uint32" || dataType === "float32") {
                variablesNameLength = elements / 2
            } else {
                variablesNameLength = elements
            }

            if(!(Array.isArray(variablesName))) {
                res.status(422).json({message: "VariablesName deve ser um array"})
                return
            }

            if(!(variablesName.length === variablesNameLength)) {
                res.status(422).json({message: "Todas as variaveis deve possuir um nome"})
                return
            }

            //Verifica se os nomes de variaveis são validos
            function validarString(str) {
                // Expressão regular para verificar se a string começa com uma letra e contém apenas letras, números e underscores
                var regex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
                // Teste se a string corresponde à expressão regular
                return regex.test(str);
            }

            function validaNames(array) {
                for (let i = 0; i < array.length; i++) {
                    const test = validarString(array[i].variable);
                    if (!test) {
                        return { status: false, varName: array[i].variable };
                    }
                }
                return { status: true, varName: "" };
            }

            const validaNamesExe = validaNames(variablesName);

            if (!validaNamesExe.status) {
                res.status(422).json({ message: `O nome ${validaNamesExe.varName} é inválido. Exemplo de nome válido: temperature_2Tank` });
                return;
            }

            //Verifica se existe nomes repetidos dentro do array de variablesName
            function verificaRepetidos(array) {
                // Cria um objeto para armazenar a contagem de cada elemento
                let contador = {};
            
                // Itera sobre o array
                for (let i = 0; i < array.length; i++) {
                    // Se o elemento já existe no objeto contador, retorna true
                    if (contador[array[i].variable]) {
                        return true;
                    } else {
                        // Caso contrário, incrementa o contador para esse elemento
                        contador[array[i].variable] = 1;
                    }
                }
                // Se nenhum elemento foi repetido, retorna false
                return false;
            }

            if(verificaRepetidos(variablesName)) {
                res.status(422).json({message: "Esse nome de variavel já existe, insira um novo nome"})
                return
            }

            task.variablesName = variablesName
        
        //

        try {
           
            //Atualiza Device
            await Task.findOneAndUpdate(
                {_id: task._id},
                { $set: task},
                { new: true},
            )

            await updateTaskInDevice(task.deviceId, id)

            res.status(200).json({message: "Task atualizada com sucesso!"})

        } catch (error) {
            console.log(error)
            const Error = `${error}`
            res.status(500).json({message: Error})
        }

        
    }

    static async getTasks (req, res) {    

        try {
            const tasks = await Task.find().sort('-createdAt')
            res.status(200).json({tasks})

        } catch (err) {
            res.status(500).json({message: err })
        }
    }

    static async deleteTaskById (req, res) {

        const id = req.body.id

        //Validações
        if(!id) {
            res.status(422).json({message: "O ID é obrigatório"})
            return;
        }

       //Verifica se é um ID valido
        try {
            isValidId(id);
        } catch (error) {
            return res.status(422).json({ message: error.message });
        }

        const task = await Task.findById(id)
        
        if(!task) {
            res.status(422).json({message: "Task não encontrada"})
            return;
        }

        try {
            
            //Deleta task do device
            await deleteTaskInDevice(task.deviceId, id)

            //Deleta cliente
            await Task.findByIdAndDelete(id)

            res.status(200).json({message: "Task deletada com sucesso"})

        } catch (err) {
            res.status(500).json({message: err })
        }

    }
    
}

//Funções auxiliares

//Atualiza task do device
async function updateTaskInDevice(deviceId, taskId) {
    try {
        const device = await Device.findById(deviceId)

        const task = await Task.findById(taskId)
        
        // Array original
        const tasks = device.task;
        
        // Filtrando o array para atualizar o objeto com _id igual a taskId
        const newTasks = tasks.map((item) => {
            const id = `${item._id}`
            const taskId = `${task._id}`
           
            if(id === taskId) {
                return task
            } else {
                return item
            }
        })

        device.task = newTasks
        
        //AdcionaTask ao Device
        await Device.findOneAndUpdate(
            {_id: device._id},
            { $set: device},
            { new: true},
        )
        
    } catch (err) {
        console.error(`Erro ao tentar atualizar as Tasks do Device: ${err}`);
        throw err; // Re-throw the error for handling outside the function
    }
}

//Deleta task do device
async function deleteTaskInDevice(deviceId, taskId) {
    try {
        const device = await Device.findById(deviceId)

        // Array original
        const tasks = device.task;
        
        // Filtrando o array para excluir o objeto com _id igual a taskId
        const newTasks = tasks.map((item) => {
            const id = `${item._id}`
           
            if(id !== taskId) {
                return item
            } else {
                return {}
            }
        })

        //Remove objetos vazios
        function removerObjetosVazios(array) {

            function isObjectVazio(obj) {
                return Object.keys(obj).length === 0 && obj.constructor === Object;
            }

            return array.filter(function(elemento) {
                // Remove apenas objetos vazios {}
                return !isObjectVazio(elemento);
            });
        }
        
        const newTasksModified = removerObjetosVazios(newTasks)

        device.task = newTasksModified

        //AdcionaTask ao Device
        await Device.findOneAndUpdate(
            {_id: device._id},
            { $set: device},
            { new: true},
        )
        
    } catch (err) {
        console.error(`Erro ao tentar deletar o Task no Device: ${err}`);
        throw err; // Re-throw the error for handling outside the function
    }
}
