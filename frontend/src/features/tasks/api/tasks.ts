import { QueryFunctionContext } from '@tanstack/react-query';
import { Task } from '../../../store/tasks'

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

type TaskId = {
  id: number
}

type TaskWithoutBoardId = Omit<Task, 'board_id'>

export type moveTaskUpReq = {
    board_id: number
    move_up_task: TaskWithoutBoardId
    move_down_task: TaskWithoutBoardId
}

export type moveTaskDownReq = {
    board_id: number
    move_up_task: TaskWithoutBoardId
    move_down_task: TaskWithoutBoardId
}


export type FetchTasksReq = {
    boardId: number
    taskStatus: string
}

type DeleteTaskReq = {
    boardId: number
    taskId: number
}

type DeleteAllTaskReq = {
    boardId: number
}

type FetchTasksRes = {
    data: Task[]
    message: string
}

type CreateTasksRes = {
    data: Task
    message: string
}

type UpdateTasksRes = {
    data: Task
    message: string
}

type MoveTaskUpRes = {
    message: string
}

type MoveTaskDownRes = {
    message: string
}

type DeleteTaskRes = {
    data: TaskId
    message: string
}

export const fetchDeletedTasksApi = async (context: QueryFunctionContext<['tasks', FetchTasksReq]>): Promise<Task[]> => {
  const [_key, task] = context.queryKey;

  if (typeof task.boardId !== 'number' || isNaN(task.boardId)) {
    throw new Error("Board ID is required for fetching tasks.");
  }

  const res = await fetch(`${BASE_URL}/boards/${task.boardId}/tasks/by-status/DELETED`);
  if (!res.ok) throw new Error("Failed to fetch deleted tasks");
  const json: FetchTasksRes = await res.json();
  
  return json.data;
};

export const fetchCompletedTasksApi = async (context: QueryFunctionContext<['tasks', FetchTasksReq]>): Promise<Task[]> => {
  const [_key, task] = context.queryKey;

  if (typeof task.boardId !== 'number' || isNaN(task.boardId)) {
    throw new Error("Board ID is required for fetching tasks.");
  }

  const res = await fetch(`${BASE_URL}/boards/${task.boardId}/tasks/by-status/COMPLETED`);
  if (!res.ok) throw new Error("Failed to fetch deleted tasks");
  const json: FetchTasksRes = await res.json();
  
  return json.data;
};


// Fetch all tasks
export const fetchTasksApi = async (context: QueryFunctionContext<['tasks', FetchTasksReq]>): Promise<Task[]> => {
  const [_key, task] = context.queryKey;

  if (typeof task.boardId !== 'number' || isNaN(task.boardId)) {
    throw new Error("Board ID is required for fetching tasks.");
  }

  const res = await fetch(`${BASE_URL}/boards/${task.boardId}/tasks/by-status/IN_PROGRESS`);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  const json: FetchTasksRes = await res.json();
  
  return json.data;
};

// Create a new task
export const createTaskApi = async (task: Omit<Task, 'id'>): Promise<Task> => {
  const res = await fetch(`${BASE_URL}/boards/${task.board_id}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to create task");
  const json: CreateTasksRes = await res.json();
  
  return json.data;
};


// Update a new task
export const updateTaskApi = async (task: Task): Promise<Task> => {
  const res = await fetch(`${BASE_URL}/boards/${task.board_id}/tasks/${task.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to update task");
  const json: UpdateTasksRes = await res.json();
  
  return json.data;
};

// Move a task up
export const moveTaskUpApi = async (tasks: moveTaskUpReq): Promise<void> => {
  const res = await fetch(`${BASE_URL}/boards/${tasks.board_id}/tasks/move-up`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tasks),
  });
  if (!res.ok) throw new Error("Failed to move task up");
  const json: MoveTaskUpRes = await res.json();
};

// Move a task down
export const moveTaskDownApi = async (tasks: moveTaskDownReq): Promise<void> => {
  const res = await fetch(`${BASE_URL}/boards/${tasks.board_id}/tasks/move-down`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tasks),
  });
  if (!res.ok) throw new Error("Failed to move task down");
  const json: MoveTaskDownRes = await res.json();
};

// Delete a task
export const deleteTaskApi = async (task: DeleteTaskReq): Promise<number> => {
  const res = await fetch(`${BASE_URL}/boards/${task.boardId}/tasks/${task.taskId}`, {
    method: "DELETE",
    // headers: { "Content-Type": "application/json" },
    // body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to delete task");
  const json: DeleteTaskRes = await res.json();
  
  return json.data.id;
};

// Delete all tasks
export const deleteAllTaskApi = async (task: DeleteAllTaskReq): Promise<void> => {
  const res = await fetch(`${BASE_URL}/boards/${task.boardId}/tasks/all`, {
    method: "DELETE",
    // headers: { "Content-Type": "application/json" },
    // body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to delete task");
  const json: DeleteTaskRes = await res.json();
};
