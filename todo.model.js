const mongoose = require('mongoose')
const Schema = mongoose.Schema
const PRIORITIES = ["High", "Medium", "Low"]

let Todo = new Schema({
    todoDescription: {
        type: String
    },
    todoResponsible: {
        type: String
    },
    todoPriority: {
        type: String, 
        enum: PRIORITIES,
        default: 'High'
    },
    todoCompleted: {
        type: Boolean
    },
    todoDate: {
        type: Date
    }

})

module.exports = mongoose.model('Todo', Todo)