import React, { useState } from 'react';
import './TodoList.css';
import { v4 as uuidv4 } from 'uuid';

type Todo = {
  inputValue: string;
  id: string;
  checked: boolean;
};

function App() {
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // ローカルストレージからデータを読み込む
  React.useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    console.log(savedTodos);
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
        if (Array.isArray(parsedTodos)) {
          setTodos(parsedTodos);
        } else {
          console.error('保存されたデータが配列ではありません:', parsedTodos);
        }
      } catch (error) {
        console.error('データのパースに失敗しました:', error);
      }
      setIsInitialized(true); // 初期化完了
    }
  }, []);

  React.useEffect(() => {
    // 初期化後のみ保存
    if (isInitialized) {
      console.log('保存するデータ:', todos); // デバッグログ
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos, isInitialized]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputValue.trim() === '') {
      setError('入力欄が空欄です！');
      return;
    }

    // 新しいToDoを作成
    const newTodo: Todo = {
      inputValue: inputValue,
      id: uuidv4(),
      checked: false,
    };
    setTodos([newTodo, ...todos]);
    setInputValue('');
    setError(null);
  };

  // リファクタリング前
  // const handleEdit = (id: string, inputValue: string) => {
  //   const newTodos = todos.map((todo) => {
  //     if (todo.id === id) {
  //       todo.inputValue = inputValue;
  //     }
  //     return todo;
  //   });
  //   setTodos(newTodos);
  // };
  // リファクタリング後
  const handleEdit = (id: string, inputValue: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? { ...todo, inputValue } : todo))
    );
  };

  // リファクタリング前
  // const handleChecked = (id: string, checked: boolean) => {
  //   const newTodos = todos.map((todo) => {
  //     if (todo.id === id) {
  //       todo.checked = !checked;
  //     }
  //     return todo;
  //   });
  //   setTodos(newTodos);
  // };
  // リファクタリング後
  const toggleTodoChecked = (id: string, checked: boolean) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, checked: !checked } : todo
      )
    );
  };

  const handleDelete = (id: string) => {
    setTodos((todos) => todos.filter((todos) => todos.id !== id));
  };

  return (
    <div className="App">
      <div>
        <h2>Todoリスト with Typescript</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            className="inputText"
          />
          <input type="submit" value="作成" className="submitButton" />
        </form>
        {error && <p className="error blink">{error}</p>}
        <ul className="todoList">
          {todos.map((todo) => (
            <li key={todo.id}>
              <input
                type="text"
                onChange={(e) => handleEdit(todo.id, e.target.value)}
                className="inputText"
                value={todo.inputValue}
                disabled={todo.checked}
              />
              <input
                type="checkbox"
                onChange={() => toggleTodoChecked(todo.id, todo.checked)}
              />
              <button
                onClick={() => {
                  handleDelete(todo.id);
                }}
              >
                消
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
