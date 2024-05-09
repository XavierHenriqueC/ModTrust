const os = require('os')

const util = require('util');
const exec = util.promisify(require('child_process').exec);

const Network = require('./models/Network');

const systemOS = os.platform()

const ipConfigs = os.networkInterfaces().Ethernet[1]

const mac = ipConfigs.mac.replace(/:/g, "")

//console.log(os.networkInterfaces())

// Função para configurar a rede
function configurarRede(interfaceNameWin, interfaceNameLinux, ip, subnetMask, gateway) {

  let comando = ""
  let comandoGateway = ""
  // Comando para configurar a rede no Windows
  if (systemOS === "win32") {
    comando = `netsh interface ip set address "${interfaceNameWin}" static ${ip} ${subnetMask} ${gateway}`;
  }

  // Comando para configurar a rede no Linux
  else if (systemOS === "linux") {
    comando = `sudo ifconfig ${interfaceNameLinux} ${ip} netmask ${subnetMask}`;
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
async function configurarDHCP(interfaceNameWin, interfaceNameLinux) {

  let comando = ''
  if(systemOS === "win32") {
    // Comando para configurar o DHCP no Windows
    comando = `netsh interface ip set address "${interfaceNameWin}" dhcp`;
  } else if (systemOS === "linux") {
    // Comando para configurar o DHCP no Linux
    comando = `sudo dhclient -r ${interfaceNameLinux} && sudo dhclient ${interfaceNameLinux}`;
  }

  //Verifica se DHCP já está habilitado (Windows)
  const actualConfigs = await getInterfaceInformations()
  const ethernet = actualConfigs[interfaceNameWin]

  if(ethernet.DHCP_enabled === "No" || systemOS === "linux") {
    // Executa o comando
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
  }

// Função para configurar a rede com base na escolha do usuário
async function configurarRedeUsuario(interfaceNameWin, interfaceNameLinux, opcao, ip, subnetMask, gateway) {
  if (opcao === 'dhcp') {
    await configurarDHCP(interfaceNameWin, interfaceNameLinux);
  } else if (opcao === 'static') {
    configurarRede(interfaceNameWin, interfaceNameLinux, ip, subnetMask, gateway);
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
        //Seta valores padrão de fabrica
        network.mode = 'static'
        network.ip = '192.168.2.10'
        network.netmask = '255.255.255.0'
        network.gateway = '192.168.2.1'
        network.mac = mac
        
        network.modeWan = 'dhcp'
        network.ipWan = '192.168.5.10'
        network.netmaskWan = '255.255.255.0'
        network.gatewayWan = '192.168.5.1'
        
        network.wifiEnable = false
        network.wifiSSID = ""
        network.wifiPassword = ""

        network.serialBaudRate = 9600
        network.serialParity = "none"
        network.serialDataBits = 8
        network.serialStopBits = 1
        
        network.modbusScanRate = 10000
        
        network.mqttHost = 'mqtt://3.130.230.108'
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

        modeWan: 'dhcp',
        ipWan: '192.168.5.10',
        netmaskWan: '255.255.255.0',
        gatewayWan: '192.168.5.1',

        wifiEnable: false,
        wifiSSID: "",
        wifiPassword: "",

        serialBaudRate: 9600,
        serialParity: "none",
        serialDataBits: 8,
        serialStopBits: 1,

        modbusScanRate : 10000,
        
        mqttHost : 'mqtt://3.130.230.108',
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

async function getInterfaceInformations() {
 
  const comando = "netsh interface ip show config";

  // Função para transformar a string em objeto
  function parseConfigString(dataString) {
    const interfaces = {};

    // Divide a string em partes separadas para cada interface
    const interfaceChunks = dataString.split("Configuration for interface ");

    // Remove a primeira parte vazia
    interfaceChunks.shift();

    // Processa cada parte separadamente
    interfaceChunks.forEach(chunk => {
        const lines = chunk.trim().split("\n");
        const interfaceName = lines.shift().replace(/"/g, "").replace(/\s+/g, "_").replace(/_$/g, '');

        // Substitui espaços por underscores em todas as chaves
        const interfaceKey = interfaceName.replace(/\s+/g, "_");

        interfaces[interfaceKey] = {};

        lines.forEach(line => {
            const [key, value] = line.split(":").map(item => item.trim());

            // Substitui espaços por underscores em todas as chaves
            const parsedKey = key.replace(/\s+/g, "_");

            interfaces[interfaceKey][parsedKey] = value;
        });
    });

    return interfaces;
  }
  
  try {
    const { stdout, stderr } = await exec(comando);
    if (stdout) {
      const saida = parseConfigString(stdout)
      return saida;
    } else {
      throw new Error(stderr);
    }
  } catch (erro) {
    throw new Error(erro);
  }
}

module.exports = { configurarRedeUsuario, ipConfigs, setDefault, getInterfaceInformations }