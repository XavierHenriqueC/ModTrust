import './Config.css'

const Wan = () => {
  return (
    <div className='config-container'>
        <p className='title'>WAN PORT (IPv4)</p>
        <form>
            <div className="form-control">
                <label>
                    <span>DHCP:</span>
                    <input type="checkbox"/>
                </label>
            </div>
            <div className="form-control">
                <label>
                    <span>IP address:</span>
                    <input type="text" pattern="[0-9.]*"/>
                </label>
            </div>
            <div className="form-control">
                <label>
                    <span>Subnet mask:</span>
                    <input type="text" pattern="[0-9.]*"/>
                </label>
            </div>
            <div className="form-control">
                <label>
                    <span>Default Gateway:</span>
                    <input type="text" pattern="[0-9.]*"/>
                </label>
            </div>
        </form>
    </div>
  )
}

export default Wan