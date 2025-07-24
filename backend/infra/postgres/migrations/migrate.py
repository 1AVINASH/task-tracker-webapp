import os
import databases
import glob
import sqlparse

from utility.logger import app_logger

class PostgresMigrator:
    UPGRADE_DIR = "infra/postgres/migrations/upgrade"

    def __init__(self, db: databases.Database):
        if not db:
            raise Exception
        self.db = db

    async def get_current_version(self) -> int:
        # Create versioning table if not exists
        await self.db.execute("""
            CREATE TABLE IF NOT EXISTS schema_version (
                version bigint PRIMARY KEY
            );
        """)
        version = await self.db.fetch_val("SELECT MAX(version) FROM schema_version")
        return version or 0

    async def apply_migrations(self):
        app_logger.info(f"Applying migrations now")
        current_version = await self.get_current_version()

        # Read all migration files from the folder and sort
        migration_files = sorted(
            glob.glob(os.path.join(self.UPGRADE_DIR, "*.sql"))
        )
        app_logger.info(f"CWD: {os.getcwd()}")
        app_logger.info(f"Migration Files: {migration_files}")
        for file_path in migration_files:
            # Extract the version number from filename (00001.sql -> 1)
            filename = os.path.basename(file_path)
            version = int(filename.split(".")[0])
            app_logger.info(f"Filename: {filename}, version: {version}")

            if version > current_version:
                app_logger.info(f"Applying migration {filename}")
                with open(file_path, "r") as f:
                    sql = f.read()
                    statements = sqlparse.split(sql)

                    print(f"\n🔧 Applying migration file: {file_path}")
                    for stmt in statements:
                        stmt = stmt.strip()
                        if stmt:
                            print(f"📄 Executing: {stmt[:80]}...")  # Preview the statement
                            await self.db.execute(stmt)

                # Update the schema version
                await self.db.execute("INSERT INTO schema_version (version) VALUES (:v)", {"v": version})