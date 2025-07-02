import React, {useState} from 'react'
import useGlobalTaskStore, { Task } from '../../../../store/tasks'
import Modal from '../../../../components/Modals/Modal'
import { fetchBoardsApi, createBoardApi } from '../../api/boards'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Board } from '../../../../store/boards';


// import TaskModal from './TaskModal'

// src/features/home/components/Banner.tsx
const BoardTitle = () => {
  const tasks = useGlobalTaskStore((state) => state.tasks)
  const setTasks = useGlobalTaskStore((state) => state.setTasks)
  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false)
  const [title, setTitle] = useState('');
  const queryClient = useQueryClient();
  const isDeleteAllModalOpen = useGlobalTaskStore((state) => state.isDeleteAllModalOpen)
  const setIsDeleteAllModalOpen = useGlobalTaskStore((state) => state.setIsDeleteAllModalOpen)

  const { mutate: addBoard } = useMutation({ 
    mutationFn: createBoardApi, 
    onSuccess: (newBoard) => {
      queryClient.invalidateQueries({ queryKey: ['boards'] as const });
    },
  });

  const handleAddBoard = () => {
    if (title) {
      addBoard({ title: title, theme: "", last_updated_at: "testUpdatedAt" });
      setTitle('');
      setIsCreateBoardModalOpen(false);
    }
  };

  return (
    <div className="bg-[#424242] p-4 flex items-center gap-4  w-[1000px] h-[200px]">
      <p className="bg-[#202020] text-2xl underline text-[#e3e3e3] p-2.5 font-semibold pl-4 h-4/5 w-4/5 flex justify-center items-center">Boards</p>
      <div className="flex flex-col space-y-2 w-1/5 h-[170px] p-4">
      <button className="bg-[#1E5631] text-white h-1/2 rounded font-semibold border border-[#e3e3e3]" onClick={() => setIsCreateBoardModalOpen(true)}>Add Board</button>
      </div>
      <Modal isOpen={isCreateBoardModalOpen} onClose={() => setIsCreateBoardModalOpen(false)}>
        <h2 className="text-lg font-bold mb-4">New Board</h2>
        <input
          type="text"
          placeholder="Title"
          className="w-full mb-2 border px-2 py-1 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          onClick={handleAddBoard}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save Board
        </button>
      </Modal>
    </div>
  );
};

export default BoardTitle;
