const express = require("express");
const router = express.Router();

const {
	getTodos,
	createTodo,
	deleteTodo,
	completeTodo,
	updateTodo,
} = require("../controllers/posts");

router.get("/todos", getTodos);
router.post("/todo/new", createTodo);
router.delete("/todo/delete/:id", deleteTodo);
router.get("todo/complete/:id", completeTodo);
router.put("/todo/update/:id", updateTodo);

module.exports = router;
