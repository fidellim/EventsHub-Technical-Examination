import { useState, useEffect } from "react";
import "./App.css";
import { AiOutlineClose, AiFillEdit, AiOutlinePlus } from "react-icons/ai";
import { BiTask } from "react-icons/bi";

const App = () => {
	const API_BASE = "http://localhost:5000";
	const [todos, setTodos] = useState([]);
	const [popupAddNewTodo, setPopupAddNewTodo] = useState(false);
	const [popupEditTodo, setPopupEditTodo] = useState(false);
	const [newTodo, setNewTodo] = useState("");
	const [editTodo, setEditTodo] = useState({});

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

	const updateTodo = async () => {
		const res = await fetch(API_BASE + "/todo/update/" + editTodo._id, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				text: editTodo.text,
			}),
		});

		if (!res.ok) {
			const message = `An error has occured: ${res.status}`;
			throw new Error(message);
		}

		const data = await res.json();

		const newTodo = todos.map((todo) => {
			if (todo._id === data._id) todo.text = data.text;
			return todo;
		});

		setTodos(newTodo);
		setPopupEditTodo(false);
		setEditTodo({});
	};

	// submit new task using "Enter" key
	const handleEnterKeyAddTodo = (e) => {
		//it triggers by pressing the enter key
		if (e.keyCode === 13) {
			addTodo();
		}
	};

	const handleEnterKeyEditTodo = (e) => {
		//it triggers by pressing the enter key
		if (e.keyCode === 13) {
			handleSubmitEditTodo();
		}
	};

	const handleEditTodo = (todo) => {
		setEditTodo(todo);
		setPopupEditTodo(!popupEditTodo);
	};

	const handleSubmitEditTodo = () => {
		updateTodo();
		setPopupEditTodo(!popupEditTodo);
	};

	return (
		<main>
			<h1>Todo App</h1>

			<div className="todos">
				{todos.map((todo) => (
					<div
						className={`todo ${todo.complete ? "isComplete" : ""}`}
						key={todo._id}
					>
						<div>
							<div
								className="checkbox"
								onClick={() => markCompleteTodo(todo._id)}
							></div>
							<div className="text" onClick={() => markCompleteTodo(todo._id)}>
								{todo.text}
							</div>
						</div>
						<div className="todoIcons">
							<div className="editTodoBtn" onClick={() => handleEditTodo(todo)}>
								<AiFillEdit />
							</div>
							<div
								className="deleteTodoBtn"
								onClick={() => deleteTodo(todo._id)}
							>
								<AiOutlineClose />
							</div>
						</div>
					</div>
				))}

				{todos.length === 0 && (
					<p className="noTaskText">
						The list is currently empty. Try to add a task!
					</p>
				)}
			</div>

			<div
				className="addTodoFloatingBtn"
				onClick={() => setPopupAddNewTodo(!popupAddNewTodo)}
			>
				<AiOutlinePlus />
			</div>

			{popupEditTodo && (
				<div className="todoModal" onClick={() => setPopupEditTodo(false)}>
					<div onClick={(e) => e.stopPropagation()}>
						<div className="closePopup" onClick={() => setPopupEditTodo(false)}>
							<AiOutlineClose />
						</div>
						<h2>Edit Task</h2>
						<input
							type="text"
							className="todoInputModal"
							placeholder="Enter text here"
							onChange={(e) =>
								setEditTodo((prev) => ({ ...prev, text: e.target.value }))
							}
							value={editTodo.text}
							onKeyDown={(e) => handleEnterKeyEditTodo(e)}
						/>
						{console.log(editTodo.text)}
						<div className="todoModalBtn" onClick={handleSubmitEditTodo}>
							<AiFillEdit />
						</div>
					</div>
				</div>
			)}

			{popupAddNewTodo && (
				<div className="todoModal" onClick={() => setPopupAddNewTodo(false)}>
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
							className="todoInputModal"
							placeholder="Enter text here"
							onChange={(e) => setNewTodo(e.target.value)}
							value={newTodo}
							onKeyDown={(e) => handleEnterKeyAddTodo(e)}
						/>
						<div className="todoModalBtn" onClick={addTodo}>
							<BiTask />
						</div>
					</div>
				</div>
			)}
		</main>
	);
};

export default App;
