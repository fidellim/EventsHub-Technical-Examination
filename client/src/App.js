import { useState, useEffect } from "react";
import "./App.css";

const App = () => {
	const API_BASE = "http://localhost:5000";
	const [todos, setTodos] = useState([]);
	const [popupAddNewTodo, setPopupAddNewTodo] = useState(false);
	const [newTodo, setNewTodo] = useState("");

	useEffect(() => {
		const getTodos = async () => {
			const res = await fetch(API_BASE + "/todos");

			if (!res.ok) {
				const message = `An error has occured: ${res.status}`;
				throw new Error(message);
			}

			const data = await res.json();
			setTodos(data);
		};
		getTodos();
	}, []);

	const markCompleteTodo = async (id) => {
		const res = await fetch(API_BASE + "/todo/complete/" + id);

		if (!res.ok) {
			const message = `An error has occured: ${res.status}`;
			throw new Error(message);
		}

		const data = await res.json();

		setTodos(
			todos.map((todo) => {
				if (todo._id === data._id) todo.complete = data.complete;
				return todo;
			})
		);
	};

	const addTodo = async () => {
		const res = await fetch(API_BASE + "/todo/new", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				text: newTodo,
			}),
		});

		if (!res.ok) {
			const message = `An error has occured: ${res.status}`;
			throw new Error(message);
		}

		const data = await res.json();
		setTodos([...todos, data]);
		setPopupAddNewTodo(false);
		setNewTodo("");
	};

	const deleteTodo = async (id) => {
		const res = await fetch(API_BASE + "/todo/delete/" + id, {
			method: "DELETE",
		});

		if (!res.ok) {
			const message = `An error has occured: ${res.status}`;
			throw new Error(message);
		}

		const data = await res.json();
		setTodos(todos.filter((todo) => todo._id !== data.result._id));
	};

	return (
		<main>
			<h1>Todo App</h1>
		</main>
	);
};

export default App;
