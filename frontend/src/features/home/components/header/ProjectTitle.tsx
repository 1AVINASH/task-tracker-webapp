import { title } from 'process';
import React, {useState} from 'react'
import useGlobalTaskStore, { Task } from '../../../../store/tasks'
import Modal from '../Modal'
// import TaskModal from './TaskModal'

// src/features/home/components/Banner.tsx
const Project = () => {
  const tasks = useGlobalTaskStore((state) => state.tasks)
  const setTasks = useGlobalTaskStore((state) => state.setTasks)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleAddTask = () => {
    console.log(`Add Task Called`)
    if (title && body) {
      setTasks(() => [...tasks, { id: tasks.length+1, title, body, running: false, seconds: 0 }]);
      setTitle('');
      setBody('');
      setIsModalOpen(false);
    }
  };

  return (
    <div className="bg-[#424242] p-4 flex items-center gap-4  w-[1000px] h-[100px]">
      <p className="bg-[#202020] text-2xl underline text-[#e3e3e3] p-2.5 font-semibold pl-4 h-4/5 w-4/5 flex justify-center items-center">TODO Task</p>
      <button className="bg-[#1E5631] text-white h-4/5 rounded w-1/5 font-semibold" onClick={() => setIsModalOpen(true)}>Add Task</button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-lg font-bold mb-4">New Task</h2>
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
          onClick={handleAddTask}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save Task
        </button>
      </Modal>
    </div>
  );
};

export default Project;
