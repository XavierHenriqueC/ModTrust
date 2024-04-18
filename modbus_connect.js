// create a tcp modbus client
const Modbus = require('jsmodbus');
const net = require('net');

//Importa model mongo
const Device = require('./models/Device')

const {
    isFloat,
    isEven,
    modbusRegisterToInt16,
    int16ToModbusRegister,
    modbusRegistersToInt32,
    int32ToModbusRegisters,
    modbusRegistersToUInt32,
    uint32ToModbusRegisters,
    modbusRegistersToFloat32,
    float32ToModbusRegisters
} = require('./modbus_converts');

// Classe para configuração da conexão com o dispositivo
class DeviceConfigurator {
    
    constructor(name, host, port, unitId, timeout, baseAddress) {
        this.name = name;
        this.unitId = unitId;
        this.baseAddress = baseAddress;
        this.timeout = timeout;
        this.socket = new net.Socket();
        this.client = new Modbus.client.TCP(this.socket, this.unitId);
        this.options = {
            'host': host,
            'port': port,
        };
        this.onConnected = false;
        this.attachEventHandlers();
    }

    attachEventHandlers() {
        
        this.socket.on('error', (err) => {
            console.error(`Error in connection to ${this.name}: ${err.message}`);
            this.disconnect();
        });

        this.socket.setTimeout(this.timeout, () => {
            console.error(`Connection to ${this.name} timed out`);
            this.disconnect();
        });

        this.socket.on('connect', () => {
            this.started()
        });

    }

    async started () {
        this.onConnected = true
    }

    async connect() {

        try {
           await this.disconnect()
        } finally {
            
            try {
                
                this.socket.setMaxListeners(50);
                
                const timer = setTimeout(() => {
                    this.socket.connect(this.options.port, this.options.host, () => {
                      //  console.log(`Connected to ${this.name} at ${this.options.host}:${this.options.port}`);
                    });
                    clearTimeout(timer)
                },10)
               
            } catch (err) {
                console.error(err);
                this.disconnect();
            }
        }
        
    }

    async disconnect() {
        let timer = undefined;     
  
        return new Promise((resolve, reject) => {
            timer = setTimeout(() => {                
                this.socket.destroy();
                this.socket.end()
                resolve(true)
                clearTimeout(timer)
            },10)
        })
    }

    // Função para compensar a base 0 ou 1 de endereços
    addressCompensation(address) {
        if (this.baseAddress === 0) {
            return address;
        } else if (this.baseAddress === 1) {
            return address - 1;
        } else {
            throw new Error("Base address must be either 0 or 1");
        }
    }

