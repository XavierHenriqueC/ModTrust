//Importa Models
const Task = require('../models/Task')
const Device = require('../models/Device')

//Import Modbus
const { DeviceConfigurator, scanModbus } = require('../modbus_connect');

//Helpers
const {isValidId} = require("../helpers/validate-id")


let connections = []

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

            function verificaRepetidos(array) {
                // Cria um objeto para armazenar a contagem de cada elemento
                let contador = {};
            
                // Itera sobre o array
                for (let i = 0; i < array.length; i++) {
                    // Se o elemento já existe no objeto contador, retorna true
                    if (contador[array[i]]) {
                        return true;
                    } else {
                        // Caso contrário, incrementa o contador para esse elemento
                        contador[array[i]] = 1;
                    }
                }
                // Se nenhum elemento foi repetido, retorna false
                return false;
            }

            if(verificaRepetidos(variablesName)) {
                res.status(422).json({message: "Esse nome de variavel já existe, insira um novo nome"})
                return
            }
        
        
            //Checa se algum nome ja existe no db
            async function checkNameExists(variablesName) {
                return new Promise(async (resolve, reject) => {
                    try {
                        const itensPromises = variablesName.map(async (element) => {
                            return await Task.findOne({ variablesName: { $in: [element] } });
                        });
            
                        const itens = await Promise.all(itensPromises);
                        const found = itens.some(item => item !== null);
                        resolve(found);
                    } catch (error) {
                        reject(error);
                    }
                });
            }
            
            const variableNameExists = await checkNameExists(variablesName)

            if(variableNameExists) {
                res.status(422).json({message: "Esse nome de variavel já existe, insira um novo nome"})
                return
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

            connections = await refreshConnections()

            res.status(201).json({message: `Task criada com sucesso!`, newTask})

        } catch (error) {
            res.status(500).json({message: error})
        }

    }
    
}

//Atualiza tasks modbus
const refreshConnections = async () => {
    
    let connections = []
    try {
        const devices = await Device.find()

        //Monta Conexões apartir dos dados do mongo
        connections = devices.map((item) => {
            const task = item.task

            const reads = task.map((read) => {
                if(read.functionType === 'read') {
                    return read
                }
            })

            const writes = task.map((write) => {
                if(write.functionType === 'write') {
                    return write
                }
            })

            const obj = {
                device: new DeviceConfigurator (item.name, item.ip, item.port, item.unitId, item.timeout, item.baseAddress),
                writes: writes,
                reads: reads
            }

            return obj
        })

    } catch (err) {
        throw err
    }

    return connections
}

//Modbus
async function main () {

    const timer = setInterval(async() => {
        connections = await refreshConnections()
        const modbusVariables = await scanModbus (connections)
        console.log(modbusVariables)
    },5000)

    
    
}
 
main()