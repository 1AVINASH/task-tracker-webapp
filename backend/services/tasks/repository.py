from infra.postgres_setup import db
from services.tasks.dtos import Input

class RepositoryTasks:
    @staticmethod
    async def get_all_tasks(board_id: int):
        query = "SELECT * FROM tasks where board_id=:board_id order by priority"
        values = {"board_id": board_id}
        data = await db.fetch_all(query, values=values)

        return [dict(row) for row in data]
    
    @staticmethod
    async def get_task(task_id):
        query = "SELECT * FROM tasks where id=:id"
        values = {"id": task_id}
        data = await db.fetch_one(query, values=values)

        return dict(data)
    
    @staticmethod
    async def add_task(task: Input.CreateTasks):
        query = "INSERT INTO tasks (board_id, title, body, priority, running, seconds) VALUES (:board_id, :title, :body, :priority, :running, :seconds) returning id"
        values = task.model_dump()
        new_task_id = await db.fetch_val(query=query, values=values)
        data = values
        data["id"] = new_task_id

        return data
    
    @staticmethod
    async def update_task(task: Input.UpdateTasks):
        query = "UPDATE tasks set title=:title, body=:body, priority=:priority, running=:running, seconds=:seconds where id=:id;"
        values = task.model_dump()
        print(f"Query and values for updating task {query}\n{values}")
        data = await db.execute(query=query, values=values)

        return data
    
    @staticmethod
    async def delete_task(task_id: int):
        query = "DELETE from tasks where id=:id;"
        values = {"id": task_id}
        data = await db.execute(query=query, values=values)

        return data
    
    @staticmethod
    async def delete_all_tasks(board_id):
        query = "DELETE from tasks where board_id=:board_id;"
        values = {"board_id": board_id}
        data = await db.execute(query=query, values=values)

        return data
    
    @staticmethod
    async def move_task_up(tasks: Input.MoveUpTask):
        query = "UPDATE tasks SET priority = :priority WHERE id = :id;"
        if tasks.move_up_task.priority==tasks.move_down_task.priority:
            tasks.move_up_task.priority-=1
            tasks.move_down_task.priority+=1
        values = [
            {"id": tasks.move_up_task.id, "priority": tasks.move_up_task.priority},
            {"id": tasks.move_down_task.id, "priority": tasks.move_down_task.priority},
        ]
        data = await db.execute_many(
            query=query,
            values=values
        )

        return data
    
    @staticmethod
    async def move_task_down(tasks: Input.MoveDownTask):
        query = "UPDATE tasks SET priority = :priority WHERE id = :id;"
        if tasks.move_up_task.priority==tasks.move_down_task.priority:
            tasks.move_up_task.priority-=1
            tasks.move_down_task.priority+=1
        values = [
            {"id": tasks.move_down_task.id, "priority": tasks.move_down_task.priority},
            {"id": tasks.move_up_task.id, "priority": tasks.move_up_task.priority},
        ]
        data = await db.execute_many(
            query=query,
            values=values
        )

        return data