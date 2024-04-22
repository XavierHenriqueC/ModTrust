const { getModbusVariables } = require('../modbus_mqtt')

const SelectedToMqtt = require('../models/SelectedToMqtt')
const Task = require('../models/Task')

module.exports = class ModbusDataControllerController {
    
    static async getData (req, res) {    

        try {
            const modbus = await getModbusVariables()
            res.status(200).json(modbus)

        } catch (err) {
            console.log(err)
            res.status(500).json({message: err })
        }
    }

    static async registerVarToMqtt (req, res) {    
        
        const { name } = req.body
        
        //Validações
        if(!name) {
            res.status(422).json({message: "O nome é obrigatório"})
            return;
        }

        //Verifica se o nome existe na tabela de nomes de variaveis
        const nameExists = await Task.findOne({ variablesName: { $in: [name] } });

        if(!nameExists) {
            res.status(422).json({message: "Esse nome de variavel não existe"})
            return;
        }

        //Create
        const varToMqtt = new SelectedToMqtt ({
            name,
        })

        try {
            //Salva no mongoDB
            const newVarToMqtt = await varToMqtt.save();
            res.status(201).json({message: `Variavel selecionada com sucesso!`, newVarToMqtt})

        } catch (error) {
            res.status(500).json({message: error})
        }
    }

    static async deleteVarToMqttByName (req, res) {

        const {name} = req.body

        //Validações
        if(!name) {
            res.status(422).json({message: "O nome é obrigatório"})
            return;
        }

       //Verifica se é um ID valido

        const varToMqtt = await SelectedToMqtt.findOne({name: name})
        
        if(!varToMqtt) {
            res.status(422).json({message: "Variavel não encontrada"})
            return;
        }

        try {

            //Deleta variavel
            await SelectedToMqtt.findOneAndDelete({name: name})

            res.status(200).json({message: "Variavel deletada com sucesso"})

        } catch (err) {
            res.status(500).json({message: err })
        }

    }

    static async getVarsToMqtt (req, res) {    

        try {
            const varsToMqtt = await SelectedToMqtt.find()
            res.status(200).json(varsToMqtt)

        } catch (err) {
            console.log(err)
            res.status(500).json({message: err })
        }
    }

}
