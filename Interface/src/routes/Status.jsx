import { useState, useEffect, useContext } from "react"
import { Context } from "../../context/Context"

import './Screens.css'
import './Status.css'

const Status = () => {

  const { modbusData, devices } = useContext(Context)
  const [itens, setItens] = useState([])

  const handleItens = () => {
    const Itens = devices.flatMap((device) => {
      return device.task.flatMap((task) => {
        return task.variablesName.map((vars, i) => {
          return {
            device: device.name,
            functionCode: task.functionCode,
            dataType: task.dataType,
            addresses: task.dataType === "uint16" || task.dataType === "int16" || task.dataType === "bool" ? (task.address + i) : (`${task.address + (i * 2)} - ${task.address + (i * 2) + 1}`),
            variable: vars.variable,
            mqttpub: vars.mqttpub ? 'Yes' : 'No',
            value: modbusData[vars.variable]
          }
        })
      })
    })

    setItens(Itens)
  }

  useEffect(() => {
    handleItens()
  }, [modbusData, devices])
 

  return (
    <div className="main-center">
      <div className='container-center-left'>
        <div className="device-contents">
          <div className="table-header">
          </div>
          <div className="table-body">
            <table>
              <thead>
                <tr>
                  <th>Device</th>
                  <th>Function Code</th>
                  <th>Datatype</th>
                  <th>Addresses</th>
                  <th>MQTT Publish</th>
                  <th>Variable</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {itens.map((item) => (
                  <tr key={item.variable}>
                    <td>{item.device}</td>
                    <td>{item.functionCode}</td>
                    <td>{item.dataType}</td>
                    <td>{item.addresses}</td>
                    <td>{item.mqttpub ? 'Yes' : 'No'}</td>
                    <td>{item.variable}</td>
                    <td>{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Status