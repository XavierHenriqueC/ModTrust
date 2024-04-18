const mongoose = require('../db/conn');
const { Schema } = mongoose;

const Device = mongoose.model(
    'Device',
    new Schema(
        {
            name: {
                type: String,
                required: true
            },
            ip: {
                type: String,
                required: true
            },
            port: {
                type: Number,
                required: true
            },
            unitId: {
                type: Number,
                required: true
            },
            timeout: {
                type: Number,
                required: true
            },
            baseAddress: {
                type: Number,
                required: true
            },
            task: Array

        },
        { timestamps: true },
    ),
)

module.exports = Device;