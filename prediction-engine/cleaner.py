import pandas as pd
from sqlalchemy import create_engine, text
from db_config import get_connection

DEVICE_TO_PERSON_RATIO = 0.6

def clean_and_aggregate():
    engine = get_connection()

    try:
        # Step 1 — Pull raw WiFi logs
        query = """
            SELECT 
                w.location_id,
                w.device_count,
                w.logged_at,
                150 as capacity
            FROM wifi_logs w
            WHERE w.logged_at >= NOW() - INTERVAL '24 hours'
            ORDER BY w.logged_at ASC
        """
        df = pd.read_sql(query, engine)

        if df.empty:
            print("No WiFi data found in last 24 hours")
            return

        # Step 2 — Estimate people from devices
        df['estimated_people'] = (
            df['device_count'] * DEVICE_TO_PERSON_RATIO
        ).round().astype(int)

        # Step 3 — Calculate occupancy percentage
        df['occupancy_pct'] = (
            df['estimated_people'] / df['capacity']
        ).clip(0, 1)

        # Step 4 — Add time features
        df['hour_of_day'] = pd.to_datetime(df['logged_at']).dt.hour
        df['day_of_week'] = pd.to_datetime(df['logged_at']).dt.dayofweek

        # Step 5 — Write to occupancy_aggregated
        with engine.connect() as conn:
            for _, row in df.iterrows():
                conn.execute(text("""
                    INSERT INTO occupancy_aggregated 
                    (location_id, estimated_people, occupancy_pct,
                     hour_of_day, day_of_week, aggregated_at)
                    VALUES (:location_id, :estimated_people, :occupancy_pct,
                            :hour_of_day, :day_of_week, :aggregated_at)
                """), {
                    "location_id": int(row['location_id']),
                    "estimated_people": int(row['estimated_people']),
                    "occupancy_pct": float(row['occupancy_pct']),
                    "hour_of_day": int(row['hour_of_day']),
                    "day_of_week": int(row['day_of_week']),
                    "aggregated_at": row['logged_at']
                })
            conn.commit()

        print(f"Aggregated {len(df)} records successfully")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    clean_and_aggregate()