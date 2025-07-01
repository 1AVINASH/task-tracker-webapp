import { title } from 'process';
import React, {useState} from 'react'
import useGlobalTaskStore, { Task } from '../../../../store/tasks'
import { Link } from 'react-router-dom';
import Modal from '../../../../components/Modals/Modal'
import { createTaskApi } from '../../api/tasks'
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FetchTasksReq } from '../../api/tasks'
import useGlobalBoardsStore, { Board } from '../../../../store/boards'


// import TaskModal from './TaskModal'

// src/features/home/components/Banner.tsx
const Project = () => {
  const { boardId: boardIdParam } = useParams();
  const boardId = boardIdParam ? parseInt(boardIdParam, 10) : undefined;
  const tasks = useGlobalTaskStore((state) => state.tasks)
  const currentBoard = useGlobalBoardsStore((state) => state.currentBoard)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const queryClient = useQueryClient();
  const setIsDeleteAllModalOpen = useGlobalTaskStore((state) => state.setIsDeleteAllModalOpen)
  const queryParams: FetchTasksReq = {
      boardId: boardId!, // Assuming `enabled` handles undef/NaN check
  };

  const { mutate: addTask } = useMutation({ 
    mutationFn: createTaskApi, 
    onSuccess: (newTask) => {
      queryClient.setQueryData<Task[]>(['tasks', queryParams], (old) => (old ? [...old, newTask] : [newTask]));
    },
  });

  const handleAddTask = () => {
    if (title && body) {
      const requiredPriority = tasks.length === 0 ? 0 : tasks[tasks.length-1].priority + 1
      addTask({ title: title, board_id: boardId!, body: body, running: false, seconds: 0, priority: requiredPriority });
      // setTasks(() => [...tasks, { id: tasks.length+1, title, body, running: false, seconds: 0, priority: tasks.length + 1 }]);
      setTitle('');
      setBody('');
      setIsModalOpen(false);
    }
  };
  
  const handleBoardClick = () => {
    
  };

  return (
    <div className="bg-[#424242] p-4 flex items-center gap-4  w-[1000px] h-[200px]">
      <div className="w-1/5 h-4/5 ">
        <Link to={`/`} className="bg-[#1E5631] text-white rounded font-semibold border border-[#e3e3e3] flex justify-center items-center top-0 h-1/2">
            Boards
        </Link>
      </div>
      <p className="bg-[#202020] text-2xl underline text-[#e3e3e3] p-2.5 font-semibold pl-4 h-4/5 w-3/5 flex justify-center items-center">{currentBoard ? currentBoard.title : "TODO"}</p>
      <div className="flex flex-col space-y-2 w-1/5 h-[170px] p-4">
      <button className="bg-[#1E5631] text-white h-1/2 rounded font-semibold border border-[#e3e3e3]" onClick={() => setIsModalOpen(true)}>Add Task</button>
      <button className="bg-[#910000] text-white h-1/2 rounded font-semibold border border-[#e3e3e3]" onClick={() => setIsDeleteAllModalOpen(true)}>Delete All Tasks</button>
      </div>
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
