import './Config.css'

const MQTTClient = () => {
  return (
    <div className='config-container'>
        <p className='title'>MQTT Client</p>
        <form>
            <div className="form-control">
                <label>
                    <span>Host:</span>
                    <input type="text"/>
                </label>
            </div>
            <div className="form-control">
                <label>
                    <span>Port:</span>
                    <input type="number"/>
                </label>
            </div>
            <div className="form-control">
                <label>
                    <span>Username:</span>
                    <input type="text"/>
                </label>
            </div>
            <div className="form-control">
                <label>
                    <span>Password:</span>
                    <input type="password"/>
                </label>
            </div>
            <div className="form-control">
                <label>
                    <span>Publish Topic:</span>
                    <input type="text"/>
                </label>
            </div>
            <div className="form-control">
                <label>
                    <span>Subscribe Topic:</span>
                    <input type="text"/>
                </label>
            </div>
        </form>
    </div>
  )
}

export default MQTTClient