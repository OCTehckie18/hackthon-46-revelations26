from datetime import datetime
from starlette.concurrency import run_in_threadpool
import logging

from app.models.prediction_model import prediction_model
from app.models.feature_engineer import feature_engineer
from app.database.supabase_client import supabase_service
from app.config import settings

logger = logging.getLogger(__name__)

class PredictionService:
    def __init__(self):
        self.model = prediction_model
        
    def load_model(self):
        """
        Load the trained model from disk.
        """
        self.model.load_model()

    async def predict(self, request_data):
        """
        Main prediction logic.
        1. Fetch context (vendor load, velocity).
        2. Engineer features.
        3. Try ML model.
        4. Fallback to rules if needed.
        5. Log result.
        """
        start_time = datetime.now()
        
        # 1. Fetch Context (IO bound, run in threadpool)
        # We need vendor load and recent velocity
        vendor_id = request_data.vendor_id
        
        try:
            vendor_load = await run_in_threadpool(supabase_service.get_vendor_load, vendor_id)
            recent_velocity = await run_in_threadpool(supabase_service.get_recent_order_velocity, vendor_id)
            
            # 2. Engineer Features
            # We need to reshape the request data into what feature_engineer expects
            # request_data.items is a list of objects with menu_item_id, quantity, etc.
            # feature_engineer expects a list of dicts/objects with base_time etc.
            # Convert request items to list of dicts for safety
            items_dicts = [item.dict() for item in request_data.items]
            
            # We also need vendor metrics (static/cached ideally, but we'll use defaults or fetch)
            # For speed, let's assume defaults or use what we have. 
            # supabase_service.get_vendor_load doesn't return max_capacity.
            # We'll use defaults for now to save a DB call or implement a cache later.
            vendor_metrics = {
                "avg_order_fulfillment_rate": 2.0, # Default
                "max_concurrent_orders": 10
            }
            
            features_df = feature_engineer.create_features_for_prediction(
                items_dicts,
                vendor_load,
                vendor_metrics,
                recent_velocity
            )
            
            # 3. Model Prediction
            predicted_minutes = 0.0
            confidence = 0.0
            method = "rule_based_fallback"
            
            if self.model.model is not None:
                try:
                    # ML Prediction
                    predicted_minutes, confidence = self.model.predict(features_df)
                    method = "ml_model"
                    
                    # Sanity check: If ML predicts crazy low/high, fallback?
                    # E.g. < 1 min or > 60 mins (context dependent)
                    if predicted_minutes < 1.0 or predicted_minutes > 120.0:
                        logger.warning(f"ML prediction {predicted_minutes} out of bounds, falling back.")
                        method = "ml_model_outlier_fallback"
                        # Fall through to rule based
                        raise ValueError("Model prediction out of bounds")
                        
                except Exception as e:
                    logger.warning(f"Model prediction error: {e}. using fallback.")
                    # Fallback
                    predicted_minutes = self.calculate_rule_based(request_data, vendor_load)
                    confidence = 0.5 # Lower confidence for fallback
                    method = "rule_based_fallback"
            else:
                # No model loaded
                predicted_minutes = self.calculate_rule_based(request_data, vendor_load)
                confidence = 0.4
                method = "rule_based_fallback_no_model"
                
            # 4. Final adjustments
            # Rush hour check for response flag
            hour = datetime.now().hour
            is_rush = (11 <= hour <= 13) or (16 <= hour <= 17)
            
            # Calculate timestamp
            from datetime import timedelta
            predicted_time = start_time + timedelta(minutes=predicted_minutes)
            
            # 5. Log prediction (Fire and forget, or background task)
            # We'll just log to console or DB asynchronously if possible.
            # In FastAPI, best to use BackgroundTasks passed from controller, but here we are in service.
            # We'll run in threadpool to not block response.
            log_data = {
                "order_id": request_data.order_id, # Might be None for pre-prediction
                "predicted_ready_time": predicted_time.isoformat(),
                "actual_ready_time": None,
                "error_minutes": None,
                "created_at": datetime.now().isoformat()
            }
            if request_data.order_id: # Only log if it's a real order
                run_in_threadpool(supabase_service.log_prediction, log_data)
                # Also update order table
                run_in_threadpool(supabase_service.update_order_prediction, 
                                request_data.order_id, 
                                predicted_time.isoformat(), 
                                confidence)

            return {
                "predicted_ready_time": predicted_time.isoformat(),
                "confidence": confidence,
                "estimated_minutes": float(predicted_minutes),
                "queue_position": vendor_load + 1,
                "method": method,
                "rush_detected": is_rush
            }
            
        except Exception as e:
            logger.error(f"Critical error in prediction service: {e}")
            raise e

    def calculate_rule_based(self, request_data, vendor_load):
        """
        Rule-based fallback calculation.
        """
        # Base time: sum(item.base * qty)
        # But we need base_prep_time from items. 
        # The request `items` has `base_preparation_time_minutes`.
        base_time = sum(item.base_preparation_time_minutes * item.quantity for item in request_data.items)
        if base_time <= 0:
             # Fallback if base time missing
             base_time = request_data.total_base_time_minutes 
        
        # Queue delay
        queue_delay = vendor_load * 2.5 # 2.5 mins per order in queue
        
        # Rush multiplier
        hour = datetime.now().hour
        rush_multiplier = 1.4 if 11 <= hour <= 13 else 1.0
        
        total_minutes = (base_time + queue_delay) * rush_multiplier
        return total_minutes

