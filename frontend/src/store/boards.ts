import { create } from 'zustand';

export type Board = {
  id: number
  title: string
  theme: string
  last_updated_at: string
}

type GlobalBoardsStore = {
  boards: Board[];
  setBoards: (boards: Board[]) => void;
  currentBoard: Board | undefined;
  setCurrentBoard: (board: Board) => void;
};

const useGlobalBoardsStore = create<GlobalBoardsStore>((set) => ({
  boards: [],
  setBoards: (boards: Board[]) => set(() => ({ boards })),
  currentBoard: undefined,
  setCurrentBoard: (currentBoard: Board) => set(() => ({ currentBoard }))
}));

export default useGlobalBoardsStore;