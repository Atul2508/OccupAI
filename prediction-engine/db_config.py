from sqlalchemy import create_engine
from sqlalchemy.engine import URL

def get_connection():
    engine = create_engine(URL.create(
        drivername="postgresql+psycopg2",
        username="postgres",
        password="Atul@2001",
        host="localhost",
        port=5432,
        database="occupai_db"
    ))
    return engine