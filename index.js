const { DeviceConfigurator, scanModbus } = require('./modbus_connect');

const connections = [
    {
        device: new DeviceConfigurator("Simulador 2", "127.0.0.1", 503, 1, 10000, 1),
        writes: [
            // {
            //     functionCode: 6,
            //     address: 1,
            //     value: 20.2,
            //     dataType: "float32",
            // },
            // {
            //     functionCode: 5,
            //     address: 1,
            //     value: 1,
            //     dataType: "bool",
            // },
        ],
        reads: [
            {
                functionCode: 3,
                address: 1,
                elements: 2,
                dataType: "float32",
                variablesName: ["float1"]
            },
            {
                functionCode: 1,
                address: 1,
                elements: 1,
                dataType: "bool",
                variablesName: ["bool1"]
            }, 
        ],
    },
    {
        device: new DeviceConfigurator("Simulador", "127.0.0.1", 502, 1, 10000, 1),
        writes: [
            // {
            //     functionCode: 6,
            //     address: 1,
            //     value: 100,
            //     dataType: "uint16",
            // },
            // {
            //     functionCode: 6,
            //     address: 2,
            //     value: 200,
            //     dataType: "uint16",
            // },
            // {
            //     functionCode: 6,
            //     address: 3,
            //     value: 300,
            //     dataType: "uint16",
            // },
            // {
            //     functionCode: 6,
            //     address: 4,
            //     value: 400,
            //     dataType: "uint16",
            // },
        ],
        reads: [
            {
                functionCode: 3,
                address: 1,
                elements: 4,
                dataType: "uint16",
                variablesName: ["variable1", "variable2", "variable3", "variable4"]
            },
        ],
    },
];

async function main () {
   const modbusVariables =  await scanModbus(connections, 1000)
    console.log(modbusVariables)
}

main()