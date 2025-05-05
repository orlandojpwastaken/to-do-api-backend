const Todo = require('../models/todo');

const todoController = {
  createTodo: async (req, res) => {
    try {
      const { title, description, deadline } = req.body;
      const userId = req.user.id;
  
      const newTodo = await Todo.create({
        title,
        description,
        deadline,
        completed: false,
        userId
      });
  
      res.status(201).json(newTodo);
    } catch (err) {
      console.error('Error creating todo:', err);
      res.status(500).json({ error: 'Failed to create todo' });
    }
  },
  

  getAllTodos: async (req, res) => {
    try {
      const userId = req.user.id;
      const todos = await Todo.findAll({ where: { userId } });
      res.json(todos);
    } catch (err) {
      console.error('Error fetching todos:', err);
      res.status(500).json({ error: 'Failed to fetch todos' });
    }
  },

  getTodo: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const todo = await Todo.findOne({ where: { id, userId } });

      if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
      }

      res.json(todo);
    } catch (err) {
      console.error('Error fetching todo:', err);
      res.status(500).json({ error: 'Failed to fetch todo' });
    }
  },

  updateTodo: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const todo = await Todo.findOne({ where: { id, userId } });

      if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
      }

      await todo.update(req.body);
      res.json(todo);
    } catch (err) {
      console.error('Error updating todo:', err);
      res.status(500).json({ error: 'Failed to update todo' });
    }
  },

  deleteTodo: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const todo = await Todo.findOne({ where: { id, userId } });

      if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
      }

      await todo.destroy();
      res.json({ message: 'Todo deleted successfully' });
    } catch (err) {
      console.error('Error deleting todo:', err);
      res.status(500).json({ error: 'Failed to delete todo' });
    }
  }
};

module.exports = todoController;
