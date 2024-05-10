import { useContext, useEffect, useState } from 'react';

import Modal from 'react-modal';

import { getDeviceById } from '../../utils/API';

import '../modal.css'
import './Tasks.css'
import AddTask from './AddTask';
import EditTask from './EditTask';
import DeleteTask from './DeleteTask';

const modalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: "#fff",
        width: '50%',
        overflow: "none",
        minHeight: '50%'
    },
};

const Tasks = ({ isOpen, closeModal, id }) => {

    const [device, setDevice] = useState({})

    const [selectedItens, setSelectedItens] = useState([])

    const [editId, setEditId] = useState('')

    const [modalOpen, setModalOpen] = useState({ add: false, edit: false, delete: false });

    const openModal = (type) => {
        
        if (type === "add") {
          setModalOpen({ add: true, edit: false, delete: false });
        }
    
        else if (type === "edit") {
          setModalOpen({ add: false, edit: true, delete: false })
        }
    
        else if (type === "delete") {
          setModalOpen({ add: false, edit: false, delete: true })
        }
    };
    
    const handleCloseTaskScreens = async () => {
        await getDevice()
        setModalOpen({ add: false, edit: false, delete: false });
    };

    const getDevice = async () => {
        try {
            const Device = await getDeviceById(id)
            setDevice(Device.device)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (isOpen) {
            getDevice()
        }
    }, [isOpen])

    const handleClose = () => {
        closeModal(true)
    }

    const handleEditTask = (id) => {
        setEditId(id)
        openModal('edit')
    }

    const handleSelectItem = (state, id) => {
        console.log(state, id)
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

    useEffect(() => {
        setSelectedItens([])
    },[closeModal])

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            style={modalStyles}
        >
            <div className="modal">
                {modalOpen.add && <AddTask isOpen={modalOpen.add} close={() => handleCloseTaskScreens()} deviceId={id}></AddTask>}
                {modalOpen.edit && <EditTask isOpen={modalOpen.edit} close={handleCloseTaskScreens} id={editId}></EditTask>}
                {modalOpen.delete && <DeleteTask isOpen={modalOpen.delete} close={() => handleCloseTaskScreens()} id={selectedItens}></DeleteTask>}
                <div className="title-header">
                    <p>{device.name}</p>
                    <button onClick={handleClose}>X</button>
                </div>
                <div className="table-header">
                    <button disabled={selectedItens.length > 0 ? false : true} onClick={() => openModal("delete")}>Delete</button>
                    <button onClick={() => openModal("add")}>Add Task</button>
                </div>
                <div className="table">
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Initial Address</th>
                                <th>Elements</th>
                                <th>Function Code</th>
                                <th>Data Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {device.task && device.task.length > 0 && device.task.map((item, index) => (
                                <>  
                                    <tr key={index}>
                                        <td style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><input type='checkbox' onChange={(e) => handleSelectItem(e.target.checked, item._id)}></input></td>
                                        <td onDoubleClick={() => handleEditTask(item._id)}>{item.address}</td>
                                        <td onDoubleClick={() => handleEditTask(item._id)}>{item.elements}</td>
                                        <td onDoubleClick={() => handleEditTask(item._id)}>{item.functionCode}</td>
                                        <td onDoubleClick={() => handleEditTask(item._id)}>{item.dataType}</td>
                                    </tr>
                                    <tr className='variables-title'>
                                        <td colSpan={2}>Addresses</td>
                                        <td colSpan={2}>Variables</td>
                                        <td>MQTT Publish</td>
                                    </tr>
                                    {item.variablesName.map((vars, i) =>(
                                        <tr className='variables' key={i}>
                                            <td style={{textAlign:'center'}} colSpan={2}>{item.dataType === "uint16" || item.dataType === "int16" || item.dataType === "bool" ? (item.address + i) : (`${item.address + (i * 2)} - ${item.address + (i * 2) + 1}`)}</td>
                                            <td colSpan={2} style={{fontSize: '14px'}}>{vars.variable}</td>
                                            <td style={{textAlign:'center', zIndex:0}}>{vars.mqttpub ? "Yes" : 'No'}</td>
                                        </tr>
                                    ))}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </Modal>
    )
}

export default Tasks