import React, { useState } from 'react'

import Modal, {ModalProps} from './Modal'
import useGlobalTaskStore, { Task } from '../../../store/tasks'

type TaskModalProps = {
  isOpen: boolean;
  title: string;
  body: string;
}

const TaskModal = ({ isOpen, title, body }: TaskModalProps) => {
  if (!isOpen) return null;
  const isModalOpen = useGlobalTaskStore((state) => state.isModalOpen)
  const setIsModalOpen = useGlobalTaskStore((state) => state.setIsModalOpen)
  const [newTitle, setTitle] = useState(title);
  const [newBody, setBody] = useState(body);
  const tasks = useGlobalTaskStore((state) => state.tasks)
  const setTasks = useGlobalTaskStore((state) => state.setTasks)

  const handleAddTask = () => {
    if (title && body) {
      setTasks(() => [...tasks, { id: 1, title, body, seconds: 0, running: false }]);
      setTitle('');
      setBody('');
      setIsModalOpen(false);
    }
  };

  return (
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
  );
};

// export default TaskModal;
