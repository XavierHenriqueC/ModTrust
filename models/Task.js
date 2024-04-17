const moongose = require('../db/conn');
const { Schema } = moongose;

const Task = moongose.model(
    'Task',
    new Schema(
        {
            deviceId: {
                type: String,
                required: true
            },
            functionType: {
                type: String,
                required: true
            },
            functionCode: {
                type: Number,
                required: true
            },
            address: {
                type: Number,
                required: true
            },
            elements: {
                type: Number,
                required: true
            },
            dataType: {
                type: String,
                required: true
            },
            variablesName: {
                type: Array,
                required: true
            },
        },
        { timestamps: true },
    ),
)

module.exports = Task;