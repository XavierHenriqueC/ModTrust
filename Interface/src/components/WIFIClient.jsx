import { useContext, useEffect, useState } from 'react'
import { Context } from '../../context/Context'

import './Config.css'

const WIFIClient = () => {

    const { network, setNetwork } = useContext(Context)

    console.log(network.wifiEnable)

    return (
        <div className='config-container'>
            <p className='title'>Wi-Fi Client Mode</p>
            <form>
                <div className="form-control">
                    <label>
                        <span>Enable:</span>
                        <input type="checkbox" checked={network.wifiEnable} onChange={(e) => setNetwork({ ...network, wifiEnable: e.target.checked})}/>
                    </label>
                </div>
                <div className="form-control">
                    <label>
                        <span>Availables:</span>
                        <select disabled={!network.wifiEnable}>
                            
                        </select>
                    </label>
                </div>
                <div className="form-control">
                    <label>
                        <span>Manual SSID:</span>
                        <input type="text" value={network.wifiSSID} disabled={!network.wifiEnable} onChange={(e) => setNetwork({ ...network, wifiSSID: e.target.value })}/>
                    </label>
                </div>
                <div className="form-control">
                    <label>
                        <span>Password:</span>
                        <input type="password" value={network.wifiPassword} disabled={!network.wifiEnable} onChange={(e) => setNetwork({ ...network, wifiPassword: e.target.value })}/>
                    </label>
                </div>
            </form>
        </div>
    )
}

export default WIFIClient