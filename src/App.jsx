import { Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import { useFetchTodos, useAddTodo, useTodos } from "./hooks";
import TodoForm from "./components/TodoForm";
import TaskPage from "./pages/TaskPage";
import NotFoundPage from "./pages/NotFoundPage";
import styles from "./App.module.css";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSorted, setIsSorted] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    todos,
    allServerTodos,
    setAllServerTodos,
    setTodos,
    currentIndex,
    setCurrentIndex,
  } = useTodos();

  useFetchTodos(setAllServerTodos);

  const addTodo = useAddTodo(
    setTodos,
    allServerTodos,
    currentIndex,
    setCurrentIndex,
    setLoadingMessage,
    setIsProcessing
  );

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const toggleSort = () => {
    setIsSorted(!isSorted);
  };

  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isSorted) {
    filteredTodos.sort((a, b) => a.title.localeCompare(b.title));
  }

  return (
    <div className={styles.app}>
      <Routes>
        <Route
          path="/"
          element={
            <>
              {isProcessing && (
                <div className={styles.overlay}>
                  <h2 className={styles.loadingMessage}>{loadingMessage}</h2>
                </div>
              )}
              <h1>Todo List</h1>
              <TodoForm
                addTodo={addTodo}
                handleSearch={handleSearch}
                toggleSort={toggleSort}
                isSorted={isSorted}
                isProcessing={isProcessing} // Передаем isProcessing сюда
              />
              <ul className={styles.todoList}>
                {filteredTodos.map(({ id, title }) => (
                  <li key={id} className={styles.todoItem}>
                    <Link to={`/task/${id}`} className={styles.todoTitle}>
                      {title.length > 30 ? title.slice(0, 30) + "..." : title}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          }
        />
        <Route path="/task/:id" element={<TaskPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default App;
