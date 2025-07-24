import { title } from 'process';
import React, {useState, useEffect} from 'react'
import useGlobalTaskStore, { Task, TaskStatus } from '../../../../store/tasks'
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
  const taskStatus = useGlobalTaskStore((state) => state.taskStatus)
  const setTaskStatus = useGlobalTaskStore((state) => state.setTaskStatus)
  const setIsDeleteAllModalOpen = useGlobalTaskStore((state) => state.setIsDeleteAllModalOpen)
  const queryParams: FetchTasksReq = {
      boardId: boardId!, // Assuming `enabled` handles undef/NaN check
      taskStatus: taskStatus!, // Assuming `enabled` handles undef/NaN check
  };

  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'Enter') {
        // Prevents the default action of adding a new line in the textarea
        event.preventDefault(); 

        handleAddTask();
      }
    };
    // Add event listener when the modal is open
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup: remove event listener when the modal is closed
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, title, body]); // Dependencies for the effect

  const { mutate: addTask } = useMutation({ 
    mutationFn: createTaskApi, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', queryParams] as const });
    },
  });

  const handleAddTask = () => {
    if (title && body) {
      var tasks = queryClient.getQueryData<Task[]>(['tasks', queryParams])
      if (!tasks) {
        tasks = [];
      }
      const requiredPriority = tasks.length === 0 ? 0 : tasks[tasks.length-1].priority + 1
      addTask({ title: title, board_id: boardId!, body: body, running: false, seconds: 0, priority: requiredPriority, status: "" });
      setTitle('');
      setBody('');
      setIsModalOpen(false);
    }
  };

  const handleViewChange = (newTaskStatus: string) => {
    setTaskStatus(newTaskStatus)
    queryParams.taskStatus = newTaskStatus
    queryClient.invalidateQueries({ queryKey: ['tasks', queryParams] as const });
  }

  return (
    <div className="bg-[#424242] p-4 flex items-center gap-4  w-[1000px] h-[200px]">
      <div className="w-1/5 space-y-2 h-[170px] flex flex-col p-4">
        <Link to={`/`} className="bg-[#1E5631] text-white rounded font-semibold border border-[#e3e3e3] flex justify-center items-center top-0 h-1/2">
            Boards
        </Link>
        {
          taskStatus==TaskStatus.DELETED ?
          <button className="bg-[#1E5631] text-white w-full h-1/2 rounded font-semibold border border-[#e3e3e3]" onClick={() => handleViewChange(TaskStatus.IN_PROGRESS)}>View Working</button>
          :
          (
            taskStatus==TaskStatus.IN_PROGRESS ?
            <button className="bg-[#910000] text-white w-full h-1/2 rounded font-semibold border border-[#e3e3e3]" onClick={() => handleViewChange(TaskStatus.COMPLETED)}>View Completed</button>
            :
            <button className="bg-[#910000] text-white w-full h-1/2 rounded font-semibold border border-[#e3e3e3]" onClick={() => handleViewChange(TaskStatus.DELETED)}>View Deleted</button>
          )
        }
      </div>
      <p className="bg-[#202020] text-2xl underline text-[#e3e3e3] p-2.5 font-semibold pl-4 h-4/5 w-3/5 flex justify-center items-center">{currentBoard ? currentBoard.title : "TODO"}</p>
      <div className="flex flex-col space-y-2 w-1/5 h-[170px] p-4">
      <button className="bg-[#1E5631] text-white h-1/2 rounded font-semibold border border-[#e3e3e3]" onClick={() => setIsModalOpen(true)}>Add Task</button>
      <button className="bg-[#910000] text-white h-1/2 rounded font-semibold border border-[#e3e3e3]" onClick={() => setIsDeleteAllModalOpen(true)}>Delete All Tasks</button>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} height={500}>
        <div className="relative h-2/3">
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
          className="w-full h-full mb-4 border px-2 py-1 rounded"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button
          onClick={handleAddTask}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save Task
        </button>
        </div>
      </Modal>
    </div>
  );
};

export default Project;
