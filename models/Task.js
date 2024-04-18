const mongoose = require('../db/conn');
const { Schema } = mongoose;

const Task = mongoose.model(
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
                type: [String],
                required: true,
                validate: {
                    validator: async function(array) {
                      // Verificar se há duplicatas no array
                      if (array.length !== new Set(array).size) {
                        return false;
                      }
                      return true;
                    },
                    message: props => `As strings no array ${props.path} devem ser únicas`
                }
            },
        },
        { timestamps: true },
    )
    .pre('findOneAndUpdate', async function(next) {
        const update = this.getUpdate();
        const array = update.$set && update.$set.variablesName;
        
        // Se o array foi atualizado, verifique a unicidade das strings
        if (array) {
          const count = await Task.countDocuments({ variablesName: { $in: array } });
          if (count > 1) {
            throw new Error('Esse nome de variavel já existe, insira um novo nome');
          }
        }
      
        next();
    }),
)

module.exports = Task;