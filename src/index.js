// ./src/index.js

//importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const {startDatabase} = require('./database/mongo');
const {insertTodo, getTodos} = require('./database/todos');
const {deleteTodo, updateTodo} = require('./database/todos');

// defining the Express app
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// enabling CORS for all requests (not very secure)
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// endpoint to return all todos
app.get('/', async (req, res) => {
  res.send(await getTodos());
});

app.post('/', async (req, res) => {
  const newTodo = req.body;
  await insertTodo(newTodo);
  res.send({ message: 'New todo inserted.' });
});

// endpoint to delete an todo
app.delete('/:id', async (req, res) => {
  await deleteTodo(req.params.id);
  res.send({ message: 'Todo removed.' });
});

// endpoint to update an todo
app.put('/:id', async (req, res) => {
  const updatedTodo = req.body;
  await updateTodo(req.params.id, updatedTodo);
  res.send({ message: 'Todo updated.' });
});

// start the in-memory MongoDB instance
startDatabase().then(async () => {
  const todos = await getTodos();
  if (!todos || todos.length === 0) {
    await insertTodo({title: 'Buy milk for the kids.'});
    await insertTodo({title: 'Brush hair.'});
  }

  // start the server
  app.listen(3001, async () => {
    console.log('listening on port 3001');
  });
});
