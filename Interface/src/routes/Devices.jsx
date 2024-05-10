import { useContext, useState, useEffect } from 'react'
import { Context } from '../../context/Context'

import AddDevice from '../components/Device/AddDevice'
import EditDevice from '../components/Device/EditDevice'
import DeleteDevice from '../components/Device/DeleteDevice'
import Tasks from '../components/Task/Tasks'

import './Screens.css'
import './Devices.css'


const Devices = () => {

  const { devices } = useContext(Context)

  const [modalOpen, setModalOpen] = useState({ add: false, edit: false, delete: false, tasks: false });

  const [editId, setEditId] = useState('')
  const [taskId, setTaskId] = useState('')

  const [selectedItens, setSelectedItens] = useState([])

  const openModal = (type) => {
    if (type === "add") {
      setModalOpen({ add: true, edit: false, delete: false, tasks: false });
    }

    else if (type === "edit") {
      setModalOpen({ add: false, edit: true, delete: false, tasks: false })
    }

    else if (type === "delete") {
      setModalOpen({ add: false, edit: false, delete: true, tasks: false })
    }

    else if (type === "tasks") {
      setModalOpen({ add: false, edit: false, delete: false, tasks: true })
    }

  };

  const closeModal = () => {
    setModalOpen({ add: false, edit: false, delete: false, tasks: false });
  };

  const handleEdit = (id) => {
    setEditId(id)
    openModal("edit")
  }

  const handleTasks = (id) => {
    setTaskId(id)
    openModal("tasks")
  }

  const handleSelectItem = (state, id) => {
    //console.log(state, id)
    if (state) {
      setSelectedItens([...selectedItens, id])
    } else {
      let arr = selectedItens
      let novoArray = arr.filter(function (string) {
        return string !== id;
      });
      setSelectedItens(novoArray)
    }
  }

  return (
    <div className="main-center">
      <div className='container-center-left'>
        <AddDevice isOpen={modalOpen.add} closeModal={closeModal} ></AddDevice>
        <EditDevice isOpen={modalOpen.edit} closeModal={closeModal} id={editId} ></EditDevice>
        <DeleteDevice isOpen={modalOpen.delete} closeModal={closeModal} id={selectedItens} ></DeleteDevice>
        <Tasks isOpen={modalOpen.tasks} closeModal={closeModal} id={taskId}></Tasks>
        <div className="device-contents">
          <div className="table-header">
            <button disabled={selectedItens.length > 0 ? false : true} onClick={() => openModal("delete")}>Delete</button>
            <button onClick={() => openModal("add")}>Add new Device</button>
          </div>
          <div className="table-body">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Connection Type</th>
                  <th>IP Address</th>
                  <th>Port</th>
                  <th>Unit ID</th>
                  <th>Timeout</th>
                  <th>Base Address</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {devices.map((item) => (
                  <tr key={item.name}>
                    <td style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><input type='checkbox' onChange={(e) => handleSelectItem(e.target.checked, item._id)}></input></td>
                    <td onDoubleClick={() => handleEdit(item._id)}>{item.name}</td>
                    <td onDoubleClick={() => handleEdit(item._id)}>{item.type}</td>
                    <td onDoubleClick={() => handleEdit(item._id)}>{item.ip}</td>
                    <td onDoubleClick={() => handleEdit(item._id)}>{item.port}</td>
                    <td onDoubleClick={() => handleEdit(item._id)}>{item.unitId}</td>
                    <td onDoubleClick={() => handleEdit(item._id)}>{item.timeout}</td>
                    <td onDoubleClick={() => handleEdit(item._id)}>{item.baseAddress}</td>
                    <td><button onClick={() => handleTasks(item._id)}>Tasks</button></td>
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

export default Devices