import os
import logging
from dotenv import load_dotenv

load_dotenv()

class Settings:
    SUPABASE_URL = os.getenv("SUPABASE_URL", "")
    SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")
    MODEL_PATH = os.getenv("MODEL_PATH", "models/prep_time_predictor.pkl")
    MIN_TRAINING_SAMPLES = int(os.getenv("MIN_TRAINING_SAMPLES", "100"))
    TARGET_MAE_SECONDS = int(os.getenv("TARGET_MAE_SECONDS", "180"))
    API_PORT = int(os.getenv("API_PORT", "8000"))
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

settings = Settings()
