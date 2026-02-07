from datetime import datetime, timedelta
import logging

try:
    from supabase import create_client, Client
    import pandas as pd
    HAS_SUPABASE = True
except ImportError:
    HAS_SUPABASE = False
    class Client: pass # Mock

from app.config import settings
from app.utils.logger import setup_logger

logger = setup_logger(__name__)

class SupabaseService:
    _instance = None

    def __init__(self):
        if HAS_SUPABASE:
            try:
                self.client: Client = create_client(
                    settings.SUPABASE_URL, 
                    settings.SUPABASE_SERVICE_KEY
                )
                logger.info("Supabase client initialized")
            except Exception as e:
                logger.error(f"Failed to initialize Supabase client: {e}")
                self.client = None
        else:
            logger.info("Running in Lite Mode (No Supabase/Pandas). Using Mock DB.")
            self.client = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def fetch_training_data(self, history_days: int = 30):
        if not HAS_SUPABASE or not self.client:
            return [] # In lite mode, no training data
            
        start_date = (datetime.now() - timedelta(days=history_days)).isoformat()
        
        try:
            response = self.client.table("orders") \
                .select("*") \
                .gte("created_at", start_date) \
                .in_("status", ["ready", "collected"]) \
                .execute()
                
            orders_data = response.data
            return pd.DataFrame(orders_data) if orders_data else pd.DataFrame()
            
        except Exception as e:
            logger.error(f"Error fetching training data: {e}")
            return pd.DataFrame()

    def get_vendor_load(self, vendor_id: str):
        if not HAS_SUPABASE or not self.client:
            return 3 # Mock specific load for validation demo
            
        try:
            response = self.client.table("orders") \
                .select("id", count="exact") \
                .eq("vendor_id", vendor_id) \
                .in_("status", ["pending", "preparing"]) \
                .execute()
            
            return response.count if response.count is not None else 0
        except Exception as e:
            return 0

    def get_recent_order_velocity(self, vendor_id: str, minutes: int = 15):
        if not HAS_SUPABASE or not self.client:
            return 10 # Mock velocity
            
        start_time = (datetime.now() - timedelta(minutes=minutes)).isoformat()
        try:
            response = self.client.table("orders") \
                .select("id", count="exact") \
                .eq("vendor_id", vendor_id) \
                .gte("created_at", start_time) \
                .execute()
                
            return response.count if response.count is not None else 0
        except Exception as e:
            return 0

    def log_prediction(self, prediction_data: dict):
        if not HAS_SUPABASE or not self.client:
            # logger.info(f"[MOCK DB] Would insert: {prediction_data}")
            return
            
        try:
            self.client.table("prediction_logs").insert(prediction_data).execute()
        except Exception as e:
            logger.error(f"Error logging prediction: {e}")

    def update_order_prediction(self, order_id: str, predicted_time: str, confidence: float):
        if not HAS_SUPABASE or not self.client:
            return
            
        try:
            self.client.table("orders").update({
                "predicted_ready_time": predicted_time,
                "prediction_confidence": confidence
            }).eq("id", order_id).execute()
        except Exception as e:
            logger.error(f"Error updating order prediction: {e}")

supabase_service = SupabaseService.get_instance()
