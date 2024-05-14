import { useContext, useEffect, useState } from 'react';
import { Context } from '../../../context/Context';

import { registerNewTask } from '../../utils/API';

import './Tasks.css'


const AddTask = ({ close, deviceId }) => {

  const { getInfos } = useContext(Context)

  const [newTask, setNewTask] = useState({functionCode: 1, dataType: "bool", address: 1, elements: 1, variablesName: []})

  const [failMessage, setFailMessage] = useState({status: false, message: ''})

  const [variablesName, setVariablesName] = useState([])
  const [tempVariablesName, setTempVariablesName] = useState([])

  const addTask = async () => {
    try {

      await registerNewTask( deviceId, "read", newTask.functionCode, newTask.address, newTask.elements, newTask.dataType, variablesName)
      await getInfos()
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

  //Constroi array de variablesName de acordo com a quantidade de elementos e datatype
  const handleVariablesName = () => {

    if (newTask.variablesName) {
      
      //Defini quantidade de variaveis
      let quantity = 0

      if(newTask.functionCode === 1 || newTask.functionCode === 2) {
        setNewTask({ ...newTask, dataType: 'bool'})
        quantity = newTask.elements
      }
      
      if (newTask.dataType === "bool" || newTask.dataType === "int16" || newTask.dataType === "uint16") {
        quantity = newTask.elements
      } else {
        quantity = newTask.elements / 2
      }

      const lastVariablesName = [...tempVariablesName]

      //Injeta os objetos no array
      if(quantity !== newTask.variablesName.length) {
        setVariablesName([])
        
        let newVariablesName = []

        for (let index = 0; index < quantity; index++) {
          let obj = {variable: "", mqttpub: false}
          newVariablesName.push(obj)
        }

        // Copiar os valores da array de origem para a array de destino
        const novoArrayDestino = newVariablesName.map((elemento, indice) => {
          if (indice < lastVariablesName.length) {
            return lastVariablesName[indice];
          } else {
            return { variable: "", mqttpub: false };
          }
        });
        
        // Atualizar o estado do array de destino
        setVariablesName(novoArrayDestino);

      } else {
        setVariablesName(lastVariablesName)
      }
    }
  }

  //Função para atribuir os valores vindo dos inputs de variablesName para o array de variablesName
  const handleVariablesNameChange = (key, value, index) => {
    
    const newVariablesName = variablesName.map((variablesName, i) => {

      if (i === index) {
        if (variablesName.variable === key) {
          return {
            ...variablesName,
            variable: value,
          };

        }

        else if (variablesName.mqttpub === key) {
          return {
            ...variablesName,
            mqttpub: value,
          };
        }

        else {
          return variablesName;
        }

      } else {
        return variablesName;
      }

    });
    setTempVariablesName(newVariablesName)
    setVariablesName(newVariablesName);
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
 
    if(newTask.address < 0 || newTask.address === "") {
      setNewTask({ ...newTask, address:0})
    }

    if(newTask.address > 65535) {
      setNewTask({ ...newTask, address:65535})
    }

    if(newTask.elements < 0 || newTask.elements === "") {
      setNewTask({ ...newTask, elements:0})
    }

    if(newTask.elements > 254) {
      setNewTask({ ...newTask, elements:254})
    }

  },[newTask])

  useEffect (() => {
    handleVariablesName()
  },[newTask.functionCode, newTask.dataType, newTask.elements])

  useEffect(() => {
    if(newTask.functionCode === 3 || newTask.functionCode === 4) {
      setNewTask({...newTask, dataType: 'uint16'}) 
    }
  },[newTask.functionCode])

  useEffect(() => {
    handleVariablesName()
  },[])

  useEffect(() => {
    setFailMessage({status: false, message: ""})
  },[variablesName])

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
          <table>
            <thead>
                <tr>
                  <th style={{width: "6rem"}}>Addresses</th>
                  <th>Name</th>
                  <th>MQTT Publish</th>
                </tr>
            </thead>
            <tbody>
              {variablesName.map((item, index) =>(
                <tr key={index}>
                  <td>{newTask.dataType === "uint16" || newTask.dataType === "int16" || newTask.dataType === "bool" ? (newTask.address + index) : (`${newTask.address + (index * 2)} - ${newTask.address + (index * 2) + 1}`)}</td>
                  <td><input value={item.variable} onChange={(e) => handleVariablesNameChange(item.variable , e.target.value, index)} required></input></td>
                  <td style={{width: '1rem'}}><input type="checkbox" checked={item.mqttpub} onChange={(e) => handleVariablesNameChange(item.mqttpub, e.target.checked, index)}/></td>
                </tr>
              ))}
            </tbody>
          </table>
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