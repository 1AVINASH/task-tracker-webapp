// src/features/home/pages/Home.tsx
import React, { useState, useRef, useEffect } from 'react'
import useGlobalBoardsStore, { Board } from '../../../store/boards'
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBoardsApi, createBoardApi, updateBoardApi } from '../api/boards'
import { formatDateTimeCustom } from '../../../utils/DateTimeUtils'
import Modal from '../../../components/Modals/Modal'
import { FiEdit } from 'react-icons/fi'

const Boards = () => {
  const setBoards = useGlobalBoardsStore((state) => state.setBoards)
  const setCurrentBoard = useGlobalBoardsStore((state) => state.setCurrentBoard)
  const [currIndex, setCurrentIndex] = useState(-1)
  const [title, setTitle] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const queryClient = useQueryClient();

  const { data: boards = [], isLoading, error } = useQuery({
    queryKey: ['boards'],
    queryFn: fetchBoardsApi,
    refetchOnWindowFocus: false,
    staleTime: 10000,
  });

  const { mutate: updateBoardMutation } = useMutation({ 
      mutationFn: updateBoardApi, 
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['boards'] as const });
      },
      }
    );

  const handleBoardLinkClick = (index: number) => {
    setCurrentBoard(boards[index])
  }
  
  const handleEditClick = (event: React.MouseEvent, index: number) => {
    event.stopPropagation()
    setCurrentIndex(index);
    setIsEditModalOpen(true);
    setTitle(boards[index].title)
  }

  const handleSaveOnEdit = () => {
    const newBoards = [...boards]
    const currBoard = newBoards[currIndex]
    if (currBoard.title) {
      updateBoardMutation({ id: currBoard.id, title: title, theme: currBoard.theme });
      setTitle('');
      setIsEditModalOpen(false);
    }
  }

  return (
    <div className="mt-5 w-[1000px] px-4 pb-2">
      <ol className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-4 gap-3 justify-items-center auto-rows-fr">
        {
          boards.map((board, index) => <li key={index}>
            <div className="mb-3 mx-3">
              <div className="relative overflow-hidden shadow-lg rounded-t">
              {/* Background Image */}
              <Link to={`${board.id}/tasks`} onClick={() => handleBoardLinkClick(index)}>
              <img
                src="https://wallpapers.com/images/featured-full/themes-fsse3r2bqsprys77.jpg"
                alt="Background"
                className="w-full h-full object-cover"
              />
              {/* Text Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-center">
                <h2 className="text-white font-semibold">{board.title}</h2>
              </div>
                </Link>
                  <button className="bg-white top-0 right-0 absolute bg-opacity-90 flex items-start justify-end" onClick={(e) => handleEditClick(e, index)}>
                  <FiEdit className=""/>
                  <span className="sr-only">Edit</span> 
                </button>
            </div>
            <div className="rounded-b bg-[#202020] text-[#e3e3e3] text-xs py-3 px-2 items-center justify-center"> 
              <p> Last Update: {formatDateTimeCustom(board.last_updated_at)}</p>
              <p>ID: {board.id}</p>
            </div>
            </div>
          </li>)
        }
      </ol>
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2 className="text-lg font-bold mb-4">Edit Board</h2>
        <input
          type="text"
          placeholder="Title"
          className="w-full mb-2 border px-2 py-1 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          onClick={() => handleSaveOnEdit()}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save Board
        </button>
      </Modal>
    </div>
  );
};

export default Boards;
