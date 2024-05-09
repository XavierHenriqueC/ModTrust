import { useContext, useState, useEffect } from 'react'
import { Context } from '../../context/Context'
import { editNetworkById } from '../utils/API'

import Lan from '../components/Network/Lan'
import Wan from '../components/Network/Wan'
import MQTTClient  from '../components/Network/MQTTClient'
import WIFIClient from '../components/Network/WIFIClient'
import Serial from '../components/Network/Serial'
import Modbus from '../components/Network/Modbus'
import NetworkStatus from '../components/Network/NetworkStatus'

import './Screens.css'

const Network = () => {
  
  const { network, setFailMessage } = useContext(Context)

  const handleSaveButton = async () => {
      
    try {

      const Network = await editNetworkById(
        network._id, 
        network.mode, 
        network.ip, 
        network.netmask, 
        network.gateway, 
        network.modeWan, 
        network.ipWan, 
        network.netmaskWan, 
        network.gatewayWan, 
        network.wifiEnable, 
        network.wifiSSID, 
        network.wifiPassword, 
        network.serialBaudRate, 
        network.serialParity, 
        network.serialDataBits, 
        network.serialStopBits,
        network.modbusScanRate, 
        network.mqttHost, 
        network.mqttPort, 
        network.mqttUsername, 
        network.mqttPassword, 
        network.mqttTopic, 
        network.mqttSubscribe, 
        network.defaultConfigs
      )
      
      console.log(Network)

    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <div className="main-center">
      <div className='container-center-left'>
        <div className="network-contents">
          <Lan />
          <MQTTClient />
          <Wan />
          <WIFIClient />
          <Serial />
          <Modbus />
        </div>
        <div className="buttons">
            <button onClick={() => handleSaveButton()}>Save</button>
        </div>
      </div>
      <div className='container-center-right'>
        <NetworkStatus />
      </div>
    </div>
  )
}

export default Network