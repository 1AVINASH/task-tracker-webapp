import argparse

from fastapi import FastAPI
import uvicorn

from constants.defaults import DEFAULT_HOST, DEFAULT_PORT
from utility.middlewares import LoggingMiddleware
from template_feature.routes import template_router

app = FastAPI(debug=True)

# Add Middlewares
app.add_middleware(LoggingMiddleware)

# Add routes
app.include_router(template_router)

if __name__=="__main__":
    parser = argparse.ArgumentParser(description="Start the fast api server")
    parser.add_argument("--host", default=DEFAULT_HOST, help=f"Host to bind (default: {DEFAULT_HOST})")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT, help=f"Port to bind (default: {DEFAULT_PORT})")
    args = parser.parse_args()
    uvicorn.run('app:app', host=args.host, port=args.port, log_level="info", reload=True)