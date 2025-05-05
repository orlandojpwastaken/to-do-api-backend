const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');
const User = require('./user');

const Todo = sequelize.define('Todo', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
          isNotInPast(value) {
            if (new Date(value) < new Date()) {
              throw new Error('Deadline cannot be in the past');
            }
          }
        }
      },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
});

// Define association
Todo.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Todo, { foreignKey: 'userId' });

module.exports = Todo;
