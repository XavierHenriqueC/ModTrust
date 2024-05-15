const path = require('path');
const { exec } = require('child_process');

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

// //Cors
// app.use(cors({
//     origin:'*',
//     methods: ["GET", 'PATCH', 'POST', 'DELETE'],
// }))

// Ou, para permitir apenas requisições do mesmo domínio (por exemplo, localhost)
// Substitua 'http://localhost:3000' pelo seu domínio local e porta
app.use(cors({
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200 // Algumas versões antigas do CORS não reconhecem este código sem isso
}));


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


//Servidor FrontEnd

async function frontEndServer () {

  // // Diretório da aplicação React
  // const appDirectory = path.resolve(__dirname,'..', 'Interface');

  // // Comando de build da aplicação React
  // const buildCommand = 'npm run build';

  try {

    const buildPath = path.join(__dirname, 'Interface', 'dist');

    // Serve os arquivos estáticos da aplicação React
    app.use(express.static(buildPath));

    // Rota para servir a aplicação React
    app.get('*', (req, res) => {
      res.sendFile(path.join(buildPath, 'index.html'));
    });

    // Inicia o servidor
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

  } catch (err) {
    console.log(err)
  }
}


main()
frontEndServer()



