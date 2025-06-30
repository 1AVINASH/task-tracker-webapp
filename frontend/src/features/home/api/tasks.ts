import { Task } from '../../../store/tasks'
const BASE_URL = 'http://localhost:8000';

type TaskId = {
  id: number
}

export type moveTaskUpReq = {
    move_up_task: Task
    move_down_task: Task
}

export type moveTaskDownReq = {
    move_up_task: Task
    move_down_task: Task
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

// Fetch all tasks
export const fetchTasksApi = async (): Promise<Task[]> => {
  const res = await fetch(`${BASE_URL}/tasks`);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  const json: FetchTasksRes = await res.json();
  
  return json.data;
};


// Create a new task
export const createTaskApi = async (task: Omit<Task, 'id'>): Promise<Task> => {
  const res = await fetch(`${BASE_URL}/tasks`, {
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
  const res = await fetch(`${BASE_URL}/tasks/${task.id}`, {
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
  const res = await fetch(`${BASE_URL}/tasks/move-up`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tasks),
  });
  if (!res.ok) throw new Error("Failed to move task up");
  const json: MoveTaskUpRes = await res.json();
};

// Move a task down
export const moveTaskDownApi = async (tasks: moveTaskDownReq): Promise<void> => {
  const res = await fetch(`${BASE_URL}/tasks/move-down`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tasks),
  });
  if (!res.ok) throw new Error("Failed to move task down");
  const json: MoveTaskDownRes = await res.json();
};

// Delete a task
export const deleteTaskApi = async (taskId: number): Promise<number> => {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: "DELETE",
    // headers: { "Content-Type": "application/json" },
    // body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to delete task");
  const json: DeleteTaskRes = await res.json();
  
  return json.data.id;
};

// Delete all tasks
export const deleteAllTaskApi = async (): Promise<void> => {
  const res = await fetch(`${BASE_URL}/tasks/all`, {
    method: "DELETE",
    // headers: { "Content-Type": "application/json" },
    // body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to delete task");
  const json: DeleteTaskRes = await res.json();
};
