//Importa Models
const Device = require('../models/Device')

module.exports = class DeviceController {
    
    static async register (req, res) {

        const { name, ip, port, unitId, timeout, baseAddress } = req.body
        
        //Validações
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
    
}