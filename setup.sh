cd infra
docker compose up -d
cd ..
cd backend
pipenv shell
lsof -i :8000 | tail -n +2 | awk '{print $2}' | xargs -r kill -9
nohup python3 app.py &
cd ..
cd frontend
lsof -i :3000 | tail -n +2 | awk '{print $2}' | xargs -r kill -9
nohup npm run start &
cd ..