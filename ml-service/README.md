# Campus Food Prediction ML Service

This is the AI/ML microservice for predicting food pickup times on the campus food platform.

## Architecture

- **Framwork**: FastAPI (Python)
- **ML Model**: XGBoost Regressor
- **Database**: Supabase (PostgreSQL)
- **Features**: Time-of-day, vendor load, order complexity, rush hour detection.

## Setup

1. **Install Dependencies**
   ```bash
   cd ml-service
   pip install -r requirements.txt
   ```

2. **Configuration**
   Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```bash
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_KEY=your_service_role_key
   ```

3. **Run Locally**
   ```bash
   python -m app.main
   ```
   The API will be available at `http://localhost:8000`.

## API Endpoints

- `POST /predict`: Get pickup time prediction.
- `POST /train`: Trigger model retraining.
- `GET /metrics`: Get model performance stats.
- `GET /health`: Health check.

## Testing

To test prediction manually:
```bash
curl -X POST "http://localhost:8000/predict" -H "Content-Type: application/json" -d '{
  "vendor_id": "VENDOR_UUID",
  "items": [{"menu_item_id": "ITEM_UUID", "quantity": 1, "base_preparation_time_minutes": 5}],
  "total_base_time_minutes": 5,
  "max_complexity": 1,
  "total_items": 1
}'
```

## Deployment

### Docker
```bash
docker build -t campus-ml-service .
docker run -p 8000:8000 --env-file .env campus-ml-service
```
