import math
from datetime import datetime, timezone, timedelta
from dateutil.parser import parse

from infra.postgres_setup import db
from services.tasks.dtos import Input
from services.tasks.models import Task

class RepositoryTasks:
    @staticmethod
    async def get_all_tasks(board_id: int):
        query = "SELECT * FROM tasks where board_id=:board_id and status!='DELETED' order by priority"
        values = {"board_id": board_id}
        data = await db.fetch_all(query, values=values)
        data = [dict(row) for row in data]
        
        return data
    
    @staticmethod
    async def get_all_tasks_by_status(board_id: int, status: str):
        query = "SELECT * FROM tasks where board_id=:board_id and status=:status order by priority"
        values = {"board_id": board_id, "status": status}
        data = await db.fetch_all(query, values=values)
        
        data = [dict(row) for row in data]
        for idx, task in enumerate(data):
            if not task["running"]:
                continue
            task["seconds"] = task["seconds"] + (datetime.now(timezone.utc)-task["started_at"]).total_seconds()
            data["idx"] = task

        return data
    
    @staticmethod
    async def get_task(task_id):
        query = "SELECT * FROM tasks where id=:id"
        values = {"id": task_id}
        data = await db.fetch_one(query, values=values)

        return dict(data)
    
    @staticmethod
    async def add_task(task: Input.CreateTasks):
        query = "INSERT INTO tasks (board_id, title, body, priority, running, seconds, status) VALUES (:board_id, :title, :body, :priority, :running, :seconds, 'IN_PROGRESS') returning id"
        values = task.model_dump()
        new_task_id = await db.fetch_val(query=query, values=values)
        data = values
        data["id"] = new_task_id

        return data
    
    @staticmethod
    async def update_task(task: Input.UpdateTasks):
        previous_task = Task(**(await RepositoryTasks.get_task(task_id=task.id)))
        if previous_task.running and not task.running:
            task.started_at = None
            if previous_task.started_at:
                task.seconds = previous_task.seconds + (datetime.now(timezone.utc) - previous_task.started_at).total_seconds()
        elif not previous_task.running and task.running:
            task.started_at = datetime.now()
            task.seconds = previous_task.seconds
        else:
            task.seconds = previous_task.seconds
            task.running = previous_task.running
            task.started_at = previous_task.started_at
        
        query = "UPDATE tasks set title=:title, body=:body, priority=:priority, running=:running, seconds=:seconds, status=:status, started_at=:started_at where id=:id;"
        values = task.model_dump()
        print(f"Query and values for updating task {query}\n{values}")
        print(f"Previous task {previous_task}")
        data = await db.execute(query=query, values=values)

        return data
    
    @staticmethod
    async def delete_task(task_id: int):
        query = "UPDATE tasks set status='DELETED' where id=:id;"
        values = {"id": task_id}
        data = await db.execute(query=query, values=values)

        return data
    
    @staticmethod
    async def delete_all_tasks(board_id):
        query = "UPDATE tasks set status='DELETED' where board_id=:board_id;"
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