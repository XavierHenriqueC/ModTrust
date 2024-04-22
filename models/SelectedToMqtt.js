const mongoose = require('../db/conn');
const { Schema } = mongoose;

const SelectedToMqtt = mongoose.model(
    'SelectedToMqtt',
    new Schema(
        {
            name: {
                type: String,
                required: true
            },
        },
        { timestamps: true },
    ),
)

module.exports = SelectedToMqtt;