//Função para checar se um dado é do tipo float
function isFloat(number) {
    return Number(number) === number && number % 1 !== 0;
}

//Função para verificar numeros pares
function isEven(numero) {
    if (numero % 2 === 0) {
        return true;
    } else {
        return false;
    }
}

//LIDA COM VALORES INT16 --------------------------------------------------------------------------------------------------------------

//Transforma 1 registrador em um valor int16
function modbusRegisterToInt16(register) {
    // Converte o valor do registrador para um buffer de 2 bytes
    let buffer = Buffer.alloc(2);
    buffer.writeUInt16LE(register);

    // Lê o valor int16 do buffer
    let intValue = buffer.readInt16LE(0);

    // Retorna o valor int16
    return intValue;
}

//Transforma um valor int16 em um registrador
function int16ToModbusRegister(value) {
    // Converte o valor int16 para um buffer de 2 bytes
    let buffer = Buffer.alloc(2);
    buffer.writeInt16LE(value);

    // Lê o valor do buffer como um registrador de 16 bits
    let registerValue = buffer.readUInt16LE(0);

    // Retorna o valor do registrador
    return registerValue;
}

//LIDA COM VALORES INT32 --------------------------------------------------------------------------------------------------------------

//Transforma 2 registradores em um valor int32
function modbusRegistersToInt32(register1, register2) {

    // Combina os dois registradores em um buffer de 4 bytes
    let buffer = Buffer.alloc(4);
    buffer.writeUInt16LE(register1, 0);
    buffer.writeUInt16LE(register2, 2);

    // Lê o valor int32 do buffer
    let intValue = buffer.readInt32LE(0);

    // Retorna o valor int32
    return intValue;
}

//Transforma um valor int32 em 2 registradores
function int32ToModbusRegisters(value) {

    // Converte o valor int32 para um buffer de 4 bytes
    let buffer = Buffer.alloc(4);
    buffer.writeInt32LE(value, 0);

    // Extrai os bytes do buffer e converte para valores inteiros de 16 bits
    let register1 = buffer.readUInt16LE(0);
    let register2 = buffer.readUInt16LE(2);

    // Retorna um array com os dois registradores
    return [register1, register2];
}

//LIDA COM VALORES UINT32 ---------------------------------------------------------------------------------------------------------------

//Transforma 2 registradores em um valor Uint32
function modbusRegistersToUInt32(register1, register2) {

    // Combina os dois registradores em um buffer de 4 bytes
    let buffer = Buffer.alloc(4);
    buffer.writeUInt16LE(register1, 0);
    buffer.writeUInt16LE(register2, 2);

    // Lê o valor uint32 do buffer
    let uintValue = buffer.readUInt32LE(0);

    // Retorna o valor uint32
    return uintValue;
}

//Transforma um valor Uint32 em 2 registradores
function uint32ToModbusRegisters(value) {

    // Converte o valor uint32 para um buffer de 4 bytes
    let buffer = Buffer.alloc(4);
    buffer.writeUInt32LE(value, 0);

    // Extrai os bytes do buffer e converte para valores inteiros de 16 bits
    let register1 = buffer.readUInt16LE(0);
    let register2 = buffer.readUInt16LE(2);

    // Retorna um array com os dois registradores
    return [register1, register2];
}

//LIDA COM VALORES FLOAT32 --------------------------------------------------------------------------------------------------------------

//Transforma 2 registradores em um valor float32
function modbusRegistersToFloat32(register1, register2) {

    // Combina os dois registradores em um buffer de 4 bytes
    let buffer = Buffer.alloc(4);
    buffer.writeUInt16LE(register1, 0);
    buffer.writeUInt16LE(register2, 2);

    // Lê o valor float32 do buffer
    let floatValue = buffer.readFloatLE(0);

    // Retorna o valor float32
    return Number(floatValue.toFixed(1));
}

//Transforma um valor float32 em 2 registradores
function float32ToModbusRegisters(value) {
    // Converte o valor float32 para um buffer de 4 bytes
    let buffer = Buffer.alloc(4);
    buffer.writeFloatLE(value, 0);

    // Extrai os bytes do buffer e converte para valores inteiros de 16 bits
    let register1 = buffer.readUInt16LE(0);
    let register2 = buffer.readUInt16LE(2);

    // Retorna um array com os dois registradores
    return [register1, register2];
}

module.exports = {
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
}