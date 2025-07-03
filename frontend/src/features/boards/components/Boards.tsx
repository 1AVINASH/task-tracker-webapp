// src/features/home/pages/Home.tsx
import React, { useState, useRef, useEffect } from 'react'
import useGlobalBoardsStore, { Board } from '../../../store/boards'
import useGlobalFileHandlerStore from '../../../store/fileHandler'
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBoardsApi, createBoardApi, updateBoardApi } from '../api/boards'
import { formatDateTimeCustom } from '../../../utils/DateTimeUtils'
import Modal from '../../../components/Modals/Modal'
import { FiEdit } from 'react-icons/fi'
import FileUploader from './FileUploader'
import {getFileApi} from '../api/fileUploader'
import { exec } from 'child_process';

const Boards = () => {
  const setBoards = useGlobalBoardsStore((state) => state.setBoards)
  const setCurrentBoard = useGlobalBoardsStore((state) => state.setCurrentBoard)
  const currentFileUrl = useGlobalFileHandlerStore((state)=>state.currentFileUrl)
  const setCurrentFileUrl = useGlobalFileHandlerStore((state)=>state.setCurrentFileUrl)
  const currentFile = useGlobalFileHandlerStore((state)=>state.currentFile)

  const [currIndex, setCurrentIndex] = useState(-1)
  const [title, setTitle] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const isFileUploaderOpen = useGlobalFileHandlerStore((state)=>state.isFileUploaderOpen)
  const setIsFileUploaderOpen = useGlobalFileHandlerStore((state)=>state.setIsFileUploaderOpen)
  const queryClient = useQueryClient();

  const { data: boards = [], isLoading, error } = useQuery({
    queryKey: ['boards'],
    queryFn: fetchBoardsApi,
    refetchOnWindowFocus: false,
    staleTime: 10000,
  });

  const [objectUrls, setObjectUrls] = useState<string[]>([]);

  useEffect(() => {
    const loadBlobs = async () => {
      const blobUrls = await Promise.all(
        boards.map(async (board) => {
          try {
            const file = await getFileApi(board.theme)
            return URL.createObjectURL(file);
          } catch (e) {
            return 'https://wallpapers.com/images/featured-full/themes-fsse3r2bqsprys77.jpg';
          }
        })
      );
      setObjectUrls(blobUrls);
    };

    if (boards.length > 0) loadBlobs();
  }, [boards]);

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
    setCurrentFileUrl(objectUrls[index])
  }
  
  const handleThemeEditClick = () => {
    setIsFileUploaderOpen(true)
  }

  const handleSaveOnEdit = () => {
    const newBoards = [...boards]
    const currBoard = newBoards[currIndex]
    if (currBoard.title) {
      updateBoardMutation({ id: currBoard.id, title: title, theme: currentFile?.name || currBoard.theme });
      setTitle('');
      setIsEditModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['boards'] as const });
    }
  }
  
  const handleFileSaveOnEdit = () => {
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
                src={objectUrls[index]}
                alt="Background"
                className="w-full h-28 object-cover"
              />
              {/* Text Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-center">
                <h2 className="text-white font-semibold">{board.title}</h2>
              </div>
              </Link>
              <button className="bg-white top-0 right-0 absolute bg-opacity-80 flex items-start justify-end" onClick={(e) => handleEditClick(e, index)}>
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
        <div className="bg-red w-full h-full flex flex-row relative">
        <img
            src={currentFileUrl}
            alt="Background"
            className="object-cover rounded"
        />
        <button className="bg-white absolute bg-opacity-80 top-0 right-0" onClick={(e) => handleThemeEditClick()}>
          <FiEdit className=""/>
          <span className="sr-only">Edit</span> 
        </button>
        </div>
        <button
          onClick={() => handleSaveOnEdit()}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save Board
        </button>
      </Modal>
      <Modal isOpen={isFileUploaderOpen} onClose={() => setIsFileUploaderOpen(false)}>
        <FileUploader/>
        <button
          onClick={() => handleFileSaveOnEdit()}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save Board
        </button>
      </Modal>

    </div>
  );
};

export default Boards;
