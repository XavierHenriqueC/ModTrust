const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const isValidId = (id) => {
  if (!ObjectId.isValid(id)) {
    throw new Error("Id invalido");
  }
  return true;
};

module.exports = {
  isValidId,
};