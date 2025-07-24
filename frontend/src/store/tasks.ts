import { create } from 'zustand';

export const TaskStatus = {
  DELETED: 'DELETED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
}

export type Task = {
  id: number
  board_id: number
  title: string
  body: string
  priority: number
  seconds: number
  running: boolean
  status: string
}

type GlobalTasksStore = {
  tasks: Task[];
  taskStatus: string;
  setTaskStatus: (taskStatus: string) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void ;
  isDeleteAllModalOpen: boolean;
  setIsDeleteAllModalOpen: (isDeleteAllModalOpen: boolean) => void ;
  currentTitle: string;
  setCurrentTitle: (currentTitle: string) => void;
  currentBody: string;
  setCurrentBody: (currentBody: string) => void;
};

const useGlobalTaskStore = create<GlobalTasksStore>((set) => ({
  tasks: [],
  isModalOpen: false,
  isDeleteAllModalOpen: false,
  taskStatus: 'IN_PROGRESS',
  setTaskStatus: (taskStatus: string) => set(()=>({taskStatus})),
  addTask: (task: Task) => set((state) => ({tasks: [...state.tasks, task]})),
  setIsModalOpen: (isModalOpen: boolean) => set(() => ({ isModalOpen })),
  setIsDeleteAllModalOpen: (isDeleteAllModalOpen: boolean) => set(() => ({ isDeleteAllModalOpen })),
  currentTitle: '',
  setCurrentTitle: (currentTitle: string) => set(() => ({currentTitle})),
  currentBody: '',
  setCurrentBody: (currentBody: string) => set(() => ({currentBody})),
}));

export default useGlobalTaskStore;