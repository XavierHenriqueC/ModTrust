import { useContext, useEffect, useState } from 'react'
import { Context } from '../../context/Context'

import './Config.css'

const MQTTClient = () => {

    const { network, setNetwork } = useContext(Context)


    return (
        <div className='config-container'>
            <p className='title'>MQTT Client</p>
            <form>
                <div className="form-control">
                    <label>
                        <span>Host:</span>
                        <input type="text" value={network.mqttHost} onChange={(e) => setNetwork({ ...network, mqttHost: e.target.value })}/>
                    </label>
                </div>
                <div className="form-control">
                    <label>
                        <span>Port:</span>
                        <input type="number" value={network.mqttPort} onChange={(e) => setNetwork({ ...network, mqttPort: e.target.value })}/>
                    </label>
                </div>
                <div className="form-control">
                    <label>
                        <span>Username:</span>
                        <input type="text" value={network.mqttUsername} onChange={(e) => setNetwork({ ...network, mqttUsername: e.target.value })}/>
                    </label>
                </div>
                <div className="form-control">
                    <label>
                        <span>Password:</span>
                        <input type="password" value={network.mqttPassword} onChange={(e) => setNetwork({ ...network, mqttPassword: e.target.value })}/>
                    </label>
                </div>
                <div className="form-control">
                    <label>
                        <span>Publish Topic:</span>
                        <input type="text" value={network.mqttTopic} onChange={(e) => setNetwork({ ...network, mqttTopic: e.target.value })}/>
                    </label>
                </div>
                <div className="form-control">
                    <label>
                        <span>Subscribe Topic:</span>
                        <input type="text" value={network.mqttSubscribe} onChange={(e) => setNetwork({ ...network, mqttSubscribe: e.target.value })}/>
                    </label>
                </div>
            </form>
        </div>
    )
}

export default MQTTClient