import { createContext, useState, useEffect } from "react";

import { getAllDevices, getAllNetworks, getAllTasks } from "../src/utils/API";

export const Context = createContext();

export const ContextProvider =({ children }) => {

  const [failMessage ,setFailMessage] = useState("")

  const [ network, setNetwork ] = useState({})
  const [ devices, setDevices ] = useState([])
  const [ tasks, setTasks ] = useState([])

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
      
      setNetwork(Network)
      setDevices(Devices.devices)
      setTasks(Tasks.tasks)

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
    }}
    >
      {children}
    </Context.Provider>
  )
}