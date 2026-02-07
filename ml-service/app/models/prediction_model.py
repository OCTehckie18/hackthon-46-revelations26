import os
import logging
from typing import Tuple, Any

try:
    import xgboost as xgb
    import joblib
    HAS_ML = True
except ImportError:
    HAS_ML = False
    class MockModel: pass # Dummy

from app.config import settings
from app.utils.logger import setup_logger

logger = setup_logger(__name__)

class PredictionModel:
    def __init__(self):
        self.model = None
        self.model_path = settings.MODEL_PATH
        
    def train(self, X, y) -> dict:
        """
        Train the model (if libs available).
        """
        if not HAS_ML:
            logger.warning("ML libraries missing: Cannot train model. Skipping.")
            return {"status": "skipped", "reason": "missing_dependencies"}
            
        try:
            # We assume X, y are pandas/numpy if we reach here
            # But feature_engineer might return empty mocks
            if hasattr(X, 'empty') and X.empty:
                return {}

            from sklearn.model_selection import train_test_split
            from sklearn.metrics import mean_absolute_error, r2_score
            
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            
            self.model = xgb.XGBRegressor(
                objective='reg:squarederror',
                n_estimators=100,
                learning_rate=0.1,
                max_depth=6,
                n_jobs=-1
            )
            
            self.model.fit(X_train, y_train)
            
            predictions = self.model.predict(X_test)
            mae = mean_absolute_error(y_test, predictions)
            r2 = r2_score(y_test, predictions)
            
            logger.info(f"Model trained. MAE: {mae:.2f}, R2: {r2:.2f}")
            self.save_model()
            
            return {
                "mae": mae,
                "r2": r2,
                "samples": len(X)
            }
            
        except Exception as e:
            logger.error(f"Training failed: {e}")
            raise

    def predict(self, X) -> Tuple[float, float]:
        """
        Predict wait time.
        """
        if not HAS_ML or not self.model:
            # If we don't have ML libs or model not loaded, raising error triggers fallback
            raise ValueError("Model not loaded or ML unavailable")
            
        try:
            pred_minutes = float(self.model.predict(X)[0])
            confidence = 0.85 
            return max(pred_minutes, 1.0), confidence 
            
        except Exception as e:
            logger.error(f"Prediction failed: {e}")
            raise

    def save_model(self):
        if not HAS_ML: return
        try:
            os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
            joblib.dump(self.model, self.model_path)
            logger.info(f"Model saved to {self.model_path}")
        except Exception as e:
            logger.error(f"Failed to save model: {e}")

    def load_model(self):
        if not HAS_ML: 
            logger.warning("ML libraries missing: Running in Lite Mode (Rule-Based only).")
            return False
            
        try:
            if os.path.exists(self.model_path):
                self.model = joblib.load(self.model_path)
                logger.info(f"Model loaded from {self.model_path}")
                return True
            else:
                logger.warning(f"No model found at {self.model_path}")
                return False
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            return False

prediction_model = PredictionModel()
