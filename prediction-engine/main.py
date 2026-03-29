import schedule
import time
from cleaner import clean_and_aggregate
from predictor import run_prediction_pipeline

def run_pipeline():
    print("Running pipeline...")
    clean_and_aggregate()
    run_prediction_pipeline()
    print("Pipeline done!")

# Run immediately once
run_pipeline()

# Then every 15 minutes
schedule.every(15).minutes.do(run_pipeline)

print("Scheduler started — running every 15 mins")
while True:
    schedule.run_pending()
    time.sleep(1)