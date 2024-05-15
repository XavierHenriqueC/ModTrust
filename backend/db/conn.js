const mongoose = require('mongoose');

const mongoHost = 'mongodb://mongo:27017/trustbus'

async function main () {
    await mongoose.connect(mongoHost);
    console.log("Conectado ao MongoDB (Mongoose)")
}

main().catch((err) => {console.log(err)});

module.exports = mongoose;