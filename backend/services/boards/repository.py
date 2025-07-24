from infra.postgres.postgres_setup import db

from services.boards.dtos import Input

class RepositoryBoards:
    @staticmethod
    async def get_all_boards():
        query = "SELECT * FROM boards order by created_at"
        data = await db.fetch_all(query)

        return [dict(row) for row in data]
    
    @staticmethod
    async def get_board(board_id):
        query = "SELECT * FROM boards where id=:id"
        values = {"id": board_id}
        data = await db.fetch_one(query, values=values)

        return dict(data)
    
    @staticmethod
    async def add_board(board: Input.CreateBoards):
        query = "INSERT INTO boards (title, theme) VALUES (:title, :theme) returning id"
        values = board.model_dump()
        new_board_id = await db.fetch_val(query=query, values=values)
        data = values
        data["id"] = new_board_id

        return data
    
    @staticmethod
    async def update_board(board: Input.UpdateBoards):
        query = "UPDATE boards set title=:title, theme=:theme where id=:id"
        values = board.model_dump()
        print(f"Query and value for updating board {values} \n {query}")
        data = await db.execute(query=query, values=values)

        return data
    
    @staticmethod
    async def delete_board(board_id: int):
        query = "DELETE from boards where id=:id;"
        values = {"id": board_id}
        data = await db.execute(query=query, values=values)

        return data
    