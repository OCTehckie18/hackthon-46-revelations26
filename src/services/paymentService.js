import api from './api';

export const paymentService = {
    // Create Razorpay order
    createOrder: async (orderId, amount) => {
        return api.post('/payments/create-order', {
            orderId,
            amount,
            currency: 'INR',
        });
    },

    // Verify payment
    verifyPayment: async (paymentData) => {
        return api.post('/payments/verify', paymentData);
    },

    // Get payment status
    getPaymentStatus: async (orderId) => {
        return api.get(`/payments/status/${orderId}`);
    },

    // Request refund
    requestRefund: async (orderId, reason) => {
        return api.post('/payments/refund', { orderId, reason });
    },
};

// Razorpay initialization
export const initializeRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

// Razorpay payment handler
export const handleRazorpayPayment = async (orderData, options) => {
    const { key, amount, currency, name, description, order_id, handler } = orderData;

    const paymentOptions = {
        key,
        amount: amount.toString(),
        currency,
        name: name || 'Campus Pre-Order',
        description: description || 'Order Payment',
        order_id,
        handler,
        prefill: {
            name: options.name,
            email: options.email,
            contact: options.phone,
        },
        theme: {
            color: '#3B82F6',
        },
        modal: {
            ondismiss: () => {
                if (options.onDismiss) options.onDismiss();
            },
        },
    };

    const razorpay = new window.Razorpay(paymentOptions);
    razorpay.open();
};