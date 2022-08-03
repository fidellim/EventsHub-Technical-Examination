import { useState, useEffect } from "react";
import "./App.css";
import { AiOutlineClose, AiFillEdit, AiOutlinePlus } from "react-icons/ai";
import { BiTask } from "react-icons/bi";

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

	// submit new task using "Enter" key
	const handleEnterKey = (e) => {
		//it triggers by pressing the enter key
		if (e.keyCode === 13) {
			addTodo();
		}
	};

	return (
		<main>
			<h1>Todo App</h1>

			<div className="todos">
				{todos.map((todo) => (
					<div className="todo" key={todo._id}>
						<div className="checkbox"></div>
						<div className="text">{todo.text}</div>
						<div className="editTodo">
							<AiFillEdit />
						</div>
						<div className="deleteTodoBtn" onClick={() => deleteTodo(todo._id)}>
							<AiOutlineClose />
						</div>
					</div>
				))}

				{todos.length === 0 && <p>No tasks</p>}
			</div>

			<div
				className="addTodoFloatingBtn"
				onClick={() => setPopupAddNewTodo(!popupAddNewTodo)}
			>
				<AiOutlinePlus />
			</div>

			{popupAddNewTodo && (
				<div className="addTodoModal" onClick={() => setPopupAddNewTodo(false)}>
					<div onClick={(e) => e.stopPropagation()}>
						<div
							className="closePopup"
							onClick={() => setPopupAddNewTodo(false)}
						>
							<AiOutlineClose />
						</div>
						<h2>Add Task</h2>
						<input
							type="text"
							className="addTodoInput"
							onChange={(e) => setNewTodo(e.target.value)}
							value={newTodo}
							onKeyDown={(e) => handleEnterKey(e)}
						/>
						<div className="addTodoBtn" onClick={addTodo}>
							<BiTask />
						</div>
					</div>
				</div>
			)}
		</main>
	);
};

export default App;
