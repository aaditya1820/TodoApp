import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigateTo = useNavigate();
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:4002/todo/fetch",
          { withCredentials: true }
        );
        setTodos(response.data.todos);
        setError(null);
      } catch {
        setError("Failed to fetch todos");
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const todoCreate = async () => {
    if (!newTodo.trim()) return;
    try {
      const response = await axios.post(
        "http://localhost:4002/todo/create",
        { text: newTodo, completed: false },
        { withCredentials: true }
      );
      setTodos((prev) => [...prev, response.data.newTodo]);
      setNewTodo("");
    } catch {
      setError("Failed to create todo");
    }
  };

  const todoStatus = async (id) => {
    const todo = todos.find((t) => t._id === id);
    try {
      const response = await axios.put(
        `http://localhost:4002/todo/update/${id}`,
        { ...todo, completed: !todo.completed },
        { withCredentials: true }
      );
      setTodos((prev) => prev.map((t) => (t._id === id ? response.data.todo : t)));
    } catch {
      setError("Failed to update todo status");
    }
  };

  const todoDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4002/todo/delete/${id}`, {
        withCredentials: true,
      });
      setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch {
      setError("Failed to delete todo");
    }
  };

  const logout = async () => {
    try {
      await axios.get("http://localhost:4002/user/logout", {
        withCredentials: true,
      });
      localStorage.removeItem("jwt"); // clear token
      toast.success("Logged out successfully");
      navigateTo("/login");
    } catch {
      toast.error("Error logging out");
    }
  };

  const remainingTodos = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Todo App</h1>

        {/* Input */}
        <div className="flex mb-4 space-x-2">
          <input
            type="text"
            placeholder="Add a new todo"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && todoCreate()}
            className="flex-grow p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <button
            onClick={todoCreate}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>

        {/* Error or Loading */}
        {loading && <div className="text-center text-blue-500 font-medium">Loading...</div>}
        {error && <div className="text-center text-red-500 font-medium">{error}</div>}

        {/* Todos list */}
        {!loading && !error && (
          <ul className="space-y-3">
            {todos.map((todo) => (
              <li
                key={todo._id}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow transition"
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => todoStatus(todo._id)}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className={`text-lg ${todo.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
                    {todo.text}
                  </span>
                </div>
                <button
                  onClick={() => todoDelete(todo._id)}
                  className="text-red-500 hover:text-red-700 transition font-medium"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Remaining Todos */}
        <p className="mt-4 text-center text-sm text-gray-500 font-medium">
          {remainingTodos} remaining todos
        </p>

        {/* Logout */}
        <button
          onClick={logout}
          className="mt-6 w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition shadow"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Home;
