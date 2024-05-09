import { useContext, useEffect, useState } from 'react';

import Modal from 'react-modal';
import { editDeviceById, getDeviceById } from '../../utils/API';

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

const EditDevice = ({ isOpen, closeModal, id }) => {

  const { getInfos } = useContext(Context)

  const [device, setDevice] = useState({})

  const [failMessage, setFailMessage] = useState({status: false, message: ''})

  const getDevice = async () => {
    try {
      const Device = await getDeviceById(id)
      console.log(Device)
      setDevice(Device.device)
    } catch (error) {
      console.log(error)
    }
  }

  const Edit = async () => {
    
    try {

      await editDeviceById(id, device.type, device.name, device.ip, device.port, device.unitId, device.timeout, device.baseAddress)
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
    Edit()
  }

  const handleClose = () => {
    closeModal(true)
  }

  useEffect(() => {
    setFailMessage({status: false, message: ""})
  },[device])

  useEffect(() => {
    if(isOpen) {
      getDevice()
    }
  },[isOpen])

  useEffect(() => {
    if(device.type === "tcp") {
      device.port = 502
    }
  },[device.type])

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
            <select onChange={(e) => setDevice({ ...device, type: e.target.value})} value={device.type}>
              <option value={"tcp"}>TCP</option>
              <option value={"serial"}>Serial</option>
            </select>
          </label>
        </div>
        <div className="form-control">
          <label>
            <span>Name:</span>
            <input type="text"  value={device.name} onChange={(e) => setDevice({ ...device, name: e.target.value })} />
          </label>
        </div>
        {device.type === "tcp" &&
          <>
            <div className="form-control">
              <label>
                <span>IP address:</span>
                <input type="text" value={device.ip} onChange={(e) => setDevice({ ...device, ip: e.target.value })} />
              </label>
            </div>
            <div className="form-control">
              <label>
                <span>Port:</span>
                <input type="number" value={device.port} onChange={(e) => setDevice({ ...device, port: e.target.value })} />
              </label>
            </div>
          </>
        }
        <div className="form-control">
          <label>
            <span>Unit ID:</span>
            <input type="number"  value={device.unitId} onChange={(e) => setDevice({ ...device, unitId: e.target.value })} />
          </label>
        </div>
        <div className="form-control">
          <label>
            <span>Timeout (Seconds):</span>
            <input type="number"  value={device.timeout} onChange={(e) => setDevice({ ...device, timeout: e.target.value })} />
          </label>
        </div>
        <div className="form-control">
          <label>
            <span>Base Address:</span>
            <select onChange={(e) => setDevice({ ...device, baseAddress: e.target.value})} value={device.baseAddress}>
              <option value={0}>0</option>
              <option value={1}>1</option>
            </select>
          </label>
        </div>
        <div className="form-control">
          <button className='create-button' onClick={() => handleSubmit ()}>Edit</button>
          <button onClick={() => handleClose()}>Close</button>
        </div>
        <div className="error-label">
          {failMessage.status && <p>{failMessage.message}</p>}
        </div>
      </div>

    </Modal>
  )
}

export default EditDevice