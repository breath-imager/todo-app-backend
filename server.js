const express = require ('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose  = require('mongoose')
// create an instance of the Express Router
const todoRoutes = express.Router()
const PORT = 4000


let Todo = require('./todo.model')

app.use(cors())
app.use(bodyParser.json())

mongoose.connect('mongodb://127.0.0.1:27017/todos', {
    useNewUrlParser: true })
const connection = mongoose.connection

connection.once('open', function(){
    console.log("MongoDB database connection established succesfully")
})

// add an endpoint which is delivering all available todos items
// the function which is passed into the call of the method get is used to handle incoming HTTP GET request on the /todos/ URL path
todoRoutes.route('/').get(function(req, res) {
    // call Todo.find to retrieve a list of all todo items from the MongoDB database
    //the find method takes one argument, a callback function which is executed once the result is available
    Todo.find(function(err, todos) {
        if (err) {
            console.log(err)
        } else {
            // make sure the results are added in JSON format to the response body
            res.json(todos)
        }
    })
})

// add an endpoint which retrieves a specific todo item by providing an ID
todoRoutes.route('/:id').get(function(req, res) {
    // accept URL parameter id
    let id = req.params.id
    Todo.findById(id, function(err, todo) {
        res.json(todo)
    })
})

// add the endpoint which will allow us to add toto items by sending a HTTP post request (/add)
todoRoutes.route('/add').post(function(req, res) {
    // retrieve new todo item from HTTP POST request body
    let todo = new Todo(req.body)
    // save to database
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'todo added successfully'})
        })
        .catch(err => {
            res.status(400).send('adding new todo failed')
        })
})

todoRoutes.route('/delete/:id').post(function(req, res) {
    // retrieve new todo item from HTTP POST request body
        Todo.deleteOne( { _id: req.params.id }).then(todo =>{
            if (todo) {
                return res.status(200).json({message: 'Todo deleted successfully. Refreshing data...', success: true})
            }
        })
    
        //console.log("Successful deletion")
        //res.status(200).json({'todo': 'todo deleted successfully'})
    // save to database
    
     
})


// this route is used to update an existing todo item
todoRoutes.route('/update/:id').post(function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send("data is not found!")
        else
        // set the todo property values to what's available in the request body
            todo.todoDescription = req.body.todoDescription
            todo.todoResponsible = req.body.todoResponsible
            todo.todoPriority = req.body.todoPriority
            todo.todoCompleted = req.body.todoCompleted
            // save the updated object in the db
            todo.save().then(todo => {
                res.json('Todo updated!')
            })
            .catch(err => {
                res.status(400).send("Update not possible")
            })
    })
})

// router is added as middleware and will take control of requests starting with path /todos
app.use('/todos', todoRoutes)


app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT)
})