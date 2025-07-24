import React, {useState, useEffect} from 'react'
import Modal from '../../../components/Modals/Modal'
import useGlobalTaskStore, { Task } from '../../../store/tasks'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTasksApi, updateTaskApi, deleteTaskApi, moveTaskUpApi, moveTaskDownApi, deleteAllTaskApi, FetchTasksReq, fetchDeletedTasksApi } from '../api/tasks'

export type TaskModalProps = {
    tasks: Task[],
    currentTaskIndex: number,
    currentStatus: string,
}

const TaskModal = ({ tasks, currentTaskIndex, currentStatus }: TaskModalProps) => {
    const title = useGlobalTaskStore((state) => state.currentTitle)
    const setTitle = useGlobalTaskStore((state) => state.setCurrentTitle)
    const body = useGlobalTaskStore((state) => state.currentBody)
    const setBody = useGlobalTaskStore((state) => state.setCurrentBody)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const queryClient = useQueryClient();
    const [boardId, setBoardId] = useState(0)

    const queryParams: FetchTasksReq = {
        boardId: boardId!, // Assuming `enabled` handles undef/NaN check
        taskStatus: currentStatus!, // Assuming `enabled` handles undef/NaN check
    };

    const { mutate: updateTaskMutation } = useMutation({ 
        mutationFn: updateTaskApi, 
        onSuccess: (updatedTask) => {
        queryClient.invalidateQueries({ queryKey: ['tasks', queryParams] as const });
        },
        }
    );

    const modalOnClose = () => {
        setIsModalOpen(false)
        setTitle('')
        setBody('')
    }

    const handleEditTask = () => {
        if (!isModalOpen) {
            return
        }
        const newTasks = [...tasks]
        const currTask = newTasks[currentTaskIndex]
        if (currTask.title && currTask.body) {
        updateTaskMutation({ id: currTask.id, board_id: currTask.board_id, title: title, body: body, running: currTask.running, seconds: currTask.seconds, priority: currTask.priority, status: currTask.status });
        setTitle('');
        setBody('');
        setIsModalOpen(false);
        }
    };

    return (
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
          onClick={() => handleEditTask()}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save Task
        </button>
        </div>
      </Modal>
    )
}

export default TaskModal;