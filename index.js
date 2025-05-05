require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const sequelize = require('./db/connection');
const userRoutes = require('./routes/users');
const todoRoutes = require('./routes/todo');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Update this to match your frontend URL
  credentials: true
}));
app.use(express.json());

// Swagger setup
const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'ToDo API',
        version: '1.0.0',
      },
    },
    apis: ['./routes/*.js'],
  };
  
  const specs = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));  

// Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: false, // use secure: true if using HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/todos', todoRoutes);

// Sequelize authentication (checking the database connection)
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// Sync models with the database
sequelize.sync()
  .then(() => {
    console.log('Models synced successfully.');
  })
  .catch((err) => {
    console.error('Error syncing models:', err);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
