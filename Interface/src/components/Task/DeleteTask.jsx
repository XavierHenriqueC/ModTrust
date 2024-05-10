import { useContext, useEffect } from 'react';
import { deleteTask } from '../../utils/API';

import '../modal.css'
import { Context } from '../../../context/Context';

const DeleteTask = ({ close, id }) => {

  const deleteTasks = async () => {

    const { getInfos } = useContext(Context)
    
    try {

      const promise = id.map(async(item) => {
        await deleteTask(item)
      })

      await Promise.all(promise)
      
      await getInfos()
      close(true)

    } catch (error) {
      console.log(error)
    }

  }

  const handleSubmit = () => {
    deleteTasks()
  }

  return (
    <div className="delete-task">
      <div className="content">
        <p>Tem certeza que deseja excluir o(s) Task(s) selecionado(s)</p>
        <div className="form-control">
          <button className='create-button' onClick={() => handleSubmit ()}>Yes</button>
          <button onClick={() => close(true)}>No</button>
        </div>
      </div>
    </div>
  )
}

export default DeleteTask