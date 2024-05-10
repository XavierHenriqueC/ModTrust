import { createContext, useState, useEffect } from "react";

import { getAllDevices, getAllModbusData, getAllNetworks, getAllTasks } from "../src/utils/API";

export const Context = createContext();

export const ContextProvider =({ children }) => {

  const [failMessage ,setFailMessage] = useState("")

  const [ network, setNetwork ] = useState({})
  const [ devices, setDevices ] = useState([])
  const [ tasks, setTasks ] = useState([])
  const [ modbusData, setModbusData ] = useState([])

  //Função para puxar configurações de Network
  const getInfos = async () => {
    
    try {
      
      //Networks
      const allnetworks = await getAllNetworks()
      const Network = allnetworks.network[0]
      
      //Devices
      const Devices = await getAllDevices()

      //Tasks
      const Tasks = await getAllTasks()

      //Modbus Data
      const ModbusData = await getAllModbusData()

      setNetwork(Network)
      setDevices(Devices.devices)
      setTasks(Tasks.tasks)
      setModbusData(ModbusData)

    } catch (error) {
      
      console.log(error)
      //Trata mensagem de erro
      const err = `${error}`
      let messageError = ""
      //Trata erro de conexão com servidor
      if(err === "TypeError: Failed to fetch") {
        messageError = "Falha ao conectar com o BackEnd Node.JS"
      } else {
        messageError = err.split('":"')[1].slice(0, -2)
      }
      
      //Ativa label de fail
      setFailMessage(messageError);
    }
  }

  useEffect(() => {
    getInfos()
  },[])

  const getModbusData = async () => {
    try {
      const ModbusData = await getAllModbusData()
      setModbusData(ModbusData)
    } catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if(network.modbusScanRate) {
      setInterval(() => {
        getModbusData()
      },network.modbusScanRate)
    }
  },[network])
  
  return (
    <Context.Provider value={{ 
      //Inserir variáveis aqui
      network,
      setNetwork,
      failMessage,
      setFailMessage,
      devices,
      getInfos,
      tasks,
      setTasks,
      modbusData,
    }}
    >
      {children}
    </Context.Provider>
  )
}