//Importa Models
const Network = require('../models/Network')

//Helpers
const {isValidId} = require("../helpers/validate-id")

module.exports = class NetworkController {
    
    static async editDeviceById (req, res) {

        const { id } = req.body
        
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

            res.status(200).json({message: "Device atualizado com sucesso!"})

        } catch (error) {
            console.log(error)
            res.status(500).json({message: error})
        }
    }

    static async getNetwork (req, res) {    

        try {
            const network = await Network.find()
            res.status(200).json({network})

        } catch (err) {
            res.status(500).json({message: err })
        }
    }

}
