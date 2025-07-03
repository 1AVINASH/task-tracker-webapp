#! /bin/bash

cd infra
docker compose down
cd ..
cd backend
lsof -i :8000 | tail -n +2 | awk '{print $2}' | xargs -r kill -9 2>/dev/null
cd ..
cd frontend
lsof -i :3000 | tail -n +2 | awk '{print $2}' | xargs -r kill -9 2>/dev/null
cd ..