import { Board } from '../../../store/boards'
const BASE_URL = 'http://localhost:8000/api';

type BoardId = {
  id: number
}

export type UpdateBoardsReq = Omit<Board, 'last_updated_at'>

type FetchBoardsRes = {
    data: Board[]
    message: string
}

type CreateBoardsRes = {
    data: Board
    message: string
}

type UpdateBoardsRes = {
    data: Board
    message: string
}

type DeleteBoardRes = {
    data: BoardId
    message: string
}

// Fetch all boards
export const fetchBoardsApi = async (): Promise<Board[]> => {
  const res = await fetch(`${BASE_URL}/boards`);
  if (!res.ok) throw new Error("Failed to fetch boards");
  const json: FetchBoardsRes = await res.json();
  
  return json.data;
};


// Create a new board
export const createBoardApi = async (board: Omit<Board, 'id'>): Promise<Board> => {
  const res = await fetch(`${BASE_URL}/boards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(board),
  });
  if (!res.ok) throw new Error("Failed to create board");
  const json: CreateBoardsRes = await res.json();
  
  return json.data;
};


// Update a new board
export const updateBoardApi = async (board: UpdateBoardsReq): Promise<Board> => {
  const res = await fetch(`${BASE_URL}/boards/${board.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(board),
  });
  if (!res.ok) throw new Error("Failed to update board");
  const json: UpdateBoardsRes = await res.json();
  
  return json.data;
};

// Delete a board
export const deleteBoardApi = async (boardId: number): Promise<number> => {
  const res = await fetch(`${BASE_URL}/boards/${boardId}`, {
    method: "DELETE",
    // headers: { "Content-Type": "application/json" },
    // body: JSON.stringify(board),
  });
  if (!res.ok) throw new Error("Failed to delete board");
  const json: DeleteBoardRes = await res.json();
  
  return json.data.id;
};
