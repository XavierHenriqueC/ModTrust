import { useContext, useEffect, useState } from 'react';

import { getTaskById, editTaskById } from '../../utils/API';
import { Context } from '../../../context/Context';

import './Tasks.css'


const EditTask = ({ close, id }) => {

  const { getInfos } = useContext(Context)

  const [task, setTask] = useState({})

  const [failMessage, setFailMessage] = useState({status: false, message: ''})

  const [variablesName, setVariablesName] = useState([])

  const editTask = async () => {
    try {

      await editTaskById( id, "read", task.functionCode, task.address, task.elements, task.dataType, variablesName)
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

  const getTask = async () => {
    try {
      const Task = await getTaskById(id)
      setTask(Task.task)
      setVariablesName(Task.task.variablesName)
      
    } catch (err) {
      console.log(err)
    } finally {
      handleVariablesName()
    }
  }

  //Constroi array de variablesName de acordo com a quantidade de elementos e datatype
  const handleVariablesName = () => {

    if (task.variablesName) {
      
      //Defini quantidade de variaveis
      let quantity = 0

      if(task.functionCode === 1 || task.functionCode === 2) {
        setTask({ ...task, dataType: 'bool'})
        quantity = task.elements
      }
      
      if (task.dataType === "bool" || task.dataType === "int16" || task.dataType === "uint16") {
        quantity = task.elements
      } else {
        quantity = task.elements / 2
      }

      const lastVariablesName = [...task.variablesName]

      //Injeta os objetos no array
      if(quantity !== task.variablesName.length) {
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
    setVariablesName(newVariablesName);
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

    if(task.address < 0 || task.address === "" || task.address === NaN) {
      setTask({ ...task, address:0})
    }

    if(task.address > 65535) {
      setTask({ ...task, address:65535})
    }

    if(task.elements < 0 || task.elements === "" || task.elements === NaN) {
      setTask({ ...task, elements:0})
    }

    if(task.elements > 254) {
      setTask({ ...task, elements:254})
    }

  },[task])


  useEffect (() => {
    handleVariablesName()
  },[task.functionCode, task.dataType, task.elements])

  useEffect(() => {
    getTask()
  },[])

  useEffect(() => {
    setFailMessage({status: false, message: ""})
  },[variablesName])

  useEffect(() => {
    console.log(variablesName)
  },[variablesName])

  useEffect(() => {
    console.log(task)
  },[task])



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
              {variablesName.map((item, index) =>(
                <tr key={index}>
                  <td>{task.dataType === "uint16" || task.dataType === "int16" || task.dataType === "bool" ? (task.address + index) : (`${task.address + (index * 2)} - ${task.address + (index * 2) + 1}`)}</td>
                  <td><input value={item.variable} onChange={(e) => handleVariablesNameChange(item.variable , e.target.value, index)} required></input></td>
                  <td style={{width: '1rem'}}><input type="checkbox" checked={item.mqttpub} onChange={(e) => handleVariablesNameChange(item.mqttpub, e.target.checked, index)}/></td>
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