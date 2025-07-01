from fastapi import APIRouter

from utility.logger import app_logger
from dtos.output import DefaultOutput

from services.boards.dtos import Input
from services.boards.repository import RepositoryBoards

boards_router = APIRouter(prefix="/boards", tags=["tasks"])

@boards_router.get("", response_model=DefaultOutput)
async def get():
    data = await RepositoryBoards.get_all_boards()
    return DefaultOutput(message=f"Boards fetched successfully", data=data)

@boards_router.get("/{board_id}", response_model=DefaultOutput)
async def get(board_id: int):
    data = await RepositoryBoards.get_board(board_id=board_id)
    return DefaultOutput(message=f"Board with id fetched successfully", data=data)

@boards_router.post("", response_model=DefaultOutput)
async def create(payload: Input.CreateBoards):
    app_logger.info(f"Received payload for creating board: {payload}")
    data = await RepositoryBoards.add_board(payload)
    return DefaultOutput(message=f"Board Created successfully", data=data)

@boards_router.put("/{board_id}", response_model=DefaultOutput)
async def update(payload: Input.UpdateBoards):
    app_logger.info(f"Received payload for updating board: {payload}")
    _ = await RepositoryBoards.update_board(payload)
    return DefaultOutput(message=f"Board Updated successfully", data=payload)

@boards_router.delete("/{board_id}", response_model=DefaultOutput)
async def delete(board_id: int):
    app_logger.info(f"Deleting board for id {board_id}")
    data = await RepositoryBoards.delete_board(board_id=board_id)
    return DefaultOutput(message=f"Board Deleted successfully", data={"id": board_id})
