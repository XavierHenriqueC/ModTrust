import './Screens.css'
import Lan from '../components/Lan'
import Wan from '../components/Wan'
import MQTTClient  from '../components/MQTTClient'
import WIFIClient from '../components/WIFIClient'
import Serial from '../components/Serial'
import NetworkStatus from '../components/NetworkStatus'

const Network = () => {
  return (
    <div className="main-center">
      <div className='container-center-left'>
        <div className="network-contents">
          <Lan />
          <MQTTClient />
          <Wan />
          <WIFIClient />
          <Serial />
        </div>
        <div className="buttons">
            <button>Save</button>
        </div>
      </div>
      <div className='container-center-right'>
        <NetworkStatus />
      </div>
    </div>
  )
}

export default Network