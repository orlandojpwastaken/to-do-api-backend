const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const auth = require('../middleware/auth');

// Protect all todo routes with auth middleware
router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: ToDo management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       required:
 *         - title
 *         - deadline
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID of the todo
 *         title:
 *           type: string
 *           description: Title of the todo
 *         description:
 *           type: string
 *           description: Optional description of the todo
 *         completed:
 *           type: boolean
 *           description: Whether the to-do is completed
 *         deadline:
 *           type: string
 *           format: date-time
 *           description: Deadline for the todo
 *         userId:
 *           type: integer
 *           description: ID of the user who owns the todo
 *       example:
 *         id: 1
 *         title: "Finish project"
 *         description: "Finish the backend and frontend of the app"
 *         deadline: "2025-05-10T23:59:00.000Z"
 *     CreateTodoInput:
 *       type: object
 *       required:
 *         - title
 *         - deadline
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the to-do
 *         description:
 *           type: string
 *           description: Optional description of the to-do
 *         deadline:
 *           type: string
 *           format: date-time
 *           description: Deadline for the to-do
 */

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new to-do
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTodoInput'
 *           example:
 *             title: "Finish project"
 *             description: "Finish the backend and frontend of the app"
 *             deadline: "2025-05-10T18:00:00.000Z"
 *     responses:
 *       201:
 *         description: To-do created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/', todoController.createTodo);

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Get all to-dos for the logged-in user
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: List of to-dos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 *       401:
 *         description: Unauthorized
 */
router.get('/', todoController.getAllTodos);

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Get a single to-do by ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the to-do
 *     responses:
 *       200:
 *         description: To-do found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: To-do not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', todoController.getTodo);

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Update a to-do by ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the to-do
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       200:
 *         description: To-do updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: To-do not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', todoController.updateTodo);

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a to-do by ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the to-do
 *     responses:
 *       200:
 *         description: To-do deleted
 *       404:
 *         description: To-do not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', todoController.deleteTodo);

/**
 * @swagger
 * /api/todos/{id}/toggle:
 *   patch:
 *     summary: Toggle the completed status of a todo
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the todo
 *     responses:
 *       200:
 *         description: Toggles the state of the todo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: To-do not found
 *       401:
 *         description: Unauthorized
 */
router.patch('/:id/toggle', todoController.toggleCompletion);

module.exports = router;