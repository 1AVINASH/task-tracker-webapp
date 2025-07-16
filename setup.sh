#! /bin/bash

cd infra
docker compose up -d
cd ..
cd backend
lsof -i :8001 | tail -n +2 | awk '{print $2}' | xargs -r kill -9
pipenv run nohup python3 app.py --port 8001 &
cd ..
cd frontend
lsof -i :3000 | tail -n +2 | awk '{print $2}' | xargs -r kill -9
nohup npm run start &

