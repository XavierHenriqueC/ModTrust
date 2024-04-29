import { createContext, useState, useEffect } from "react";

import { getAllNetworks } from "../src/utils/API";

export const Context = createContext();

export const ContextProvider =({ children }) => {

  const [failMessage ,setFailMessage] = useState("")

  const [ network, setNetwork ] = useState({})

  //Função para puxar configurações de Network
  const getNetwork = async () => {
    
    try {
      const allnetworks = await getAllNetworks()
      const Network = allnetworks.network[0]
     
      setNetwork(Network)

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
    getNetwork()
  },[])
    
  return (
    <Context.Provider value={{ 
      //Inserir variáveis aqui
      network,
      setNetwork,
      failMessage,
      setFailMessage,
    }}
    >
      {children}
    </Context.Provider>
  )
}