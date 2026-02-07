from app.database.supabase_client import supabase_service
from app.models.feature_engineer import feature_engineer
from app.models.prediction_model import prediction_model
from app.utils.logger import setup_logger
import pandas as pd
from typing import Dict

logger = setup_logger(__name__)

class TrainingService:
    def __init__(self):
        self.metrics: Dict = {}
        
    def train_model(self):
        """
        Execute full training pipeline.
        1. Fetch data.
        2. Preprocess.
        3. Train.
        4. Update metrics.
        """
        logger.info("Starting training pipeline...")
        try:
            # 1. Fetch
            raw_data = supabase_service.fetch_training_data(history_days=30)
            
            if raw_data.empty:
                logger.warning("No training data found. Aborting training.")
                return {"status": "failed", "reason": "no_data"}
                
            # 2. Preprocess
            X, y = feature_engineer.preprocess_training_data(raw_data)
            
            if X.empty or y.empty:
                logger.warning("Empty features after preprocessing. Aborting.")
                return {"status": "failed", "reason": "empty_features"}
                
            # 3. Train
            metrics = prediction_model.train(X, y)
            
            # 4. Update in-memory metrics
            self.metrics = metrics
            self.metrics["last_trained"] = pd.Timestamp.now().isoformat()
            
            logger.info("Training completed successfully.")
            return {"status": "success", "metrics": metrics}
            
        except Exception as e:
            logger.error(f"Training pipeline failed: {e}")
            return {"status": "error", "message": str(e)}

    def get_latest_metrics(self):
        if not self.metrics:
            return {"status": "no_metrics", "message": "Model not trained yet."}
        return self.metrics

training_service = TrainingService()
