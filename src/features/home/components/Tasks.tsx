// src/features/home/pages/Home.tsx
import React, { useState } from 'react'
import TaskCard from './TaskCard';
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
    console.log(index)
    const updatedTasks = tasks.filter((_, i) => i !== index)
    setTasks(updatedTasks)
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
    setTasks(updatedTasks)
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
    setTasks(updatedTasks)
  }

  const handleEditTask = (index: number) => {
    console.log(`Edit Task Called`)
    const newTasks = [...tasks]
    const currTask = newTasks[index]
    if (currTask.title && currTask.body) {
      newTasks[index] = {title: title, body: body}
      setTasks(newTasks)
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
    <div>
      {/* <TaskCard /> */}
      <ol>
        {tasks.map((task, index) => <li key={index}><span className="text">
          <div className="bg-blue-400 p-4 rounded w-[1000px]">
            <div>
            <h1 className="text-2xl font-semibold mb-2">{task.title}</h1>
            <p>{task.body}</p>
          </div>
          <button className="m-1 bg-red-600 p-3 text-white" onClick={() => deleteTask(index)}> Delete </button>
          <button className="m-1 bg-red-600 p-3 text-white" onClick={() => editTask(index)}> Edit </button>
          <button className="m-1 bg-red-600 p-3 text-white" onClick={() => moveTaskUp(index)}> Move Up </button>
          <button className="m-1 bg-red-600 p-3 text-white"  onClick={() => moveTaskDown(index)}> Move Down </button>
          <button className="m-1 bg-red-600 p-3 text-white"> Start Timer </button>
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
