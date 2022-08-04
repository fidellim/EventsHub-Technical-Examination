// const express = require("express");
const Todo = require("../models/Todo"); // Models
// const router = express.Router();

const getTodos = async (req, res) => {
	const todos = await Todo.find();

	res.json(todos);
};

const createTodo = (req, res) => {
	const todo = new Todo({
		text: req.body.text,
	});

	todo.save();

	res.json(todo);
};

const deleteTodo = async (req, res) => {
	const result = await Todo.findByIdAndDelete(req.params.id);

	res.json({ result });
};

const completeTodo = async (req, res) => {
	const todo = await Todo.findById(req.params.id);

	todo.complete = !todo.complete;

	todo.save();

	res.json(todo);
};

const updateTodo = async (req, res) => {
	const todo = await Todo.findById(req.params.id);

	todo.text = req.body.text;

	todo.save();

	res.json(todo);
};

module.exports = {
	getTodos,
	createTodo,
	deleteTodo,
	completeTodo,
	updateTodo,
};
