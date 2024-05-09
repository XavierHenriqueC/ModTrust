import { useContext, useEffect, useState } from 'react';

import { registerNewTask, registerVarToMqtt } from '../../utils/API';

import { Context } from '../../../context/Context';

import './Tasks.css'

const AddTask = ({ close, deviceId }) => {

  const [newTask, setNewTask] = useState({functionCode: 1, dataType: "bool", address: 1, elements: 1, variablesName: []})

  const [varsToMqtt, setVarsToMqtt] = useState([])

  const [failMessage, setFailMessage] = useState({status: false, message: ''})

  const addTask = async () => {
    try {

      await registerNewTask( deviceId, "read", newTask.functionCode, newTask.address, newTask.elements, newTask.dataType, newTask.variablesName)

      await Promise.all(varsToMqtt.map(async(item) => {
        await registerVarToMqtt(item)
      }))

      close(true)

    } catch (error) {
      console.log(error)
      //Trata mensagem de erro
      const err = `${error}`
      let messageError = ""
      //Trata erro de conexão com servidor
      if(err === "TypeError: Failed to fetch") {
        messageError = "Falha ao conectar com o servidor"
      } else {
        messageError = err.split('":"')[1].slice(0, -2)
      }
      //Ativa label de fail
      setFailMessage({status: true, message: messageError});
    } 

  }

  const handleSubmit = () => {
    addTask()
  }

  const setAddress = (e) => {
    let value = e.target.value
    if(value === "") {
      setNewTask({ ...newTask, address:0})
      return
    }
    setNewTask({ ...newTask, address: parseInt(value)})
  }

  const setElements = (e) => {
    let value = e.target.value
    if(value === "") {
      setNewTask({ ...newTask, elements:0})
      return
    }
    setNewTask({ ...newTask, elements: parseInt(value)})
  }

  useEffect(() => {
    setFailMessage({status: false, message: ""})
    console.log(newTask)
 
    if(newTask.address < 0 || newTask.address === "" || newTask.address == NaN) {
      setNewTask({ ...newTask, address:0})
    }

    if(newTask.address > 65535) {
      setNewTask({ ...newTask, address:65535})
    }

    if(newTask.elements < 0 || newTask.elements === "" || newTask.elements == NaN) {
      setNewTask({ ...newTask, elements:0})
    }

    if(newTask.elements > 254) {
      setNewTask({ ...newTask, elements:254})
    }

  },[newTask])

  useEffect (() => {
    handleQntVariaveis()
    setVarsToMqtt([])
  },[newTask.functionCode, newTask.dataType, newTask.elements])

  useEffect(() => {
    if(newTask.functionCode === 3 || newTask.functionCode === 4) {
      console.log('entrou aqui')
      setNewTask({...newTask, dataType: 'uint16'}) 
    }
  },[newTask.functionCode])

  const handleQntVariaveis = () => {

    const dataType = newTask.dataType
    const functionCode = newTask.functionCode

    if(functionCode == "1" || functionCode == "2" || dataType === "uint16" || dataType === "int16") {
     
      const aux = []
      for (let index = 0; index < newTask.elements; index++) {
        aux.push('')
      }

      setNewTask({...newTask, variablesName: aux})

    } else {
      
      const aux = []
      for (let index = 0; index < newTask.elements / 2; index++) {
        aux.push('')
      }

      setNewTask({...newTask, variablesName: aux})
    }
  
  }

  const handleChangeVariablesName = (value, i) => {
    const newVariablesName = newTask.variablesName.map((item, index) => {
      if(i === index) {
        return value
      } else {
        return item
      }
    })

    setNewTask({...newTask, variablesName: newVariablesName})
  }

  const handleSelectToMqtt = (value, i) => {
    
    newTask.variablesName.forEach((item, index) => {
      if(i === index) {
        if(value) {
          setVarsToMqtt([...varsToMqtt, item])
        } else {
          let arr = varsToMqtt
          let novoArray = arr.filter(function (string) {
          return string !== item;
          });
          setVarsToMqtt(novoArray)
        }
      }
    })
  }

  useEffect(() => {
    console.log(varsToMqtt)
  },[varsToMqtt])

  return (
    <div className="add-task">
      <p>Add New Task</p>
      <div className="form-control">
        <label>
          <span>Initial Address:</span>
          <input type="number"  value={newTask.address} onChange={(e) => setAddress(e)} />
        </label>
      </div>

      <div className="form-control">
        <label>
          <span>Elements:</span>
          <input type="number"  value={newTask.elements} onChange={(e) => setElements(e)} />
        </label>
      </div>

      <div className="form-control">
        <label>
          <span>Function Code:</span>
          <select onChange={(e) => setNewTask({ ...newTask, functionCode: parseInt(e.target.value)})} value={newTask.functionCode}>
            <option value={1}>1 - Read Coils Status</option>
            <option value={2}>2 - Read Input Status</option>
            <option value={3}>3 - Read Holding Registers</option>
            <option value={4}>4 - Read Input Registers</option>
          </select>
        </label>
      </div>

      <div className="form-control">
        <label>
          <span>Data Type:</span>
          
            {newTask.functionCode === 3 || newTask.functionCode === 4 ? (
              <select onChange={(e) => setNewTask({ ...newTask, dataType: e.target.value})} value={newTask.dataType}>
                <option value={"uint16"}>uint16</option>
                <option value={"int16"}>int16</option>
                <option value={"uint32"}>uint32</option>
                <option value={"int32"}>int32</option>
                <option value={"float32"}>float32</option>
              </select>
            ) : (
              <select onChange={(e) => setNewTask({ ...newTask, dataType: e.target.value})} value={newTask.dataType}>
                <option value={"bool"}>bool</option>
              </select>
            )}
        </label>
      </div>

      <div className="form-control variables-name">
        <label>
          <table>
            <thead>
                <tr>
                  <th>Addresses</th>
                  <th>Name</th>
                  <th>MQTT Publish</th>
                </tr>
            </thead>
            <tbody>
              {newTask.variablesName.map((item, i) =>(
                <tr key={i}>
                  <td>{newTask.dataType === "uint16" || newTask.dataType === "int16" || newTask.dataType === "bool" ? (newTask.address + i) : (`${newTask.address + (i * 2)} - ${newTask.address + (i * 2) + 1}`)}</td>
                  <td><input value={item} onChange={(e) => handleChangeVariablesName(e.target.value, i)}></input></td>
                  <td style={{width: '4rem'}}><input style={{height:'20px', width:"20px", margin:'0 auto'}} type='checkbox' onChange={(e) => handleSelectToMqtt(e.target.checked, i)}></input></td>
                </tr>
              ))}
            </tbody>
          </table>
        </label>
      </div>

      <div className="form-control">
        <button className='create-button' onClick={() => handleSubmit ()}>Create</button>
        <button onClick={() => close(true)}>Close</button>
      </div>
      <div className="error-label">
        {failMessage.status && <p>{failMessage.message}</p>}
      </div>
    </div>
  )
}

export default AddTask