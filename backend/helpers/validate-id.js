const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const isValidId = (id) => {
  if (!ObjectId.isValid(id)) {
    throw new Error("Id invalido");
  }
  return true;
};

function validarEnderecoIP(ip) {
  // Expressão regular para validar endereço IPv4
  const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  if (ipv4Regex.test(ip)) {
      return true; // O endereço IP é válido
  } else {
      return false; // O endereço IP é inválidos
  }
}


module.exports = {
  isValidId, validarEnderecoIP
};
