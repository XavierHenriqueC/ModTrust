import './Config.css'

const WIFIClient = () => {
  return (
    <div className='config-container'>
        <p className='title'>Wi-Fi Client Mode</p>
        <form>
            <div className="form-control">
                <label>
                    <span>Enable:</span>
                    <input type="checkbox"/>
                </label>
            </div>
            <div className="form-control">
                <label>
                    <span>Availables:</span>
                    <select>
                        <option value="Option 1">Option 1</option>
                    </select>
                </label>
            </div>
            <div className="form-control">
                <label>
                    <span>Manual SSID:</span>
                    <input type="text"/>
                </label>
            </div>
            <div className="form-control">
                <label>
                    <span>Password:</span>
                    <input type="password"/>
                </label>
            </div>
        </form>
    </div>
  )
}

export default WIFIClient