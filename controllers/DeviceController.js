//Importa Models
const Task = require('../models/Task')
const Device = require('../models/Device')
const SelectedToMqtt = require('../models/SelectedToMqtt')

//Helpers
const {isValidId} = require("../helpers/validate-id")

module.exports = class DeviceController {
    
    static async register (req, res) {

        const { type ,name, ip, port, unitId, timeout, baseAddress } = req.body
        
        //Validações
        if(!type) {
            res.status(422).json({message: "O type é obrigatório"})
            return;
        }

        if(!name) {
            res.status(422).json({message: "O nome é obrigatório"})
            return;
        }

        if(!ip) {
            res.status(422).json({message: "O ip é obrigatório"})
            return;
        }

        if(!port) {
            res.status(422).json({message: "A port é obrigatório"})
            return;
        }

        if(!unitId) {
            res.status(422).json({message: "O unitId é obrigatório"})
            return;
        }

        if(!timeout) {
            res.status(422).json({message: "O timeout é obrigatório"})
            return;
        }

        if(!baseAddress) {
            res.status(422).json({message: "O baseAddress é obrigatório"})
            return;
        }

        //Checa se o nome ja existe
        const nameExists = await Device.findOne({name: name})

        if(nameExists) {
            res.status(422).json({message: "Esse Device já foi criado, insira um novo nome"})
            return;
        }

        //Create
        const device = new Device ({
            type,
            name,
            ip,
            port,
            unitId,
            timeout,
            baseAddress
        })

        try {
            //Salva no mongoDB
            const newDevice = await device.save();
            res.status(201).json({message: `Device criado com sucesso!`, newDevice})

        } catch (error) {
            res.status(500).json({message: error})
        }

    }

    static async getDeviceById (req, res) {
        
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

        //Puxa Device pelo id no DB
        const device = await Device.findById(id)

        if(!device) {
            res.status(422).json({message: "Device não encontrado"})
            return;
        }

        res.status(200).json({device})

    }

    static async editDeviceById (req, res) {

        const { id ,type, name, ip, port, unitId, timeout, baseAddress } = req.body
        
        if(!id) {
            res.status(422).json({message: "O id é obrigatório"})
            return;
        }
    
        //Verifica se é um ID valido
        try {
            isValidId(id);
        } catch (error) {
            return res.status(422).json({ message: error.message });
        }

        //Puxa Device pelo ID no DB
        const device = await Device.findById(id)

        if(!device) {
            res.status(422).json({message: "Device não encontrado"})
            return;
        }

        //Validações
        if(!type) {
            res.status(422).json({message: "O type é obrigatório"})
            return;
        }

        device.type = type

        if(!name) {
            res.status(422).json({message: "O nome é obrigatório"})
            return;
        }

        //Checa se o nome já existe no banco
        const nameExists = await Device.findOne({name: name})

        if(device.name !== name && nameExists) {
            res.status(422).json({message: "Esse nome de Device já existe"})
            return;
        }

        device.name = name;

        if(!ip) {
            res.status(422).json({message: "O ip é obrigatório"})
            return;
        }

        device.ip = ip

        if(!port) {
            res.status(422).json({message: "A port é obrigatório"})
            return;
        }

        device.port = port

        if(!unitId) {
            res.status(422).json({message: "O unitId é obrigatório"})
            return;
        }

        device.unitId = unitId

        if(!timeout) {
            res.status(422).json({message: "O timeout é obrigatório"})
            return;
        }

        device.timeout = timeout

        if(!baseAddress) {
            res.status(422).json({message: "O baseAddress é obrigatório"})
            return;
        }

        device.baseAddress = baseAddress

        try {
            
            //Atualiza Device
            await Device.findOneAndUpdate(
                {_id: device._id},
                { $set: device},
                { new: true},
            )

            //Atualiza varsToMqtt vinculadas ao Device
            await updateVarsToMqtt ()

            res.status(200).json({message: "Device atualizado com sucesso!"})

        } catch (error) {
            console.log(error)
            res.status(500).json({message: error})
        }
    }

    static async getDevices (req, res) {    

        try {
            const devices = await Device.find().sort('-createdAt')
            res.status(200).json({devices})

        } catch (err) {
            res.status(500).json({message: err })
        }
    }

    static async deleteDeviceById (req, res) {

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

        const device = await Device.findById(id)
        
        if(!device) {
            res.status(422).json({message: "Device não encontrado"})
            return;
        }

        try {
            
            //Deleta todos as tasks do device
            await deleteAllTasksForDevice(id)

        
            //Deleta Device
            await Device.findByIdAndDelete(id)

            //Deleta varsToMqtt vinculadas ao Device
            await updateVarsToMqtt ()

            res.status(200).json({message: "Device deletado com sucesso"})

        } catch (err) {
            res.status(500).json({message: err })
        }

    }
    
}

//Funções auxiliares

//Deleta os Tasks dos devices deletados
async function deleteAllTasksForDevice (id) {

    try {
        
        await Task.deleteMany({deviceId: id})

    } catch (err) {
        console.log(`Erro ao tentar deletar os Tasks do Device: ${id}`)
        throw err; // Re-throw the error for handling outside the function
    }

}

//Verifica modificações na task e limpa VarsToMqtt se necessário

async function updateVarsToMqtt() {
    const tasks = await Task.find()

    let variables = []
    
    tasks.forEach((item) => {
        item.variablesName.forEach((variable) => {
            variables.push(variable)
        })
    })

    const varsToMqtt = await SelectedToMqtt.find()
    
    varsToMqtt.forEach(async (item) => {
        if(!variables.includes(item.name)){
            await SelectedToMqtt.findOneAndDelete({name: item.name})
        }
    })
    
    
}