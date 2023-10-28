const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const sequelize = new Sequelize('homework 11', 'postgres', '12345', {
  dialect: 'postgres',
  host: 'localhost'
});

const Todo = sequelize.define('Todo', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

sequelize.sync();

app.get('/todos', async (req, res) => {
  const todos = await Todo.findAll();
  res.json(todos);
});

app.get('/todos/:id', async (req, res) => {
  const todo = await Todo.findByPk(req.params.id);
  if (todo) {
    res.json(todo);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

app.post('/todos', async (req, res) => {
  try {
    const todo = await Todo.create({
      title: req.body.title,
    });
    res.json(todo);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

app.delete('/todos/:id', async (req, res) => {
  const todo = await Todo.findByPk(req.params.id);
  if (todo) {
    await todo.destroy();
    res.json({ message: 'Todo deleted' });
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
