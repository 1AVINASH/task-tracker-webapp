import argparse

from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

from constants.defaults import DEFAULT_HOST, DEFAULT_PORT
from utility.middlewares import LoggingMiddleware
from services.tasks.routes import tasks_router
from services.boards.routes import boards_router
from services.files_handler.routes import files_router
from infra.postgres.postgres_setup import db
from infra.postgres.migrations.migrate import PostgresMigrator

app = FastAPI(debug=True)

# Add Middlewares
app.add_middleware(LoggingMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or "*" in dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add routes
app.include_router(boards_router, prefix="/api")
app.include_router(tasks_router, prefix="/api/boards/{board_id}")
app.include_router(files_router, prefix="/api")

@app.on_event("startup")
async def startup():
    await db.connect()
    migrator =  PostgresMigrator(db)
    await migrator.apply_migrations()

@app.on_event("shutdown")
async def shutdown():
    await db.disconnect()

if __name__=="__main__":
    parser = argparse.ArgumentParser(description="Start the fast api server")
    parser.add_argument("--host", default=DEFAULT_HOST, help=f"Host to bind (default: {DEFAULT_HOST})")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT, help=f"Port to bind (default: {DEFAULT_PORT})")
    args = parser.parse_args()
    uvicorn.run('app:app', host=args.host, port=args.port, log_level="info", reload=True)