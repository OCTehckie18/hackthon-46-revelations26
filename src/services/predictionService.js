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