    // Função para leitura de registradores
    async readModbus(functionCode, address, elements, dataType) {
        
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error("Timeout na leitura do Modbus"));
            }, this.timeout);

            try {
                this.connect();
            } finally {
               
                this.started = async () => {
                    try {
                        let resp = undefined;
                        let values = [];
                        let convertValues = [];
    
                        const Address = this.addressCompensation(address);

                        function removerItens(array, quantidade) {
                            array.splice(quantidade);

                            return array
                        }
    
                        switch (functionCode) {
                            case 1:
                                if (dataType === "bool") {
                                    resp = await this.client.readCoils(Address, elements).catch((err) => reject(err));
                                    const filterValues = resp.response.body.valuesAsArray;
                                    values = removerItens(filterValues, 1)
                                } else {
                                    throw new Error("Leitura: Para o functionCode 1 ou 2, utilize o tipo bool");
                                }
                                break;
                            case 2:
                                resp = await this.client.readDiscreteInputs(Address, elements).catch((err) => reject(err));
                                values = resp.response.body.valuesAsArray;
                                break;
                            case 3:
                                resp = await this.client.readHoldingRegisters(Address, elements).catch((err) => reject(err));
                                values = resp.response.body.values;
                                break;
                            case 4:
                                resp = await this.client.readInputRegisters(Address, elements).catch((err) => reject(err));
                                values = resp.response.body.values;
                                break;
                            default:
                                break;
                        }
    
                        switch (dataType) {
                            case "bool":
                                if (functionCode === 1 || functionCode === 2) {
                                    resolve(values);
                                } else {
                                    throw new Error("Leitura: Para o tipo bool, utilize o functionCode 1 ou 2");
                                }
                                break;
                            case "uint16":
                                resolve(values);
                                break;
                            case "int16":
                                convertValues = values.map((item) => {
                                    return modbusRegisterToInt16(item);
                                });
                                resolve(convertValues);
                                break;
                            case "uint32":
                                values.forEach((item, index) => {
                                    if (isEven(index)) {
                                        const value = modbusRegistersToUInt32(item, values[index + 1]);
                                        convertValues.push(value);
                                    }
                                });
                                resolve(convertValues);
                                break;
                            case "int32":
                                values.forEach((item, index) => {
                                    if (isEven(index)) {
                                        const value = modbusRegistersToInt32(item, values[index + 1]);
                                        convertValues.push(value);
                                    }
                                });
                                resolve(convertValues);
                                break;
                            case "float32":
                                values.forEach((item, index) => {
                                    if (isEven(index)) {
                                        const value = modbusRegistersToFloat32(item, values[index + 1]);
                                        convertValues.push(value);
                                    }
                                });
                                resolve(convertValues);
                                break;
                            default:
                                break;
                        }
                       // console.log(values) //debug
                    } catch (err) {
                        clearTimeout(timer);
                        this.disconnect();
                        reject(err);
                    } finally {
                        clearTimeout(timer);
                        this.disconnect()
                    }
                };
            }
        
        });
    }

    // Função para escrita de registradores
    async writeModbus(functionCode, address, value, dataType) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error("Timeout na escrita do Modbus"));
            }, this.timeout);

            try {
                this.connect();
            } finally {
                this.started = async () => {
                    try {
                        const Address = this.addressCompensation(address);
    
                        switch (functionCode) {
                            case 5:
                                if (!isFloat(value) && (dataType === "bool") && (value === true || value === false || value === 0 || value === 1)) {
                                    const coilValue = value ? 1 : 0;
                                    resolve(this.client.writeSingleCoil(Address, coilValue).catch((err) => reject(err)));
                                } else if (!(dataType === "bool")) {
                                    throw new Error(`Escrita: Para o tipo ${dataType} utilize o functionCode 6`);
                                } else {
                                    throw new Error(`Escrita: Valores fora de range para o tipo ${dataType}`);
                                }
                                break;
                            case 6:
                                if (dataType === "float32") {
                                    const newValues = float32ToModbusRegisters(value);
                                    resolve(this.client.writeSingleRegister(Address, newValues[0]).then(() => this.client.writeSingleRegister(Address + 1, newValues[1])).catch((err) => reject(err)));
                                } else {
                                    if (!isFloat(value)) {
                                        let writeValue;
                                        if (dataType === "uint16") {
                                            writeValue = value;
                                        } else if (dataType === "int16") {
                                            writeValue = int16ToModbusRegister(value);
                                        } else if (dataType === "uint32") {
                                            const newValues = uint32ToModbusRegisters(value);
                                            resolve(this.client.writeSingleRegister(Address, newValues[0]).then(() => this.client.writeSingleRegister(Address + 1, newValues[1])).catch((err) => reject(err)));
                                            return;
                                        } else if (dataType === "int32") {
                                            const newValues = int32ToModbusRegisters(value);
                                            resolve(this.client.writeSingleRegister(Address, newValues[0]).then(() => this.client.writeSingleRegister(Address + 1, newValues[1])).catch((err) => reject(err)));
                                            return;
                                        }
                                        resolve(this.client.writeSingleRegister(Address, writeValue));
                                    } else if (dataType === "bool") {
                                        throw new Error(`Escrita: Para o tipo "bool" utilize o functioncode 5`);
                                    } else {
                                        throw new Error(`Escrita: Valores fora de range para o tipo ${dataType}`);
                                    }
                                }
                                break;
                            default:
                                break;
                        }
                    } catch (err) {
                        clearTimeout(timer);
                        this.disconnect();
                        reject(err);
                    } finally {
                        clearTimeout(timer);
                        this.disconnect();
                    }
                };
            }
            
        });
    }
}

//Função para montar as conexões modbus e suas devidas tarefas de read e write
async function scanModbus(connections) {

    const modbusVariables = {};
    
    try {
        for (const connection of connections) {
            const Device = connection.device;
            const reads = connection.reads;
            const writes = connection.writes;

            for (const write of writes) {
                try {
                    if(write) {
                        await Device.writeModbus(write.functionCode, write.address, write.value, write.dataType);
                    }
                } catch (error) {
                    console.error(`Write Error - device:${connection.device.name}, fc:${write.functionCode}, address:${write.address}, value:${write.value}, dataType:${write.dataType}, error:${error.message}`);
                }
            }

            for (const read of reads) {
                try {
                    if (read) {
                        const values = await Device.readModbus(read.functionCode, read.address, read.elements, read.dataType);

                        // console.log(values) debug
                        values.forEach((value, index) => {
                            const variableName = read.variablesName[index];
                            modbusVariables[variableName] = value;
                        
                        });
                    }
                    
                } catch (error) {
                    console.error(`Read Error - device:${connection.device.name}, fc:${read.functionCode}, address:${read.address}, elements:${read.elements}, dataType:${read.dataType}, error:${error.message}`);
                }
            }
        }

    } catch (err) {
        console.error(`executeModbus Error - ${err.message}`);
    }

    return modbusVariables
}

//Busca conexões e tasks do DB e monta as conexões para entrar no bloco de scanModbus
const getConnectionsFromDb = async () => {
    
    let connections = []
    try {
        const devices = await Device.find()

        //Monta Conexões apartir dos dados do mongo
        connections = devices.map((item) => {
            const task = item.task

            const reads = task.map((read) => {
                if(read.functionType === 'read') {
                    return read
                }
            })

            const writes = task.map((write) => {
                if(write.functionType === 'write') {
                    return write
                }
            })

            const obj = {
                device: new DeviceConfigurator (item.name, item.ip, item.port, item.unitId, item.timeout, item.baseAddress),
                writes: writes,
                reads: reads
            }

            return obj
        })

    } catch (err) {
        throw err
    }

    return connections
}


module.exports = { DeviceConfigurator, scanModbus, getConnectionsFromDb };
