const { getModbusVariables } = require('../modbus_mqtt')

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
}
