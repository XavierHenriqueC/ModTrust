import { useContext, useEffect, useState } from 'react'
import { Context } from '../../../context/Context'

import '../Config.css'


const MODBUS = () => {

    const { network, setNetwork } = useContext(Context)
 
    return (
        <div className='config-container'>
            <p className='title'>MODBUS</p>
            <form>
                <div className="form-control">
                    <label>
                        <span>Scan Rate (Seconds):</span>
                        <input type="number" value={network.modbusScanRate}  onChange={(e) => setNetwork({ ...network, modbusScanRate: e.target.value })}/>
                    </label>
                </div>
            </form>
        </div>
    )
}

export default MODBUS