const {getDatabase} = require('./mongo');
const {ObjectID} = require('mongodb');

const collectionName = 'todos';

async function insertTodo(todo) {
  const database = await getDatabase();
  const {insertedId} = await database.collection(collectionName).insertOne(todo);
  return insertedId;
}

async function getTodos() {
  const database = await getDatabase();
  return await database.collection(collectionName).find({}).toArray();
}

async function deleteTodo(id) {
  const database = await getDatabase();
  await database.collection(collectionName).deleteOne({
    _id: new ObjectID(id),
  });
}

async function updateTodo(id, todo) {
  const database = await getDatabase();
  delete todo._id;
  await database.collection(collectionName).update(
    { _id: new ObjectID(id), },
    {
      $set: {
        ...todo,
      },
    },
  );
}

module.exports = {
  insertTodo,
  getTodos,
  deleteTodo,
  updateTodo,
};
