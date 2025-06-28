// src/features/home/pages/Home.tsx
import React, { useState, useRef } from 'react'
import useGlobalTaskStore, { Task } from '../../../store/tasks'
import Modal from './Modal'


const Tasks = () => {
  const tasks = useGlobalTaskStore((state) => state.tasks)
  const setTasks = useGlobalTaskStore((state) => state.setTasks)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [currIndex, setIndex] = useState(-1);

  
  function deleteTask(index: number){
    const updatedTasks = tasks.filter((_, i) => i !== index)
    setTasks(() => updatedTasks)
  }
  
  function moveTaskUp(index: number){
    const updatedTasks = [...tasks]
    if (index === 0 ){
      return
    }
    const previousTask = tasks[index-1]
    const currTask = tasks[index]
    updatedTasks[index-1] = currTask
    updatedTasks[index] = previousTask
    setTasks(() => updatedTasks)
  }
  
  function moveTaskDown(index: number){
    const updatedTasks = [...tasks]
    if (index === tasks.length-1 ){
      return
    }
    const nextTask = tasks[index+1]
    const currTask = tasks[index]
    updatedTasks[index+1] = currTask
    updatedTasks[index] = nextTask
    setTasks(() => updatedTasks)
  }

  const timers = useRef<{ [id: number]: NodeJS.Timeout }>({});

  const startTimer = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, running: true } : task
      )
    );

  timers.current[id] = setInterval(() => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id && task.running // ✅ only increment if still running
          ? { ...task, seconds: task.seconds + 1 }
          : task
      )
    );
  }, 1000);
  }

  const stopTimer = (id: number) => {
    clearInterval(timers.current[id]);
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, running: false } : task
      )
    );
  };

  const handleEditTask = (index: number) => {
    const newTasks = [...tasks]
    const currTask = newTasks[index]
    if (currTask.title && currTask.body) {
      newTasks[index] = {id: tasks.length+1, title: title, body: body, seconds: 0, running: false}
      setTasks(() => newTasks)
      setTitle('');
      setBody('');
      setIsModalOpen(false);
    }
  };

  const editTask = (index: number) => {
    setIndex(index);
    setIsModalOpen(true);
    setTitle(tasks[index].title)
    setBody(tasks[index].body)
  }

  const modalOnClose = () => {
    setIsModalOpen(false)
    setTitle('')
    setBody('')
  }

  return (
    <div className="bg-[#424242] w-[1000px] px-4 pb-2">
      <ol>
        {tasks.map((task, index) => <li key={index}><span className="text">
          <div className="rounded mb-3 p-3 bg-[#202020] text-white">
            <div  className="ml-2">
            <h1 className="text-2xl font-semibold mb-2">{task.title}</h1>
            <p>{task.body}</p>
          </div>
          <button className="m-1 bg-[#424242] p-3 text-white rounded" onClick={() => editTask(index)}> Edit </button>
          <button className="m-1 bg-[#424242] p-3 text-white rounded" onClick={() => moveTaskUp(index)}> Move Up </button>
          <button className="m-1 bg-[#424242] p-3 text-white rounded"  onClick={() => moveTaskDown(index)}> Move Down </button>
          {!task.running ? (
            <button
              onClick={() => startTimer(task.id)}
              className="m-1 bg-[#1E5631] p-3 text-white rounded"
            >
              Start Timer
            </button>
          ) : (
            <button
              onClick={() => stopTimer(task.id)}
              className="m-1 bg-[#910000] p-3 text-white rounded"
            >
              Stop Timer
            </button>
          )}
          <button className="m-1 bg-[#910000] p-3 text-white rounded" onClick={() => deleteTask(index)}> Delete </button>
          <span className="bg-[#910000] p-3.5 pb-4 text-white rounded" onClick={() => deleteTask(index)}>Time Taken: {task.seconds} </span>
          </div>
          </span></li>)}
      </ol>
      <Modal isOpen={isModalOpen} onClose={() => modalOnClose()}>
        <h2 className="text-lg font-bold mb-4">Edit Task</h2>
        <input
          type="text"
          placeholder="Title"
          className="w-full mb-2 border px-2 py-1 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Body"
          className="w-full mb-4 border px-2 py-1 rounded"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button
          onClick={() => handleEditTask(currIndex)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save Task
        </button>
      </Modal>
    </div>
  );
};

export default Tasks;
