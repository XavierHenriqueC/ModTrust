//Import Modbus
const { scanModbus, getConnectionsFromDb } = require('./modbus_connect');

//Import MQTT
const mqtt = require('mqtt');

//Import dados da Network
const Network = require('./models/Network')

//Configurações MQTT
let mqttConfig = {
    broker: "",
    port: 0,
}

let mqttClient = {}

async function getNetworkData () {
    try {
        //Puxa valores de network no DB
        const networks = await Network.find()
        const network = networks[0]

        return network

    } catch (err) {
        console.log(err)
    }
}

async function connectBrokerMqtt () {

    const network = await getNetworkData()

    mqttConfig = {
        broker: network.mqttHost,
        port: network.mqttPort
    }

    // Criação do cliente MQTT
    mqttClient = mqtt.connect(mqttConfig.broker, {
        port: mqttConfig.port
    });

    // Conecta ao broker MQTT
    mqttClient.on('connect', () => {
        console.log('Conectado ao broker MQTT');
    });

}

connectBrokerMqtt()


//Publica mensagem MQTT
const publishData = async (network,variables) => {

    function convertObjToArray(obj) {
        return Object.entries(obj).map(([key, value]) => ({ variable: key, value: value }));
    }

    const message = convertObjToArray(variables)
      
    // Convertendo a mensagem JSON para uma string
    const messageString = JSON.stringify(message);

    // Processa mensagem MQTT
    mqttClient.publish(network.mqttTopic, messageString, function (err) {

        if(err) {
            console.log("Erro ao publicar mensagem: ", err)
        } else {
            console.log('Mensagem publicada com sucesso no tópico:', network.mqttTopic, messageString);
        }
    });
}


let modbusVariables = {}

//Modbus
async function modbusMqtt () {

    const network = await getNetworkData()

    setInterval(async() => {

        //Modbus
        const connections = await getConnectionsFromDb()
        modbusVariables = await scanModbus (connections)
        console.log(modbusVariables)

        //Verifica se possui variaveis para postar no MQTT
        if(Object.keys(modbusVariables).length !== 0) {
            //Posta MQTT
            await publishData(network, modbusVariables)
        }
        
    },network.modbusScanRate)
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

module.exports = {getModbusVariables, modbusMqtt, connectBrokerMqtt}
