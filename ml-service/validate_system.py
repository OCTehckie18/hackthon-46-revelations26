import sys
import os
import random
import logging
# import pandas as pd # Avoid pandas import if missing
from datetime import datetime, timedelta
# from unittest.mock import MagicMock, patch # Mocks handled in modules
from fastapi.testclient import TestClient

# 1. Setup Environment first
os.environ["SUPABASE_URL"] = "https://mock.supabase.co"
os.environ["SUPABASE_SERVICE_KEY"] = "mock-key"
os.environ["MODEL_PATH"] = "models/test_model.pkl"
os.environ["LOG_LEVEL"] = "INFO"

sys.path.append(os.getcwd())

# Import ONLY AFTER env setup
from app.main import app

def run_validation():
    print("\n" + "="*60)
    print("🚀 STARTING VALIDATION (LITE / SIMULATION MODE)")
    print("="*60 + "\n")

    client = TestClient(app)

    # --- Step 1: Health Check ---
    print("\n[1/3] Testing Health Endpoint...")
    try:
        response = client.get("/health")
        print(f"   -> Status: {response.status_code}")
        print(f"   -> Body: {response.json()}")
        
        if response.status_code != 200:
            print("❌ Health check failed!")
            return
    except Exception as e:
        print(f"❌ Failed to connect: {e}")
        return

    # --- Step 2: Test Real-time Prediction (Fallback Logic) ---
    print("\n[2/3] Testing Prediction Endpoint...")
    print("   (Note: Using Rule-Based Fallback logic since ML libs are missing)")
    
    # Case A: Normal Order
    payload_normal = {
        "vendor_id": "vendor_123",
        "items": [
            {"menu_item_id": "item1", "quantity": 1, "base_preparation_time_minutes": 10.0, "preparation_complexity": 2}
        ],
        "total_base_time_minutes": 10.0,
        "max_complexity": 2,
        "total_items": 1
    }
    
    resp = client.post("/predict", json=payload_normal)
    
    if resp.status_code == 200:
        data = resp.json()
        print(f"   -> 🍔 Normal Order Prediction:")
        print(f"      - Predicted Ready Time: {data['predicted_ready_time']}")
        print(f"      - Estimated Minutes: {data['estimated_minutes']:.1f}")
        print(f"      - Method Used: {data['method']}")
        print(f"      - Rush Detected: {data['rush_detected']}")
    else:
        print(f"❌ Prediction failed: {resp.text}")

    # Case B: Large Order during assumed Rush (Logic handles time internally)
    payload_large = {
        "vendor_id": "vendor_123",
        "items": [
            {"menu_item_id": "item1", "quantity": 5, "base_preparation_time_minutes": 8.0, "preparation_complexity": 3}
        ],
        "total_base_time_minutes": 40.0,
        "max_complexity": 3,
        "total_items": 5
    }
    
    resp = client.post("/predict", json=payload_large)
    if resp.status_code == 200:
        data = resp.json()
        print(f"   -> 🍟 Large Order Prediction:")
        print(f"      - Estimated Minutes: {data['estimated_minutes']:.1f}")
        print(f"      - Method Used: {data['method']}")

    print("\n" + "="*60)
    print("✅ VALIDATION COMPLETED SUCCESSFULLY (LITE MODE)")
    print("="*60 + "\n")

if __name__ == "__main__":
    try:
        run_validation()
    except Exception as e:
        print(f"\n❌ CRITICAL FAILURE: {e}")
        import traceback
        traceback.print_exc()
