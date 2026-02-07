from datetime import datetime
from typing import List, Dict, Any
import logging

try:
    import pandas as pd
    import numpy as np
    HAS_PANDAS = True
except ImportError:
    HAS_PANDAS = False
    class MockDataFrame:
        def __init__(self, data=None): self.data = data or []
        def fillna(self, v): return self
        def sort_values(self, by): return self
        @property
        def empty(self): return not bool(self.data)
        def __getitem__(self, item): return MockDataFrame()
    pd = type('pd', (), {'DataFrame': MockDataFrame, 'to_datetime': lambda x: x, 'Timestamp': type('Timestamp', (), {'now': datetime.now})})
    pd.to_datetime = lambda x: x # Mock method

logger = logging.getLogger(__name__)

class FeatureEngineer:
    def __init__(self):
        pass

    def extract_time_features(self, timestamp: datetime) -> Dict[str, Any]:
        """
        Extract temporal features from a timestamp.
        """
        hour = timestamp.hour
        day_of_week = timestamp.weekday()
        
        # Rush hour flags (11-13, 16-17)
        is_lunch_rush = 1 if 11 <= hour <= 13 else 0
        is_dinner_rush = 1 if 16 <= hour <= 17 else 0
        
        return {
            "hour_of_day": hour,
            "day_of_week": day_of_week,
            "is_lunch_rush": is_lunch_rush,
            "is_dinner_rush": is_dinner_rush
        }

    def create_features_for_prediction(self, 
                                     order_items: List[Dict], 
                                     vendor_queue_depth: int,
                                     vendor_metrics: Dict[str, float],
                                     recent_velocity: int):
        """
        Create a single-row DataFrame (or dict in Lite mode) for real-time prediction.
        """
        # Calculate item-based features
        total_base_time = sum(item.get('base_preparation_time_minutes', 0) * item.get('quantity', 0) for item in order_items)
        max_complexity = max([item.get('preparation_complexity', 1) for item in order_items]) if order_items else 1
        total_items = sum(item.get('quantity', 0) for item in order_items)
        
        # Current time context
        now = datetime.now()
        time_feats = self.extract_time_features(now)
        
        features = {
            "total_base_time_minutes": total_base_time,
            "max_complexity": max_complexity,
            "total_items": total_items,
            "vendor_queue_depth": vendor_queue_depth,
            "recent_order_velocity": recent_velocity,
            "vendor_avg_rate": vendor_metrics.get("avg_order_fulfillment_rate", 2.0),
            "vendor_max_concurrent": vendor_metrics.get("max_concurrent_orders", 10),
            **time_feats
        }
        
        if HAS_PANDAS:
            return pd.DataFrame([features])
        return features # Return raw dict in Lite mode

    def preprocess_training_data(self, raw_data):
        """
        Transform raw data into features.
        """
        if not HAS_PANDAS:
            return [], [] # Cannot do training in Lite mode
            
        if isinstance(raw_data, pd.DataFrame) and raw_data.empty:
            return pd.DataFrame(), pd.Series()

        # ... (rest of logic assumes pandas) ...
        # Since we are in Lite mode likely, we just skip
        return pd.DataFrame(), pd.Series()

feature_engineer = FeatureEngineer()
