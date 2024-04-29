import { useContext, useEffect, useState } from 'react'
import { Context } from '../../context/Context'

import './Config.css'


const Wan = () => {

    const { network, setNetwork } = useContext(Context)
 
    return (
        <div className='config-container'>
            <p className='title'>WAN PORT (IPv4)</p>
            <form>
                <div className="form-control">
                    <label>
                        <span>DHCP:</span>
                        <input type="checkbox" checked={network.modeWan === "dhcp" ? true : false} onChange={(e) => setNetwork({ ...network, modeWan: e.target.checked ? "dhcp" : "static" })}/>
                    </label>
                </div>
                <div className="form-control">
                    <label>
                        <span>IP address:</span>
                        <input type="text" pattern="[0-9.]*" value={network.ipWan} disabled={network.modeWan === "dhcp" ? true : false} onChange={(e) => setNetwork({ ...network, ipWan: e.target.value })}/>
                    </label>
                </div>
                <div className="form-control">
                    <label>
                        <span>Subnet mask:</span>
                        <input type="text" pattern="[0-9.]*" value={network.netmaskWan} disabled={network.modeWan === "dhcp" ? true : false} onChange={(e) => setNetwork({ ...network, netmaskWan: e.target.value })}/>
                    </label>
                </div>
                <div className="form-control">
                    <label>
                        <span>Default Gateway:</span>
                        <input type="text" pattern="[0-9.]*" value={network.gatewayWan} disabled={network.modeWan === "dhcp" ? true : false} onChange={(e) => setNetwork({ ...network, gatewayWan: e.target.value })}/>
                    </label>
                </div>
            </form>
        </div>
    )
}

export default Wan