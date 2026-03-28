from db_config import get_connection

try:
    conn = get_connection()
    print("Connected to occupai_db successfully!")
    conn.close()
except Exception as e:
    print(f"Connection failed: {e}")