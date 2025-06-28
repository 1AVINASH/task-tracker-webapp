import { create } from 'zustand';

export type Task = {
  id: number
  title: string
  body: string
  seconds: number
  running: boolean
}

type GlobalTasksStore = {
  tasks: Task[];
  // setTasks: (updatedTasks: Task[]) => void;
  setTasks: (updater: (tasks: Task[]) => Task[]) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void ;
};

const useGlobalTaskStore = create<GlobalTasksStore>((set) => ({
  tasks: [
    {id: 1, title: "Eat Breakfast", body: "Have breakfast properly", seconds: 0, running: false}, 
    {id: 2, title: "Take a Shower", body: "Use shampoo twice a week", seconds: 0, running: false}, 
    {id: 3, title: "Exercise", body: "Go to gym or running", seconds: 0, running: false}
  ],
  isModalOpen: false,
  // setTasks: (updatedTasks: Task[]) => set((state) => ({tasks: updatedTasks})),
  setTasks: (updater) => set((state) => ({ tasks: updater(state.tasks) })),
  addTask: (task: Task) => set((state) => ({tasks: [...state.tasks, task]})),
  setIsModalOpen: (isModalOpen: boolean) => set((state) => ({isModalOpen: isModalOpen}))
}));

export default useGlobalTaskStore;