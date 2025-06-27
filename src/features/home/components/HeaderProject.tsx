import { title } from 'process';
import React, {useState} from 'react'
import useGlobalTaskStore, { Task } from '../../../store/tasks'
import Modal from './Modal'
// import TaskModal from './TaskModal'

// src/features/home/components/Banner.tsx
const HeaderProject = () => {
  const tasks = useGlobalTaskStore((state) => state.tasks)
  const setTasks = useGlobalTaskStore((state) => state.setTasks)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleAddTask = () => {
    console.log(`Add Task Called`)
    if (title && body) {
      setTasks([...tasks, { title, body }]);
      setTitle('');
      setBody('');
      setIsModalOpen(false);
    }
  };

  return (
    <div className="bg-blue-100 p-4 rounded flex items-center gap-4  w-[1000px]">
      <p className="bg-red-500 text-white p-4  w-[1000px]">TODO Task</p>
      <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => setIsModalOpen(true)}>Add Task</button>
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

export default HeaderProject;
