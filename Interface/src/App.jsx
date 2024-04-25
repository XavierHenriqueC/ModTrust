import { useState } from 'react'
import './App.css'

import Logo from "./img/favicon_round.png"
import Network from './routes/Network'

function App() {

  const [navState, setNavState] = useState({network: true, devices: false, tasks: false})

  //Função para navegação da sidebar
  const handlerNav = (button) => {
    if(button === "network") {
      setNavState({network: true, devices: false, tasks: false})
    }

    if(button === "devices") {
      setNavState({network: false, devices: true, tasks: false})
    }

    if(button === "tasks") {
      setNavState({network: false, devices: false, tasks: true})
    }
  }
 
  return (
    <div className='app'>
      <div className="header">
        <div className="logo">
          <img src={Logo} alt="logo datatrust" />
        </div>
        <p>TrustBus Gateway</p>
        <p>MAC: awfa788556dwd</p>
      </div>
      <div className="body">
        <div className="sidebar">
          <div className="nav">
            <div onClick={() => handlerNav("network")} className={`button ${navState.network ? "selected" : ""}`}>
              <ion-icon name="git-network-outline"></ion-icon>
              <p>Network</p>
            </div>
            <div onClick={() => handlerNav("devices")} className={`button ${navState.devices ? "selected" : ""}`}>
              <ion-icon name="cube-outline"></ion-icon>
              <p>Devices</p>
            </div>
            <div onClick={() => handlerNav("tasks")} className={`button ${navState.tasks ? "selected" : ""}`}>
              <ion-icon name="document-attach-outline"></ion-icon>
              <p>Tasks</p>
            </div>
          </div>

        </div>
        <div className="center">
            {navState.network && <Network />}
        </div>
        
      </div>
    </div>
  )
}

export default App
