const mongoose = require('../db/conn');
const { Schema } = mongoose;

const Network = mongoose.model(
    'Network',
    new Schema(
        {
            mode: {
                type: String,
                required: true
            },
            ip: {
                type: String,
                required: true
            },
            netmask: {
                type: String,
                required: true
            },
            gateway: {
                type: String,
            },
            mac: {
                type: String,
            },
            modbusScanRate: {
                type: Number,
                required: true
            },
            mqttHost: {
                type: String,
                required: true
            },
            mqttPort: {
                type: Number,
                required: true
            },
            mqttUsername: {
                type: Number,
                
            },
            mqttPassword: {
                type: Number,
                
            },
            mqttTopic: {
                type: String,
                required: true
            },
            mqttSubscribe: {
                type: String,
                
            },
            defaultConfigs: {
                type: Boolean,
            },
        },
        { timestamps: true },
    ),
)

module.exports = Network;