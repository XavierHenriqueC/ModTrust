import { useContext, useEffect, useState } from 'react'
import { Context } from '../../../context/Context'

import '../Config.css'

const Lan = () => {

    const { network, setNetwork } = useContext(Context)
 
    return (
        <div className='config-container'>
            <p className='title'>LAN PORT (IPv4)</p>
            <form>
                <div className="form-control">
                    <label>
                        <span>DHCP:</span>
                        <input type="checkbox" checked={network.mode === "dhcp" ? true : false} onChange={(e) => setNetwork({ ...network, mode: e.target.checked ? "dhcp" : "static" })}/>
                    </label>
                </div>
                <div className="form-control">
                    <label>
                        <span>IP address:</span>
                        <input type="text" pattern="[0-9.]*" value={network.ip} disabled={network.mode === "dhcp" ? true : false} onChange={(e) => setNetwork({ ...network, ip: e.target.value })}/>
                    </label>
                </div>
                <div className="form-control">
                    <label>
                        <span>Subnet mask:</span>
                        <input type="text" pattern="[0-9.]*" value={network.netmask} disabled={network.mode === "dhcp" ? true : false} onChange={(e) => setNetwork({ ...network, netmask: e.target.value })}/>
                    </label>
                </div>
                <div className="form-control">
                    <label>
                        <span>Default Gateway:</span>
                        <input type="text" pattern="[0-9.]*" value={network.gateway} disabled={network.mode === "dhcp" ? true : false} onChange={(e) => setNetwork({ ...network, gateway: e.target.value })}/>
                    </label>
                </div>
            </form>
        </div>
    )
}

export default Lan