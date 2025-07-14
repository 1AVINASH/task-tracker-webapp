// src/features/home/pages/Home.tsx
import React, { useState, useRef, useEffect } from 'react'
import { QueryFunctionContext } from '@tanstack/react-query';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useGlobalTaskStore, { Task } from '../../../store/tasks'
import useGlobalBoardsStore, { Board } from '../../../store/boards'
import shallow from 'zustand/shallow'
import Modal from '../../../components/Modals/Modal'
import { fetchTasksApi, updateTaskApi, deleteTaskApi, moveTaskUpApi, moveTaskDownApi, deleteAllTaskApi, FetchTasksReq, fetchDeletedTasksApi, FetchTasksByStatusApi } from '../api/tasks'
import { formatSecondsToHHMMSS } from '../../../utils/DateTimeUtils'
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown
import remarkGfm from 'remark-gfm';

export const viewToValueStatusMap = new Map([
  ["COMPLETED", 'Completed'],
  ["IN_PROGRESS", 'In Progress'],
  ["DELETED", 'Deleted'],
])

const Tasks = () => {
  const { boardId: boardIdParam } = useParams();
  const boardId = boardIdParam ? parseInt(boardIdParam, 10) : undefined;
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const isDeleteAllModalOpen = useGlobalTaskStore((state) => state.isDeleteAllModalOpen)
  const setIsDeleteAllModalOpen = useGlobalTaskStore((state) => state.setIsDeleteAllModalOpen)
  const isViewingDeleted = useGlobalTaskStore((state) => state.isViewingDeleted)
  const setIsViewingDeleted = useGlobalTaskStore((state) => state.setIsViewingDeleted)
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [currIndex, setIndex] = useState(-1);
  const timers = useRef<{ [id: number]: NodeJS.Timeout }>({});
  const queryClient = useQueryClient();
  const queryParams: FetchTasksReq = {
      boardId: boardId!, // Assuming `enabled` handles undef/NaN check
      isViewingDeleted: isViewingDeleted!, // Assuming `enabled` handles undef/NaN check
  };
  const { mutate: updateTaskMutation } = useMutation({ 
    mutationFn: updateTaskApi, 
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', queryParams] as const });
    },
    }
  );
  
  const { mutate: moveTaskUpMutation } = useMutation({ 
    mutationFn: moveTaskUpApi, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', queryParams] as const });
    },
  });
  
  const { mutate: moveTaskDownMutation } = useMutation({ 
    mutationFn: moveTaskDownApi, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', queryParams] as const });
    },
  });
  
  const { mutate: deleteTaskMutation } = useMutation({ 
    mutationFn: deleteTaskApi, 
    onSuccess: (deletedTaskId) => {
      queryClient.setQueryData<Task[]>(['tasks', queryParams], (old) => old ? old.filter((task) => task.id !== deletedTaskId) : []);
    },
  });
  
  const { mutate: deleteAllTaskMutation } = useMutation({ 
    mutationFn: deleteAllTaskApi, 
    onSuccess: () => {
      queryClient.setQueryData<Task[]>(['tasks', queryParams], []);
    },
  });

  const { data: tasks = [], isLoading, error } = useQuery<Task[], Error, Task[], ['tasks', FetchTasksReq]>({
    queryKey: ['tasks', queryParams],
    queryFn: (queryParams.isViewingDeleted ? fetchDeletedTasksApi : fetchTasksApi),
    refetchOnWindowFocus: false,
    staleTime: 10000,
    enabled: typeof boardId === 'number' && !isNaN(boardId),
  });

  const tasksRef = useRef<Task[]>(tasks);

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {(error as Error).message}</p>;

  const startTimer = (id: number) => {
    const currentTasksDataInCache = queryClient.getQueryData<Task[]>(['tasks', queryParams]);
    const currTask = currentTasksDataInCache!.find(task => task.id === id);
    if (!currTask) {
      return
    }
    updateTaskMutation({...currTask, running: true});
    queryClient.setQueryData<Task[]>(['tasks', queryParams], prevTasks => {
      if (!prevTasks) return []; // Handle case where prevTasks might be undefined

      // Return a new array with the updated task
      return prevTasks.map(task =>
        task.id === id ? {...task, running: true} : task
      );
    });


    timers.current[id] = setInterval(() => {
      const currentTasksDataInCache = queryClient.getQueryData<Task[]>(['tasks', queryParams]);
      const currTask = currentTasksDataInCache!.find(task => task.id === id);
      if (currTask && currTask.running) {
        const updatedTask = {
          ...currTask,
          seconds: currTask.seconds + 1,
        };
        queryClient.setQueryData<Task[]>(['tasks', queryParams], prevTasks => {
          if (!prevTasks) return []; // Handle case where prevTasks might be undefined

          // Return a new array with the updated task
          return prevTasks.map(task =>
            task.id === id ? updatedTask : task
          );
        });

        // Console logs here will reflect the state *before* React processes the update,
        // because state updates are asynchronous and batched.
        console.log(`Update scheduled for task ID: ${id}. New tasks are`);
        console.log(currentTasksDataInCache);
        console.log(currentTasksDataInCache);
      }
    }, 1000);
  }

  const stopTimer = (id: number) => {
    const currTask = tasks.find(task => task.id === id);
    if (!currTask) {
      return
    }
    updateTaskMutation({...currTask, running: false});
    clearInterval(timers.current[id]);
  };

  const handleEditTask = (index: number) => {
    const newTasks = [...tasks]
    const currTask = newTasks[index]
    if (currTask.title && currTask.body) {
      updateTaskMutation({ id: currTask.id, board_id: boardId!, title: title, body: body, running: currTask.running, seconds: currTask.seconds, priority: currTask.priority, status: currTask.status });
      setTitle('');
      setBody('');
      setIsModalOpen(false);
    }
  };
  
  const handleTaskStatusChange = (index: number, newStatus: string) => {
    const newTasks = [...tasks]
    const currTask = newTasks[index]
    if (currTask.title && currTask.body) {
      updateTaskMutation({ id: currTask.id, board_id: currTask.board_id!, title: currTask.title, body: currTask.body, running: currTask.running, seconds: currTask.seconds, priority: currTask.priority, status: newStatus });
      setTitle('');
      setBody('');
      if (isModalOpen) {
        setIsModalOpen(false);
      }
    }
  };
  
  const handleMoveUpTask = (index: number) => {
    if (index==0) {
      return
    }
    console.log(`Handling move up task for index ${index}`)
    const newTasks = [...tasks]
    const currTask = newTasks[index]
    const prevTask = newTasks[index-1]
    moveTaskUpMutation( { board_id: boardId!, move_up_task: {...currTask, priority: prevTask.priority}, move_down_task: {...prevTask, priority: currTask.priority}});
  };
  
  const handleMoveDownTask = (index: number) => {
    if (index==tasks.length-1) {
      return
    }
    const newTasks = [...tasks]
    const currTask = newTasks[index]
    const nextTask = newTasks[index+1]
    moveTaskDownMutation({board_id: boardId!, move_down_task: {...currTask, priority: nextTask.priority}, move_up_task: {...nextTask, priority: currTask.priority}});
  };
  
  const handleDeleteTask = (index: number) => {
    const newTasks = [...tasks]
    const currTask = newTasks[index]
    if (currTask.title && currTask.body) {
      deleteTaskMutation({boardId: boardId!, taskId: currTask.id});
      setTitle('');
      setBody('');
      setIsDeleteModalOpen(false);
    }
  };

  const handleDeleteAllTask = () => {
    deleteAllTaskMutation({ boardId: boardId!} );
    setIsDeleteAllModalOpen(false);
  };

  const editTask = (index: number) => {
    setIndex(index);
    setIsModalOpen(true);
    setTitle(tasks[index].title)
    setBody(tasks[index].body)
  }
  
  const deleteTaskUI = (index: number) => {
    setIndex(index);
    setIsDeleteModalOpen(true);
  }

  const modalOnClose = () => {
    setIsModalOpen(false)
    setTitle('')
    setBody('')
  }
  
  const deleteModalOnClose = () => {
    setIsDeleteModalOpen(false)
    setIndex(-1)
  }
  
  const deleteAllModalOnClose = () => {
    setIsDeleteAllModalOpen(false)
  }

  const cleanedBody = (body: string) => {
    const bodyAfterCleanup = body ? body.replace(/\u00a0/g, ' ') : ''; 
    return bodyAfterCleanup
  }

  return (
    <div className="bg-[#424242] w-[1000px] px-4 pb-2">
      <ol>
        {tasks.map((task, index) => <li key={index}><span className="text">
          <div className="rounded mb-3 p-3 bg-[#202020] text-white">
            <div  className="ml-2">
            <h1 className="text-2xl font-semibold mb-2">p{index}: {task.title}</h1>
            <div className="flex">
            <p className="text-xs mb-2">Status: &nbsp;</p>
            <p className="underline text-xs mb-2"> {viewToValueStatusMap.get(task.status)}</p>
            </div>
            <div className="prose">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {cleanedBody(task.body)}
              </ReactMarkdown>
            </div>
          </div>
          {
            isViewingDeleted ? 
            (<button className="m-1 bg-[#910000] p-3 text-white rounded" onClick={() => handleTaskStatusChange(index, 'IN_PROGRESS')}> Restore </button>)
            :
            (
              <div>
                <button className="m-1 bg-[#424242] p-3 text-white rounded" onClick={() => editTask(index)}> Edit </button>
                <button className="m-1 bg-[#424242] p-3 text-white rounded" onClick={() => handleMoveUpTask(index)}> Move Up </button>
                <button className="m-1 bg-[#424242] p-3 text-white rounded"  onClick={() => handleMoveDownTask(index)}> Move Down </button>
                {
                  tasks[index].status==='COMPLETED' ? 
                    <button className="m-1 bg-[#424242] p-3 text-white rounded"  onClick={() => handleTaskStatusChange(index, 'IN_PROGRESS')}> Mark in progress </button> 
                    : 
                    <button className="m-1 bg-[#424242] p-3 text-white rounded"  onClick={() => handleTaskStatusChange(index, 'COMPLETED')}> Mark as completed </button>
                }
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
                <button className="m-1 bg-[#910000] p-3 text-white rounded" onClick={() => deleteTaskUI(index)}> Delete </button>
                <span className="bg-[#910000] p-3.5 pb-4 text-white rounded">Time Taken: {formatSecondsToHHMMSS(task.seconds)} </span>
              </div>
            )
          }
          </div>
          </span></li>)}
      </ol>
      <Modal isOpen={isModalOpen} onClose={() => modalOnClose()}>
        <div className="relative h-2/3">
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
          className="w-full h-full mb-4 border px-2 py-1 rounded"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button
          onClick={() => handleEditTask(currIndex)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save Task
        </button>
        </div>
      </Modal>
      <Modal isOpen={isDeleteModalOpen} onClose={() => deleteModalOnClose()}>
        <h2 className="text-lg font-bold mb-2">Are you sure you want to delete this task?</h2>
        <hr className="h-px mb-3 bg-gray-200 border-0 dark:bg-gray-700"></hr>
        <p className="text-2xl font-semibold mb-2">{tasks[currIndex]?.title}</p>
        <textarea disabled
          placeholder="Body"
          className="w-full mb-4 border px-2 py-1 rounded"
          value={tasks[currIndex]?.body}
          onChange={(e) => setBody(e.target.value)
          }
        />
        <div className="flex justify-evenly items-center mx-20">
        <button
          onClick={() => handleDeleteTask(currIndex)}
          className="bg-red-600 text-white px-4 py-2 rounded mx-5"
        >
          Yes
        </button>
        <button
          onClick={() => deleteModalOnClose()}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          No
        </button>
        </div>
      </Modal>
      <Modal isOpen={isDeleteAllModalOpen} onClose={() => deleteAllModalOnClose()}>
        <h2 className="text-lg font-bold mb-2">Are you sure you want to delete all the tasks?</h2>
        <div className="flex justify-evenly items-center mx-20">
        <button
          onClick={() => handleDeleteAllTask()}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Yes
        </button>
        <button
          onClick={() => deleteAllModalOnClose()}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          No
        </button>
        </div>
      </Modal>
    </div>
  );
};

export default Tasks;
