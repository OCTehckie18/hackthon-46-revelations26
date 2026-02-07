<<<<<<< HEAD
import axios from 'axios';

const ML_API_URL = import.meta.env.VITE_ML_API_URL || 'http://localhost:8000';

class PredictionService {
  /**
   * Predict ready time for a potential order
   * @param {Object} orderData - cart items and vendor info
   * @param {string} vendorId
   * @returns {Promise<Object>} Prediction result
   */
  async predictOrderReadyTime(cartItems, vendorId) {
    try {
      // 1. Calculate features from cart
      const features = this.calculateOrderFeatures(cartItems);
      
      // 2. Prepare payload
      const payload = {
        vendor_id: vendorId,
        items: cartItems.map(item => ({
          menu_item_id: item.id || item.menu_item_id,
          quantity: item.quantity,
          base_preparation_time_minutes: parseFloat(item.base_preparation_time_minutes) || 5.0,
          preparation_complexity: item.preparation_complexity || 1
        })),
        total_base_time_minutes: features.totalBaseTime,
        max_complexity: features.maxComplexity,
        total_items: features.totalItems
      };

      // 3. Call ML Service
      const response = await axios.post(`${ML_API_URL}/predict`, payload);
      
      return response.data;
    } catch (error) {
      console.error('Prediction service error:', error);
      // Fallback if API fails (client-side simple estimation)
      return this.clientSideFallback(cartItems);
    }
  }
  
  calculateOrderFeatures(cartItems) {
    if (!cartItems || cartItems.length === 0) {
      return { totalBaseTime: 0, maxComplexity: 1, totalItems: 0 };
    }

    const totalBaseTime = cartItems.reduce((sum, item) => {
      const base = parseFloat(item.base_preparation_time_minutes) || 5.0;
      return sum + (base * item.quantity);
    }, 0);
    
    const maxComplexity = Math.max(...cartItems.map(item => item.preparation_complexity || 1));
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return { totalBaseTime, maxComplexity, totalItems };
  }

  clientSideFallback(cartItems) {
    // Very basic fallback if ML service is down
    const { totalBaseTime } = this.calculateOrderFeatures(cartItems);
    const estimatedMinutes = totalBaseTime * 1.5; // Safety margin
    const now = new Date();
    const predictedTime = new Date(now.getTime() + estimatedMinutes * 60000);
    
    return {
      predicted_ready_time: predictedTime.toISOString(),
      confidence: 0.0,
      estimated_minutes: estimatedMinutes,
      queue_position: -1,
      method: 'client_fallback',
      rush_detected: false
    };
  }
}

export const predictionService = new PredictionService();
=======
import api from './api';

export const predictionService = {
    // Get quick prediction for browsing
    getQuickEstimate: async (vendorId, itemId) => {
        return api.post('/predictions/quick', {
            vendorId,
            itemId,
            timestamp: new Date().toISOString(),
        });
    },

    // Get batch predictions for menu items
    getBatchPredictions: async (vendorId, itemIds) => {
        const requests = itemIds.map(itemId => ({
            vendorId,
            itemId,
            quantity: 1,
            timestamp: new Date().toISOString(),
        }));
        return api.post('/predictions/bulk-quick', requests);
    },

    // Get detailed prediction for order
    getDetailedPrediction: async (orderData) => {
        return api.post('/predictions/detailed', orderData);
    },

    // Get real-time prediction updates
    subscribeToPredictions: (vendorId, callback) => {
        // WebSocket implementation
        const ws = new WebSocket(`${import.meta.env.VITE_WS_URL || 'ws://localhost:5000'}/predictions/${vendorId}`);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            callback(data);
        };

        return () => ws.close();
    },
};
>>>>>>> e9a0b7e9adcfc91163dbdcf393495246bb201e11
