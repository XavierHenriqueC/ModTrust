import { useContext, useEffect, useState } from 'react';

import Modal from 'react-modal';
import { registerNewDevice } from '../../utils/API';

import '../modal.css'
import { Context } from '../../../context/Context';

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: "#fff",
    width: '30%',
    overflow: "none",
    height: 'auto'
  },
};

const AddDevice = ({ isOpen, closeModal }) => {

  const { getInfos } = useContext(Context)

  const [newDevice, setNewDevice] = useState({type: "tcp", port: 502, timeout: 300, unitId: 1, baseAddress: 1 })

  const [failMessage, setFailMessage] = useState({status: false, message: ''})

  const addDevice = async () => {
    try {
      
      await registerNewDevice(newDevice.type, newDevice.name, newDevice.ip, newDevice.port, newDevice.unitId, newDevice.timeout, newDevice.baseAddress)
      closeModal(true)

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
    } finally {
      await getInfos()
    }

  }

  const handleSubmit = () => {
    addDevice()
  }

  const handleClose = () => {
    closeModal(true)
  }

  useEffect(() => {
    setFailMessage({status: false, message: ""})

    if(newDevice.type === "serial") {
      newDevice.ip = null
      newDevice.port = null
    }

  },[newDevice])

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={modalStyles}
    >
      <div className="modal">
        <div className="form-control">
          <label>
            <span>Connection Type:</span>
            <select onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value})} value={newDevice.type}>
              <option value={"tcp"}>TCP</option>
              <option value={"serial"}>Serial</option>
            </select>
          </label>
        </div>
        <div className="form-control">
          <label>
            <span>Name:</span>
            <input type="text"  value={newDevice.name} onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })} />
          </label>
        </div>
        {newDevice.type === "tcp" &&
          <>
            <div className="form-control">
              <label>
                <span>IP address:</span>
                <input type="text" value={newDevice.ip} onChange={(e) => setNewDevice({ ...newDevice, ip: e.target.value })} />
              </label>
            </div>
            <div className="form-control">
              <label>
                <span>Port:</span>
                <input type="number" value={newDevice.port} onChange={(e) => setNewDevice({ ...newDevice, port: e.target.value })} />
              </label>
            </div>
          </>
        }
        <div className="form-control">
          <label>
            <span>Unit ID:</span>
            <input type="number"  value={newDevice.unitId} onChange={(e) => setNewDevice({ ...newDevice, unitId: e.target.value })} />
          </label>
        </div>
        <div className="form-control">
          <label>
            <span>Timeout (Seconds):</span>
            <input type="number"  value={newDevice.timeout} onChange={(e) => setNewDevice({ ...newDevice, timeout: e.target.value })} />
          </label>
        </div>
        <div className="form-control">
          <label>
            <span>Base Address:</span>
            <select onChange={(e) => setNewDevice({ ...newDevice, baseAddress: e.target.value})} value={newDevice.baseAddress}>
              <option value={0}>0</option>
              <option value={1}>1</option>
            </select>
          </label>
        </div>
        <div className="form-control">
          <button className='create-button' onClick={() => handleSubmit ()}>Create</button>
          <button onClick={() => handleClose()}>Close</button>
        </div>
        <div className="error-label">
          {failMessage.status && <p>{failMessage.message}</p>}
        </div>
      </div>

    </Modal>
  )
}

export default AddDevice