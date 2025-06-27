import { create } from 'zustand';

export type Task = {
  title: string
  body: string
}

type GlobalTasksStore = {
  tasks: Task[];
  setTasks: (updatedTasks: Task[]) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void ;
};

const useGlobalTaskStore = create<GlobalTasksStore>((set) => ({
  tasks: [
    {title: "Eat Breakfast", body: "Have breakfast properly"}, 
    {title: "Take a Shower", body: "Use shampoo twice a week"}, 
    {title: "Exercise", body: "Go to gym or running"}
  ],
  isModalOpen: false,
  setTasks: (updatedTasks: Task[]) => set((state) => ({tasks: updatedTasks})),
  addTask: (task: Task) => set((state) => ({tasks: [...state.tasks, task]})),
  setIsModalOpen: (isModalOpen: boolean) => set((state) => ({isModalOpen: isModalOpen}))
}));

export default useGlobalTaskStore;