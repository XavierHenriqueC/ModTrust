//Import Devices from mongo
const Device = require('./models/Device')

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

// //Rota de dados modbus
// const ModbusDataRoutes = require('./routes/ModbusDataRoutes')
// app.use('/modbusdata', ModbusDataRoutes)

//Porta API
app.listen(3000);

