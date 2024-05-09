//Import Network Config
const { configurarRedeUsuario, setDefault } = require('./networkConfig')

//Import Modbus
const { modbusMqtt, connectBrokerMqtt } = require('./modbus_mqtt');

//Import Network
const Network = require('./models/Network');

//Import Express
const express = require("express")

//Cors
const cors = require('cors')

//Inicializa expresss
const app = express();

//Configura express
app.use(express.json());

//Cors
app.use(cors({
    origin:'*',
    methods: ["GET", 'PATCH', 'POST', 'DELETE'],
}))

//Public folders
app.use(express.static('public'));

//Rota de Devices
const DeviceRoutes = require('./routes/DeviceRoutes')
app.use('/device', DeviceRoutes)

//Rota de Tasks
const TaskRoutes = require('./routes/TaskRoutes')
app.use('/task', TaskRoutes)

//Rota de dados modbus
const ModbusDataRoutes = require('./routes/ModbusDataRoutes');
app.use('/modbusdata', ModbusDataRoutes)

//Rota de Network
const NetworkRoutes = require('./routes/NetworkRoutes');
app.use('/network', NetworkRoutes)

//Porta API
app.listen(3000);

async function main () {
    //Seta valores padrão de Network no DB (se necessário)
    await setDefault ()
    
    //Puxa valores de network no DB
    const networks = await Network.find()
    const network = networks[0]

    //Configura parametros da placa de rede LAN
    configurarRedeUsuario("Ethernet","eth0", network.mode, network.ip, network.netmask, network.gateway);

    //Configura parametros da placa de rede WAN
    //configurarRedeUsuario("Ethernet 1","eth1", network.modeWan, network.ipWan, network.netmaskWan, network.gatewayWan);

    //Conecta com o Broker MQTT
    await connectBrokerMqtt()

    //Executa Modbus e MQTT
    modbusMqtt ()
}

main()



