import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('kanbanTasks');
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        text: newTask,
        status: 'todo'
      };
      setTasks([...tasks, task]);
      setNewTask('');
    }
  };

  const moveTask = (id, direction) => {
    const statusOrder = ['todo', 'inProgress', 'done'];
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const currentIndex = statusOrder.indexOf(task.status);
        let newIndex = currentIndex;
        
        if (direction === 'right' && currentIndex < 2) newIndex++;
        if (direction === 'left' && currentIndex > 0) newIndex--;
        
        return { ...task, status: statusOrder[newIndex] };
      }
      return task;
    }));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="app">
      
      <div className="add-task">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Введите задачу"
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
        />
        <button onClick={addTask}>Добавить</button>
      </div>

      <div className="board">
        <div className="column">
          <h2>Сделать</h2>
          <div className="tasks">
            {getTasksByStatus('todo').map(task => (
              <div key={task.id} className="task">
                <span>{task.text}</span>
                <div className="task-actions">
                  <button onClick={() => moveTask(task.id, 'right')}>→</button>
                  <button onClick={() => deleteTask(task.id)}>×</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="column">
          <h2>В процессе</h2>
          <div className="tasks">
            {getTasksByStatus('inProgress').map(task => (
              <div key={task.id} className="task">
                <span>{task.text}</span>
                <div className="task-actions">
                  <button onClick={() => moveTask(task.id, 'left')}>←</button>
                  <button onClick={() => moveTask(task.id, 'right')}>→</button>
                  <button onClick={() => deleteTask(task.id)}>×</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="column">
          <h2>Сделано</h2>
          <div className="tasks">
            {getTasksByStatus('done').map(task => (
              <div key={task.id} className="task">
                <span>{task.text}</span>
                <div className="task-actions">
                  <button onClick={() => moveTask(task.id, 'left')}>←</button>
                  <button onClick={() => deleteTask(task.id)}>×</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;