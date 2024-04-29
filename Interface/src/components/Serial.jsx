import { useContext, useEffect, useState } from 'react'
import { Context } from '../../context/Context'

import './Config.css'

const Serial = () => {

    const { network, setNetwork } = useContext(Context)

    return (
        <div className='config-container'>
            <p className='title'>SERIAL PORT (RS-485)</p>
            <form>
                <div className="form-control">
                    <label>
                        <span>Baud Rate:</span>
                        <select onChange={(e) => setNetwork({ ...network, serialBaudRate: e.target.value})} value={network.serialBaudRate}>
                            <option value={4800}>4800</option>
                            <option value={9600}>9600</option>
                            <option value={19200}>19200</option>
                            <option value={38400}>38400</option>
                            <option value={57600}>57600</option>
                            <option value={115200}>115200</option>
                        </select>
                    </label>
                </div>
                <div className="form-control">
                    <label>
                        <span>Parity:</span>
                        <select onChange={(e) => setNetwork({ ...network, serialParity: e.target.value})} value={network.serialParity}>
                            <option value={"none"}>none</option>
                            <option value={"odd"}>odd</option>
                            <option value={"even"}>even</option>
                        </select>
                    </label>
                </div>
                <div className="form-control">
                    <label>
                        <span>Data bits:</span>
                        <select onChange={(e) => setNetwork({ ...network, serialDataBits: e.target.value})} value={network.serialDataBits}>
                            <option value={7}>7</option>
                            <option value={8}>8</option>
                        </select>
                    </label>
                </div>
                <div className="form-control">
                    <label>
                        <span>Stop bits:</span>
                        <select onChange={(e) => setNetwork({ ...network, serialStopBits: e.target.value})} value={network.serialStopBits}>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                        </select>
                    </label>
                </div>
                
            </form>
        </div>
    )
}

export default Serial