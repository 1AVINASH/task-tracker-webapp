import { create } from 'zustand';

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
  isViewingDeleted: boolean;
  setIsViewingDeleted: (isViewingDeleted: boolean) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void ;
  isDeleteAllModalOpen: boolean;
  setIsDeleteAllModalOpen: (isDeleteAllModalOpen: boolean) => void ;
};

const useGlobalTaskStore = create<GlobalTasksStore>((set) => ({
  tasks: [],
  isModalOpen: false,
  isDeleteAllModalOpen: false,
  isViewingDeleted: false,
  setIsViewingDeleted: (isViewingDeleted: boolean) => set(() => ({isViewingDeleted})),
  addTask: (task: Task) => set((state) => ({tasks: [...state.tasks, task]})),
  setIsModalOpen: (isModalOpen: boolean) => set(() => ({ isModalOpen })),
  setIsDeleteAllModalOpen: (isDeleteAllModalOpen: boolean) => set(() => ({ isDeleteAllModalOpen }))
}));

export default useGlobalTaskStore;