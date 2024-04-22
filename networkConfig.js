
const os = require('os')
const { exec } = require('child_process');

const Network = require('./models/Network')

const systemOS = os.platform()

const ipConfigs = os.networkInterfaces().Ethernet[1]
const mac = ipConfigs.mac.replace(/:/g, "")



// Função para configurar a rede
function configurarRede(ip, subnetMask, gateway) {

  let comando = ""
  let comandoGateway = ""
  // Comando para configurar a rede no Windows
  if (systemOS === "win32") {
    comando = `netsh interface ip set address "Ethernet" static ${ip} ${subnetMask} ${gateway}`;
  }

  // Comando para configurar a rede no Linux
  else if (systemOS === "linux") {
    comando = `sudo ifconfig eth0 ${ip} netmask ${subnetMask}`;
    comandoGateway = `sudo route add default gw ${gateway}`;
  } else {
    return
  }

  // Executar o comando
  exec(comando, (erro, stdout, stderr) => {
    if (erro) {
      console.error(`Erro: ${erro.message}`);
      return;
    }
    if (stderr) {
      console.error(`Erro de saída: ${stderr}`);
      return;
    }
    console.log(`Saída: ${stdout}`);
  });

  if (systemOS === 'linux') {

    // Adicionar o gateway
    exec(comandoGateway, (erro, stdout, stderr) => {
      if (erro) {
        console.error(`Erro ao adicionar o gateway: ${erro.message}`);
        return;
      }
      if (stderr) {
        console.error(`Erro de saída ao adicionar o gateway: ${stderr}`);
        return;
      }
      console.log(`Gateway adicionado com sucesso: ${stdout}`);
    });

  }

}

// Função para configurar DHCP
function configurarDHCP() {

  let comando = ''
  if(systemOS === "win32") {
    // Comando para configurar o DHCP no Windows
    comando = 'netsh interface ip set address "Ethernet" dhcp';
  } else if (systemOS === "linux") {
    // Comando para configurar o DHCP no Linux
    comando = `sudo dhclient -r eth0 && sudo dhclient eth0`;
  }

  // Executar o comando
  exec(comando, (erro, stdout, stderr) => {
    if (erro) {
      console.error(`Erro: ${erro.message}`);
      throw erro.message
    }
    if (stderr) {
      console.error(`Erro de saída: ${stderr}`);
    }
    console.log(`Saída: ${stdout}`);
  });
}

// Função para configurar a rede com base na escolha do usuário
function configurarRedeUsuario(opcao, ip, subnetMask, gateway) {
  if (opcao === 'dhcp') {
    configurarDHCP();
  } else if (opcao === 'static') {
    configurarRede(ip, subnetMask, gateway);
  } else {
    console.error('Opção inválida. Use "dhcp" ou "static".');
  }
}


//Função para setar valores padrão
async function setDefault () {
  
  try {
   
    const networks = await Network.find()
    const network = networks[0]
    
    if(networks.length !== 0) {
      
      if(network.defaultConfigs === true) {
        return
      } else {

        //Create
        console.log('entrou')
        //Seta valores padrão de fabrica
        network.mode = 'static'
        network.ip = '192.168.2.10'
        network.netmask = '255.255.255.0'
        network.gateway = '192.168.2.1'
        network.mac = mac
        network.modbusScanRate = 10000
        network.mqttHost = 'mqtt://34.125.20.251'
        network.mqttPort = 1883
        network.mqttUsername = ''
        network.mqttPassword = ''
        network.mqttTopic = `trustbus/${mac}`
        network.mqttSubscribe = `trustbus/${mac}`
        network.defaultConfigs = true
        
        //Volta para valores de fabrica
        await Network.findOneAndUpdate(
          {_id: network._id},
          { $set: network},
          { new: true},
        )
      }

    } else {

      //Create
      const network = new Network ({
        //Seta valores padrão de fabrica
        mode : 'static',
        ip : '192.168.2.10',
        netmask : '255.255.255.0',
        gateway : '192.168.2.1',
        mac : mac,
        modbusScanRate : 10000,
        mqttHost : 'mqtt://34.125.20.251',
        mqttPort : 1883,
        mqttUsername : '',
        mqttPassword : '',
        mqttTopic : `trustbus/${mac}`,
        mqttSubscribe : `trustbus/${mac}`,
        defaultConfigs : true,
      })

      await network.save()

    }

  } catch (err) {
    console.log(err)
    throw err
  }

}


module.exports = { configurarRedeUsuario, ipConfigs, setDefault }