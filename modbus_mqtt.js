//Import Modbus
const { scanModbus, getConnectionsFromDb } = require('./modbus_connect');

let modbusVariables = {}

//Modbus
async function modbusMqtt () {

    setInterval(async() => {
        const connections = await getConnectionsFromDb()
        modbusVariables = await scanModbus (connections)
        console.log(modbusVariables)
    },5000)
}

async function getModbusVariables() {
    return new Promise((resolve) => {
        // Espera até que modbusVariables seja atualizado
        const checkAndUpdate = () => {
            if (Object.keys(modbusVariables).length > 0) {
                resolve({ ...modbusVariables }); // Resolve a promessa com uma cópia do objeto
            } else {
                setTimeout(checkAndUpdate, 100); // Verifica novamente após 100ms
            }
        };
        checkAndUpdate(); // Inicia a verificação
    });
}

module.exports = {getModbusVariables, modbusMqtt}
