from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uvicorn
from contextlib import asynccontextmanager

from app.config import settings
from app.utils.logger import setup_logger
from app.services.prediction_service import PredictionService
from app.services.training_service import TrainingService

logger = setup_logger(__name__)

# Initialize services (creating singletons)
prediction_service = PredictionService()
training_service = TrainingService()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load model
    logger.info("Starting ML Service...")
    try:
        prediction_service.load_model()
    except Exception as e:
        logger.warning(f"Could not load model on startup: {e}. Running in fallback-only mode.")
    yield
    # Shutdown
    logger.info("Shutting down ML Service...")

app = FastAPI(
    title="Campus Food Prediction API",
    description="AI/ML Microservice for predicting food pickup times",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware for Frontend Access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models for Input/Output ---

class OrderItemInput(BaseModel):
    menu_item_id: str
    quantity: int
    base_preparation_time_minutes: float = 0.0 
    preparation_complexity: int = 1

class PredictionRequest(BaseModel):
    order_id: Optional[str] = None 
    vendor_id: str
    items: List[OrderItemInput]
    total_base_time_minutes: float
    max_complexity: int
    total_items: int

class PredictionResponse(BaseModel):
    predicted_ready_time: str 
    confidence: float 
    estimated_minutes: float
    queue_position: int
    method: str 
    rush_detected: bool

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    version: str

# --- Endpoints ---

@app.post("/predict", response_model=PredictionResponse)
async def predict_order_ready_time(request: PredictionRequest):
    """
    Predict when an order will be ready for pickup.
    Uses XGBoost model if available, otherwise falls back to rule-based logic.
    """
    try:
        start_time = datetime.now()
        
        # Call prediction service
        result = await prediction_service.predict(request)
        
        process_time = (datetime.now() - start_time).total_seconds() * 1000
        logger.info(f"Prediction processed in {process_time:.2f}ms using {result['method']}")
        
        return result
        
    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}", exc_info=True)
        # Final safety net fallback strictly rule-based
        current_time = datetime.now()
        
        # Simple fallback based on total base time + buffer
        fallback_est = request.total_base_time_minutes * 1.5 
        
        return {
            "predicted_ready_time": (current_time).isoformat(), # Ideally add fallback_est delta
            "confidence": 0.1,
            "estimated_minutes": fallback_est,
            "queue_position": -1,
            "method": "emergency_fallback",
            "rush_detected": False
        }

@app.post("/train")
async def trigger_training(background_tasks: BackgroundTasks):
    """
    Trigger model retraining in the background.
    """
    background_tasks.add_task(training_service.train_model)
    return {"message": "Training task started in background", "status": "processing"}

@app.get("/metrics")
async def get_model_metrics():
    """
    Return model performance statistics.
    """
    return training_service.get_latest_metrics()

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Service health check.
    """
    return {
        "status": "healthy",
        "model_loaded": prediction_service.model.model is not None, # Check internal model
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.API_PORT, reload=True)
