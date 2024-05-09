const mongoose = require('../db/conn');
const { Schema } = mongoose;

const Device = mongoose.model(
    'Device',
    new Schema(
        {   
            type: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            ip: {
                type: String,
            },
            port: {
                type: Number,
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
            task: Array,

        },
        { timestamps: true },
    ),
)

module.exports = Device;