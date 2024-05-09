import { useContext, useEffect, useState } from 'react';

import Modal from 'react-modal';
import { deleteDevice } from '../../utils/API';

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

const DeleteDevice = ({ isOpen, closeModal, id }) => {

  const { getInfos } = useContext(Context)

  const deleteDevices = async () => {
    
    try {

      const promise = id.map(async(item) => {
        await deleteDevice(item)
      })

      Promise.all(promise)
      
      closeModal(true)

    } catch (error) {
      console.log(error)
    } finally {
      await getInfos()
    }

  }

  const handleSubmit = () => {
    deleteDevices()
  }

  const handleClose = () => {
    closeModal(true)
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={modalStyles}
    >
      <div className="modal">
        <p>Tem certeza que deseja excluir o(s) Device(s) selecionado(s)</p>
        <div className="form-control">
          <button className='create-button' onClick={() => handleSubmit ()}>Yes</button>
          <button onClick={() => handleClose()}>No</button>
        </div>
      </div>

    </Modal>
  )
}

export default DeleteDevice