import { create } from 'zustand';

export type Task = {
  id: number
  title: string
  body: string
  priority: number
  seconds: number
  running: boolean
}

type GlobalTasksStore = {
  tasks: Task[];
  // setTasks: (updatedTasks: Task[]) => void;
  setTasks: (updater: (tasks: Task[]) => Task[]) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void ;
  isDeleteAllModalOpen: boolean;
  setIsDeleteAllModalOpen: (isDeleteAllModalOpen: boolean) => void ;
};

const useGlobalTaskStore = create<GlobalTasksStore>((set) => ({
  tasks: [],
  isModalOpen: false,
  isDeleteAllModalOpen: false,
  // setTasks: (updatedTasks: Task[]) => set((state) => ({tasks: updatedTasks})),
  setTasks: (updater) => set((state) => ({ tasks: updater(state.tasks) })),
  addTask: (task: Task) => set((state) => ({tasks: [...state.tasks, task]})),
  setIsModalOpen: (isModalOpen: boolean) => set(() => ({ isModalOpen })),
  setIsDeleteAllModalOpen: (isDeleteAllModalOpen: boolean) => set(() => ({ isDeleteAllModalOpen }))
}));

export default useGlobalTaskStore;