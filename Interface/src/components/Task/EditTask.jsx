import { useContext, useEffect, useState } from 'react';

import { getTaskById, editTaskById, getAllVarsToMqtt } from '../../utils/API';

import './Tasks.css'

const EditTask = ({ close, id }) => {

  const [task, setTask] = useState({})

  const [failMessage, setFailMessage] = useState({status: false, message: ''})

  const [varsToMqtt, setVarsToMqtt] = useState([])

  const [selectedItens, setSelectedItens ] = useState([])

  const editTask = async () => {
    try {

      await editTaskById( id, "read", task.functionCode, task.address, task.elements, task.dataType, task.variablesName)
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

  const getTask = async () => {
    try {
      const Task = await getTaskById(id)
      setTask(Task.task)
    } catch (err) {
      console.log(err)
    }
  }

  const getVarsToMqtt = async () => {
    try {

      const VarsToMqtt = await getAllVarsToMqtt()
      
      setVarsToMqtt(VarsToMqtt)
      
      const aux = VarsToMqtt.map((item) => {
        return item.name
      })

      setSelectedItens(aux)


    } catch (err) {
        console.log(err)
    }
  } 

  const handleSubmit = () => {
    editTask()
  }

  const setAddress = (e) => {
    let value = e.target.value
    if(value === "") {
      setTask({ ...task, address:0})
      return
    }
    setTask({ ...task, address: parseInt(value)})
  }

  const setElements = (e) => {
    let value = e.target.value
    if(value === "") {
      setTask({ ...task, elements:0})
      return
    }
    setTask({ ...task, elements: parseInt(value)})
  }

  useEffect(() => {
    setFailMessage({status: false, message: ""})
    //console.log(task)
 
    if(task.address < 0 || task.address === "" || task.address == NaN) {
      setTask({ ...task, address:0})
    }

    if(task.address > 65535) {
      setTask({ ...task, address:65535})
    }

    if(task.elements < 0 || task.elements === "" || task.elements == NaN) {
      setTask({ ...task, elements:0})
    }

    if(task.elements > 254) {
      setTask({ ...task, elements:254})
    }

  },[task])

  useEffect (() => {
    handleQntVariaveis()
  },[task.functionCode, task.dataType, task.elements])

  const handleQntVariaveis = () => {
    const dataType = task.dataType
    const functionCode = task.functionCode
   
    if(functionCode == "1" || functionCode == "2" || dataType === "uint16" || dataType === "int16") {
     
      const aux = []
      for (let index = 0; index < task.elements; index++) {
        aux.push('')
      }

      setTask({...task, variablesName: aux})

    } else {
      
      const aux = []
      for (let index = 0; index < task.elements / 2; index++) {
        aux.push('')
      }

      setTask({...task, variablesName: aux})
    }
  
  }

  const handleChangeVariablesName = (value, i) => {
    const newVariablesName = task.variablesName.map((item, index) => {
      if(i === index) {
        return value
      } else {
        return item
      }
    })

    setTask({...task, variablesName: newVariablesName})
  }

  const handleSelectToMqtt = (value, i) => {
    
    task.variablesName.forEach((item, index) => {
      if(i === index) {
        if(value) {
          setSelectedItens([...selectedItens, item])
        } else {
          let arr = selectedItens
          let novoArray = arr.filter(function (string) {
          return string !== item;
          });
          setSelectedItens(novoArray)
        }
      }
    })
  }

  useEffect(() => {
    getTask()
    getVarsToMqtt()
  },[])

  useEffect(() => {
    console.log(selectedItens)
  },[selectedItens])

  return (
    <div className="add-task">
      <p>Edit Task</p>
      <div className="form-control">
        <label>
          <span>Initial Address:</span>
          <input type="number"  value={task.address} onChange={(e) => setAddress(e)} />
        </label>
      </div>

      <div className="form-control">
        <label>
          <span>Elements:</span>
          <input type="number"  value={task.elements} onChange={(e) => setElements(e)} />
        </label>
      </div>

      <div className="form-control">
        <label>
          <span>Function Code:</span>
          <select onChange={(e) => setTask({ ...task, functionCode: parseInt(e.target.value)})} value={task.functionCode}>
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
          
            {task.functionCode === 3 || task.functionCode === 4 ? (
              <select onChange={(e) => setTask({ ...task, dataType: e.target.value})} value={task.dataType}>
                <option value={"uint16"}>uint16</option>
                <option value={"int16"}>int16</option>
                <option value={"uint32"}>uint32</option>
                <option value={"int32"}>int32</option>
                <option value={"float32"}>float32</option>
              </select>
            ) : (
              <select onChange={(e) => setTask({ ...task, dataType: e.target.value})} value={task.dataType}>
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
              {task.variablesName && task.variablesName.length > 0 && task.variablesName.map((item, i) =>(
                <tr key={i}>
                  <td>{task.dataType === "uint16" || task.dataType === "int16" || task.dataType === "bool" ? (task.address + i) : (`${task.address + (i * 2)} - ${task.address + (i * 2) + 1}`)}</td>
                  <td><input value={item} onChange={(e) => handleChangeVariablesName(e.target.value, i)}></input></td>
                  
                  {selectedItens.map((variable) => {
                    if (item === variable) {
                      return <td style={{width: '4rem'}}><input style={{height:'20px', width:"20px", margin:'0 auto'}} type='checkbox' checked={true} onChange={(e) => handleSelectToMqtt(e.target.checked, i)}></input></td>
                    }
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </label>
      </div>

      <div className="form-control">
        <button className='create-button' onClick={() => handleSubmit ()}>Edit</button>
        <button onClick={() => close(true)}>Close</button>
      </div>
      <div className="error-label">
        {failMessage.status && <p>{failMessage.message}</p>}
      </div>
    </div>
  )
}

export default EditTask