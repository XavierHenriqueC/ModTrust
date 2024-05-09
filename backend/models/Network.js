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
            modeWan: {
                type: String,
                required: true
            },
            ipWan: {
                type: String,
                required: true
            },
            netmaskWan: {
                type: String,
                required: true
            },
            gatewayWan: {
                type: String,
            },
            wifiEnable: {
                type: Boolean,
                required: true
            },
            wifiSSID: {
                type: String
            },
            wifiPassword: {
                type: String
            },
            modbusScanRate: {
                type: Number,
                required: true
            },
            serialBaudRate: {
                type: Number,
                required: true
            },
            serialParity: {
                type: String,
                required: true
            },
            serialDataBits: {
                type: Number,
                required: true
            },
            serialStopBits: {
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
                type: String,
            },
            mqttPassword: {
                type: String,
                
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