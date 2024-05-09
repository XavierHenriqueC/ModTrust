//Importa Models
const Network = require('../models/Network')

//Helpers
const {isValidId, validarEnderecoIP} = require("../helpers/validate-id")

const { configurarRedeUsuario } = require('../networkConfig')

const { connectBrokerMqtt } = require('../modbus_mqtt')

module.exports = class NetworkController {
    
    static async editDeviceById (req, res) {

        const { 
            id,
            mode,
            ip, 
            netmask, 
            gateway, 
            modeWan, 
            ipWan, 
            netmaskWan, 
            gatewayWan,
            wifiEnable,
            wifiSSID,
            wifiPassword,
            serialBaudRate,
            serialParity,
            serialDataBits,
            serialStopBits,  
            modbusScanRate, 
            mqttHost, 
            mqttPort, 
            mqttUsername, 
            mqttPassword, 
            mqttTopic, 
            mqttSubscribe, 
            defaultConfigs 
        } = req.body
        
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

        //Puxa Network pelo ID no DB
        const network = await Network.findById(id)

        if(!network) {
            res.status(422).json({message: "Network não encontrada"})
            return;
        }

        //Validações porta LAN
        if(!mode) {
            res.status(422).json({message: "O mode é obrigatório"})
            return;
        }

        network.mode = mode

        if(!ip) {
            res.status(422).json({message: "O ip é obrigatório"})
            return;
        }

        if(!validarEnderecoIP(ip)) {
            res.status(422).json({message: "Endereço de IP é invalido"})
            return;
        }

        network.ip = ip

        if(!netmask) {
            res.status(422).json({message: "O netmask é obrigatório"})
            return;
        }

        if(!validarEnderecoIP(netmask)) {
            res.status(422).json({message: "Endereço de netmask é invalido"})
            return;
        }

        network.netmask = netmask

        if(!gateway) {
            res.status(422).json({message: "O gateway é obrigatório"})
            return;
        }

        if(gateway && (!validarEnderecoIP(gateway))) {
            res.status(422).json({message: "Endereço de gateway é invalido"})
            return;
        }

        if (gateway) {
            network.gateway = gateway
        } else {
            network.gateway = ""
        }

        //Validações porta WAN
        if(!modeWan) {
            res.status(422).json({message: "O modeWan é obrigatório"})
            return;
        }

        network.modeWan = modeWan

        if(!ipWan) {
            res.status(422).json({message: "O ipWan é obrigatório"})
            return;
        }

        if(!validarEnderecoIP(ipWan)) {
            res.status(422).json({message: "Endereço de IPWan é invalido"})
            return;
        }

        network.ipWan = ipWan

        if(!netmaskWan) {
            res.status(422).json({message: "O netmaskWan é obrigatório"})
            return;
        }

        if(!validarEnderecoIP(netmaskWan)) {
            res.status(422).json({message: "Endereço de netmaskWan é invalido"})
            return;
        }

        network.netmaskWan = netmaskWan

        if(!gatewayWan) {
            res.status(422).json({message: "O gatewayWan é obrigatório"})
            return;
        }

        if(gatewayWan && (!validarEnderecoIP(gatewayWan))) {
            res.status(422).json({message: "Endereço de gatewayWan é invalido"})
            return;
        }

        if (gatewayWan) {
            network.gatewayWan = gatewayWan
        } else {
            network.gatewayWan = ""
        }

        //Validações WIFI
        if(wifiEnable !== false && wifiEnable !== true) {
            res.status(422).json({message: "O wifiEnable é obrigatório"})
            return;
        }

        if(wifiEnable) {
            if(!wifiSSID) {
                res.status(422).json({message: "O wifiSSID é obrigatório"})
                return;
            }
        }

        network.wifiEnable = wifiEnable

        if(wifiSSID) {
            network.wifiSSID = wifiSSID
        } else {
            network.wifiSSID = ""
        }

        if(wifiPassword) {
            network.wifiPassword = wifiPassword
        } else {
            network.wifiPassword = ""
        }

        //Validações SERIAL
        if(!serialBaudRate) {
            res.status(422).json({message: "O serialBaudRate é obrigatório"})
            return;
        }

        network.serialBaudRate = serialBaudRate

        if(!serialParity) {
            res.status(422).json({message: "O serialParity é obrigatório"})
            return;
        }

        network.serialParity = serialParity

        if(!serialDataBits) {
            res.status(422).json({message: "O serialDataBits é obrigatório"})
            return;
        }

        network.serialDataBits = serialDataBits

        if(!serialStopBits) {
            res.status(422).json({message: "O serialStopBits é obrigatório"})
            return;
        }

        network.serialStopBits = serialStopBits

        //Validações MODBUS
        if(!modbusScanRate) {
            res.status(422).json({message: "O modbusScanRate é obrigatório"})
            return;
        }

        network.modbusScanRate = modbusScanRate
        
        //Validações MQTT CLIENT
        if(!mqttHost) {
            res.status(422).json({message: "O mqttHost é obrigatório"})
            return;
        }

        network.mqttHost = mqttHost

        if(!mqttPort) {
            res.status(422).json({message: "O mqttPort é obrigatório"})
            return;
        }

        network.mqttPort = mqttPort
        
        if(mqttUsername) {
            network.mqttUsername = mqttUsername
        } else {
            network.mqttUsername = ""
        }
        
        if(mqttPassword) {
            network.mqttPassword = mqttPassword
        } else {
            network.mqttPassword = ""
        }

        if(!mqttTopic) {
            res.status(422).json({message: "O mqttTopic é obrigatório"})
            return;
        }

        network.mqttTopic = mqttTopic

        if(mqttSubscribe) {
            network.mqttSubscribe = mqttSubscribe
        }

        //Validações DEFAULT CONFIGS
        if(!defaultConfigs) {
            res.status(422).json({message: "O defaultConfigs é obrigatório"})
            return;
        }

        network.defaultConfigs = defaultConfigs

        try {
            
            //Atualiza Device
            await Network.findOneAndUpdate(
                {_id: network._id},
                { $set: network},
                { new: true},
            )

            res.status(200).json({message: "Network atualizada com sucesso!"})

            await reconfigRede()

            connectBrokerMqtt()

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


async function reconfigRede () {
    try {
        //Puxa valores de network no DB
        const networks = await Network.find()
        const network = networks[0]

        //Reconfigura parametros da placa de rede LAN
        configurarRedeUsuario("Ethernet","eth0", network.mode, network.ip, network.netmask, network.gateway);

        //Reconfigura parametros da placa de rede WAN
        //configurarRedeUsuario("Ethernet 7","eth1", network.modeWan, network.ipWan, network.netmaskWan, network.gatewayWan);

    } catch (err) {
        console.log(err)
    }
}
