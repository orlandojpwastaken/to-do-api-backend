const Todo = require('../models/todo');

const todoController = {
  createTodo: async (req, res) => {
    try {
      const { title, description, deadline } = req.body;
      const userId = req.user.id;

      // Validate required fields
      if (!title) {
        return res.status(400).json({ error: 'Title is required for creating a todo' });
      }
      if (!deadline) {
        return res.status(400).json({ error: 'Deadline is required for creating a todo' });
      }

      // Validate deadline format
      const deadlineDate = new Date(deadline);
      if (isNaN(deadlineDate.getTime())) {
        return res.status(400).json({ error: 'Invalid deadline format. Please use a valid date' });
      }
  
      const newTodo = await Todo.create({
        title,
        description,
        deadline,
        completed: false,
        userId
      });
  
      res.status(201).json({
        message: 'Todo created successfully',
        todo: newTodo
      });
    } catch (err) {
      console.error('Error creating todo:', err);
      if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({ 
          error: 'Validation error',
          details: err.errors.map(e => e.message)
        });
      }
      res.status(500).json({ 
        error: 'Failed to create todo',
        details: 'An unexpected error occurred while creating the todo'
      });
    }
  },
  
  getAllTodos: async (req, res) => {
    try {
      const userId = req.user.id;
      const todos = await Todo.findAll({ 
        where: { userId },
        order: [['createdAt', 'DESC']]
      });
      res.json({
        message: 'Todos retrieved successfully',
        todos
      });
    } catch (err) {
      console.error('Error fetching todos:', err);
      res.status(500).json({ 
        error: 'Failed to fetch todos',
        details: 'An unexpected error occurred while retrieving your todos'
      });
    }
  },

  getTodo: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Validate todo ID
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid todo ID format' });
      }

      const todo = await Todo.findOne({ where: { id, userId } });

      if (!todo) {
        return res.status(404).json({ 
          error: 'Todo not found',
          details: 'The requested todo does not exist or you do not have permission to access it'
        });
      }

      res.json({
        message: 'Todo retrieved successfully',
        todo
      });
    } catch (err) {
      console.error('Error fetching todo:', err);
      res.status(500).json({ 
        error: 'Failed to fetch todo',
        details: 'An unexpected error occurred while retrieving the todo'
      });
    }
  },

  updateTodo: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Validate todo ID
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid todo ID format' });
      }

      const todo = await Todo.findOne({ where: { id, userId } });

      if (!todo) {
        return res.status(404).json({ 
          error: 'Todo not found',
          details: 'The todo you are trying to update does not exist or you do not have permission to modify it'
        });
      }

      // Validate deadline if provided
      if (req.body.deadline) {
        const deadlineDate = new Date(req.body.deadline);
        if (isNaN(deadlineDate.getTime())) {
          return res.status(400).json({ error: 'Invalid deadline format. Please use a valid date' });
        }
      }

      await todo.update(req.body);
      res.json({
        message: 'Todo updated successfully',
        todo
      });
    } catch (err) {
      console.error('Error updating todo:', err);
      if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({ 
          error: 'Validation error',
          details: err.errors.map(e => e.message)
        });
      }
      res.status(500).json({ 
        error: 'Failed to update todo',
        details: 'An unexpected error occurred while updating the todo'
      });
    }
  },

  deleteTodo: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Validate todo ID
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid todo ID format' });
      }

      const todo = await Todo.findOne({ where: { id, userId } });

      if (!todo) {
        return res.status(404).json({ 
          error: 'Todo not found',
          details: 'The todo you are trying to delete does not exist or you do not have permission to delete it'
        });
      }

      await todo.destroy();
      res.json({ 
        message: 'Todo deleted successfully',
        details: `Todo with ID ${id} has been permanently deleted`
      });
    } catch (err) {
      console.error('Error deleting todo:', err);
      res.status(500).json({ 
        error: 'Failed to delete todo',
        details: 'An unexpected error occurred while deleting the todo'
      });
    }
  },

  toggleCompletion: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Validate todo ID
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid todo ID format' });
      }

      const todo = await Todo.findOne({ where: { id, userId } });
  
      if (!todo) {
        return res.status(404).json({ 
          error: 'Todo not found',
          details: 'The todo you are trying to update does not exist or you do not have permission to modify it'
        });
      }
  
      const updatedTodo = await todo.update({
        completed: !todo.completed
      });
  
      res.json({
        message: `Todo marked as ${updatedTodo.completed ? 'completed' : 'incomplete'}`,
        todo: updatedTodo
      });
    } catch (err) {
      console.error('Error toggling todo completion:', err);
      res.status(500).json({ 
        error: 'Failed to toggle todo completion',
        details: 'An unexpected error occurred while updating the todo status'
      });
    }
  }
};

module.exports = todoController;