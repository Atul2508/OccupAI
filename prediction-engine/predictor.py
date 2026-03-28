import pandas as pd
from sqlalchemy import text
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta
import numpy as np
from db_config import get_connection

def train_model(engine, location_id):
    query = text("""
        SELECT 
            hour_of_day,
            day_of_week,
            occupancy_pct
        FROM occupancy_aggregated
        WHERE location_id = :location_id
        ORDER BY aggregated_at ASC
    """)
    df = pd.read_sql(query, engine, params={"location_id": location_id})

    if len(df) < 10:
        print(f"Not enough data for location {location_id}")
        return None

    X = df[['hour_of_day', 'day_of_week']]
    y = df['occupancy_pct']

    model = LinearRegression()
    model.fit(X, y)

    print(f"Model trained for location {location_id} on {len(df)} records")
    return model

def save_predictions(engine, location_id, model):
    now = datetime.now()

    with engine.connect() as conn:
        # Clear old predictions for this location
        conn.execute(text("""
            DELETE FROM predictions 
            WHERE location_id = :location_id
            AND for_time > NOW()
        """), {"location_id": location_id})

        # Generate predictions for next 24 hours
        for hour_offset in range(24):
            future_time = now + timedelta(hours=hour_offset)

            input_data = pd.DataFrame([{
                'hour_of_day': future_time.hour,
                'day_of_week': future_time.weekday()
            }])

            predicted_pct = float(
                np.clip(model.predict(input_data)[0], 0, 1)
            )

            conn.execute(text("""
                INSERT INTO predictions
                (location_id, predicted_pct, for_time, model_used)
                VALUES (:location_id, :predicted_pct, :for_time, :model_used)
            """), {
                "location_id": location_id,
                "predicted_pct": predicted_pct,
                "for_time": future_time,
                "model_used": "linear_regression"
            })

        conn.commit()
        print(f"Saved 24hr predictions for location {location_id}")

def run_prediction_pipeline():
    engine = get_connection()
    locations = [1, 2]  # Your location IDs

    for loc_id in locations:
        model = train_model(engine, loc_id)
        if model:
            save_predictions(engine, loc_id, model)

    print("Prediction pipeline complete!")

if __name__ == "__main__":
    run_prediction_pipeline()