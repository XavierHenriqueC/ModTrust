import './Config.css'

const Serial = () => {
  return (
    <div className='config-container'>
        <p className='title'>SERIAL PORT (RS-485)</p>
        <form>
            <div className="form-control">
                <label>
                    <span>Baud Rate:</span>
                    <select>
                        <option value="9600">9600</option>
                    </select>
                </label>
            </div>
            <div className="form-control">
                <label>
                    <span>Parity:</span>
                    <select>
                        <option value="None">None</option>
                    </select>
                </label>
            </div>
            <div className="form-control">
                <label>
                    <span>Data bits:</span>
                    <select>
                        <option value="8">8</option>
                    </select>
                </label>
            </div>
            <div className="form-control">
                <label>
                    <span>Stop bits:</span>
                    <select>
                        <option value="1">1</option>
                    </select>
                </label>
            </div>
            
        </form>
    </div>
  )
}

export default Serial