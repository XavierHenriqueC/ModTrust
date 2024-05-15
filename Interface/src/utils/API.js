//Configurações Gerais
const urlBase = 'http://host.internal.docker:3000';


const Headers = {
  "Content-Type": "application/json",
}

//Devices CRUD
export async function getAllDevices() {

  const url = `${urlBase}/device/getall`;

  const options = {
    mode: 'cors',
    method: "GET",
    headers: Headers,
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const data = await response.json();
    return data; // Return the parsed JSON data

  } catch (error) {
    throw error; // Re-throw the error for handling outside the function
  }
}

export async function getDeviceById (id) {

  const url = `${urlBase}/device/getdevicebyid`;

  const body = {
    id: id
  }

  const options = {
    mode: 'cors',
    method: "POST",
    headers: Headers,
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const data = await response.json();
    return data; // Return the parsed JSON data

  } catch (error) {
    throw error; // Re-throw the error for handling outside the function
  }
}

export async function registerNewDevice(type, name, ip, port, unitId, timeout, baseAddress) {

  const url = `${urlBase}/device/register`;

  const body = {
    type: type,
    name: name,
    ip: ip,
    port: port,
    unitId: unitId,
    timeout: timeout,
    baseAddress: baseAddress
  }

  const options = {
    mode: 'cors',
    method: "POST",
    headers: Headers,
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const data = await response.json();
    return data; // Return the parsed JSON data

  } catch (error) {
    throw error; // Re-throw the error for handling outside the function
  }
}

export async function editDeviceById(id, type, name, ip, port, unitId, timeout, baseAddress) {

  const url = `${urlBase}/device/editdevicebyid`;

  const body = {
    type: type,
    id: id,
    name: name,
    ip: ip,
    port: port,
    unitId: unitId,
    timeout: timeout,
    baseAddress: baseAddress
  }

  const options = {
    mode: 'cors',
    method: "PATCH",
    headers: Headers,
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const data = await response.json();
    return data; // Return the parsed JSON data

  } catch (error) {
    throw error; // Re-throw the error for handling outside the function
  }
}

export async function deleteDevice (id) {

  const url = `${urlBase}/device/deletedevicebyid`;

  const body = {
    id: id
  }

  const options = {
    mode: 'cors',
    method: "DELETE",
    headers: Headers,
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const data = await response.json();
    return data; // Return the parsed JSON data

  } catch (error) {
    throw error; // Re-throw the error for handling outside the function
  }
}

//Tasks CRUD
export async function getAllTasks () {

  const url = `${urlBase}/task/getall`;

  const options = {
    mode: 'cors',
    method: "GET",
    headers: Headers,
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const data = await response.json();
    return data; // Return the parsed JSON data

  } catch (error) {
    throw error; // Re-throw the error for handling outside the function
  }
}

export async function getTaskById (id) {

  const url = `${urlBase}/task/gettaskbyid`;

  const body = {
    id: id
  }

  const options = {
    mode: 'cors',
    method: "POST",
    headers: Headers,
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    
    const data = await response.json();
    return data; // Return the parsed JSON data

  } catch (error) {
    throw error; // Re-throw the error for handling outside the function
  }
}

export async function registerNewTask (deviceId, functionType, functionCode, address, elements, dataType, variablesName) {

  const url = `${urlBase}/task/register`;

  const body = {
    deviceId: deviceId,
    functionType: functionType,
    functionCode: functionCode,
    address: address,
    elements: elements,
    dataType: dataType,
    variablesName: variablesName
  }

  const options = {
    mode: 'cors',
    method: "POST",
    headers: Headers,
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const data = await response.json();
    return data // Return the parsed JSON data


  } catch (error) {
    throw error; // Re-throw the error for handling outside the function
  }
}

export async function editTaskById (id, functionType, functionCode, address, elements, dataType, variablesName) {

  const url = `${urlBase}/task/edittaskbyid`;

  const body = {
    id: id,
    functionType: functionType,
    functionCode: functionCode,
    address: address,
    elements: elements,
    dataType: dataType,
    variablesName: variablesName
  }

  const options = {
    mode: 'cors',
    method: "PATCH",
    headers: Headers,
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const data = await response.json();
    return data; // Return the parsed JSON data

  } catch (error) {
    throw error; // Re-throw the error for handling outside the function
  }
}

export async function deleteTask (id) {

  const url = `${urlBase}/task/deletetaskbyid`;

  const body = {
    id: id
  }

  const options = {
    mode: 'cors',
    method: "DELETE",
    headers: Headers,
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const data = await response.json();
    return data; // Return the parsed JSON data

  } catch (error) {
    throw error; // Re-throw the error for handling outside the function
  }
}

//Modbus Data CRUD
export async function getAllModbusData() {

  const url = `${urlBase}/modbusdata/getall`;

  const options = {
    mode: 'cors',
    method: "GET",
    headers: Headers,
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const data = await response.json();
    return data; // Return the parsed JSON data

  } catch (error) {
    throw error; // Re-throw the error for handling outside the function
  }
}


//Network CRUD
export async function getAllNetworks() {

  const url = `${urlBase}/network/getall`;

  const options = {
    mode: 'cors',
    method: "GET",
    headers: Headers,
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const data = await response.json();
    return data; // Return the parsed JSON data

  } catch (error) {
    throw error; // Re-throw the error for handling outside the function
  }
}

export async function editNetworkById(id, mode, ip, netmask, gateway, modeWan, ipWan, netmaskWan, gatewayWan, wifiEnable, wifiSSID, wifiPassword, serialBaudRate, serialParity, serialDataBits, serialStopBits, modbusScanRate, mqttHost, mqttPort, mqttUsername, mqttPassword, mqttTopic, mqttSubscribe, defaultConfigs) {

  const url = `${urlBase}/network/editnetworkbyid`;

  const body = {
    id: id,

    mode: mode, 
    ip: ip, 
    netmask: netmask, 
    gateway: gateway,

    modeWan: modeWan, 
    ipWan: ipWan, 
    netmaskWan: netmaskWan, 
    gatewayWan: gatewayWan,

    wifiEnable: wifiEnable, 
    wifiSSID: wifiSSID, 
    wifiPassword: wifiPassword,
    
    serialBaudRate: serialBaudRate, 
    serialParity: serialParity, 
    serialDataBits: serialDataBits, 
    serialStopBits: serialStopBits,

    modbusScanRate: modbusScanRate,

    mqttHost: mqttHost, 
    mqttPort: mqttPort, 
    mqttUsername: mqttUsername, 
    mqttPassword: mqttPassword, 
    mqttTopic: mqttTopic, 
    mqttSubscribe: mqttSubscribe, 

    defaultConfigs: defaultConfigs
  }

  const options = {
    mode: 'cors',
    method: "PATCH",
    headers: Headers,
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const data = await response.json();
    return data; // Return the parsed JSON data

  } catch (error) {
    throw error; // Re-throw the error for handling outside the function
  }
}




