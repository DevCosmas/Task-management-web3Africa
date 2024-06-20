import React, { useState, useEffect } from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TaskManager = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask && dueDate) {
      const task = {
        id: Date.now(),
        title: newTask,
        dueDate,
        isCompleted: false,
      };
      setTasks([...tasks, task]);
      setNewTask('');
      setDueDate('');
      toast.success('Task added successfully!');
    } else {
      toast.error('Please enter a task title and due date.');
    }
  };

  const editTask = (id) => {
    const taskToEdit = tasks.find((task) => task.id === id);
    if (taskToEdit) {
      setNewTask(taskToEdit.title);
      setDueDate(taskToEdit.dueDate);
      setEditingTaskId(id);
    }
  };

  const updateTask = () => {
    if (editingTaskId !== null) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTaskId
            ? { ...task, title: newTask, dueDate }
            : task
        )
      );
      setNewTask('');
      setDueDate('');
      setEditingTaskId(null);
      toast.success('Task updated successfully!');
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    toast.info('Task deleted.');
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
    const task = tasks.find((task) => task.id === id);
    toast.success(
      task.isCompleted
        ? 'Task marked as incomplete.'
        : 'Task marked as complete.'
    );
  };

  const incompleteTasks = tasks.filter((task) => !task.isCompleted);
  const completedTasks = tasks.filter((task) => task.isCompleted);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 mt-11">Manage Your Task Today</h1>
      <div className="mb-4 flex flex-col md:flex-row">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="border p-2 mr-2 mb-4 rounded-lg px-4 py-2 md:mb-0"
          placeholder="Task title"
          aria-label="Task title"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border p-2 mr-2 mb-4 rounded-lg md:mb-0"
          aria-label="Due date"
        />
        {editingTaskId ? (
          <button
            onClick={updateTask}
            className="bg-blue-500 text-white p-2">
            Update Task
          </button>
        ) : (
          <button
            onClick={addTask}
            className="bg-green-500 rounded-lg text-lg sm:hover:bg-green-700 text-white p-2">
            Add Task
          </button>
        )}
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2 text-yellow-500">
          Tasks in Progress
        </h2>
        {incompleteTasks.length === 0 && <div>No task at hand</div>}
        <ul>
          {incompleteTasks.map((task) => (
            <li
              key={task.id}
              className="mb-2 flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.isCompleted}
                  onChange={() => toggleComplete(task.id)}
                  className="mr-2"
                  aria-label="Mark task as complete"
                />
                <span>{task.title}</span>
                <span className="text-gray-500 ml-2">({task.dueDate})</span>
              </div>
              <div>
                <button
                  onClick={() => editTask(task.id)}
                  className="bg-yellow-500 text-white p-2 mr-2">
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="bg-red-500 text-white p-2">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-bold mt-6 mb-2 text-green-600">
          Completed Tasks
        </h2>
        {completedTasks.length === 0 && <div>No completed task for now</div>}
        <ul>
          {completedTasks.map((task) => (
            <li
              key={task.id}
              className="mb-2 flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.isCompleted}
                  onChange={() => toggleComplete(task.id)}
                  className="mr-2"
                  aria-label="Mark task as incomplete"
                />
                <span className="line-through">{task.title}</span>
                <span className="text-gray-500 ml-2">({task.dueDate})</span>
              </div>
              <div>
                <button
                  onClick={() => editTask(task.id)}
                  className="bg-yellow-500 text-white p-2 mr-2">
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="bg-red-500 text-white p-2">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
};

export default TaskManager;
