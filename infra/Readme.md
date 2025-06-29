## Commands to run this
* To start the infra, simply run `docker compose up -d`
* To exec into the hosted postgres, use `docker exec -it fastapi_postgres psql -U admin -d fastapi_db`
* To see all databases, use `\l`
* To see all tables, use `\d`