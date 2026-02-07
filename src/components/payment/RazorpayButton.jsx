import React, { useState, useEffect } from 'react';
import { CreditCard, Loader, Check, X } from 'lucide-react';
import { initializeRazorpay } from '../../services/paymentService';
import toast from 'react-hot-toast';

const RazorpayButton = ({ order, onSuccess, onFailure, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    // Load Razorpay script
    const loadRazorpay = async () => {
      const loaded = await initializeRazorpay();
      setIsRazorpayLoaded(loaded);
      
      if (!loaded) {
        toast.error('Failed to load payment system. Please refresh the page.');
      }
    };

    loadRazorpay();
  }, []);

  const handlePayment = async () => {
    if (!isRazorpayLoaded) {
      toast.error('Payment system is still loading. Please wait.');
      return;
    }

    setIsLoading(true);
    setPaymentStatus(null);

    try {
      // In production, this would come from your backend
      const paymentData = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: Math.round(order.amount * 100), // Convert to paise
        currency: 'INR',
        name: 'Campus Pre-Order',
        description: `Order #${order.id}`,
        order_id: order.razorpayOrderId,
        prefill: {
          name: order.userName,
          email: order.userEmail,
          contact: order.userPhone,
        },
        theme: {
          color: '#3B82F6',
        },
      };

      const options = {
        ...paymentData,
        handler: async (response) => {
          try {
            // Verify payment with backend
            const verification = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const result = await verification.json();

            if (result.success) {
              setPaymentStatus('success');
              onSuccess?.(response);
              toast.success('Payment successful! Your order is confirmed.');
            } else {
              setPaymentStatus('failed');
              onFailure?.(result.error);
              toast.error('Payment verification failed');
            }
          } catch (error) {
            setPaymentStatus('failed');
            onFailure?.(error.message);
            toast.error('Payment verification failed');
          } finally {
            setIsLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentStatus('cancelled');
            onClose?.();
            toast('Payment cancelled');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
      onFailure?.(error.message);
      toast.error('Failed to initialize payment');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handlePayment}
        disabled={isLoading || !isRazorpayLoaded}
        className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all flex items-center justify-center space-x-2 ${
          paymentStatus === 'success'
            ? 'bg-green-500 hover:bg-green-600'
            : paymentStatus === 'failed'
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-blue-500 hover:bg-blue-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : paymentStatus === 'success' ? (
          <>
            <Check className="w-5 h-5" />
            <span>Payment Successful</span>
          </>
        ) : paymentStatus === 'failed' ? (
          <>
            <X className="w-5 h-5" />
            <span>Payment Failed</span>
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            <span>Pay with Razorpay</span>
          </>
        )}
      </button>

      {/* Payment Status Display */}
      {paymentStatus && (
        <div className="mt-4 p-3 rounded-lg text-sm">
          {paymentStatus === 'success' && (
            <div className="flex items-center space-x-2 text-green-600">
              <Check className="w-4 h-4" />
              <span>Payment completed successfully. Your order is being processed.</span>
            </div>
          )}
          
          {paymentStatus === 'failed' && (
            <div className="flex items-center space-x-2 text-red-600">
              <X className="w-4 h-4" />
              <span>Payment failed. Please try again or use a different payment method.</span>
            </div>
          )}
          
          {paymentStatus === 'cancelled' && (
            <div className="flex items-center space-x-2 text-yellow-600">
              <X className="w-4 h-4" />
              <span>Payment cancelled. You can try again.</span>
            </div>
          )}
        </div>
      )}

      {/* Security Badges */}
      <div className="mt-4 flex items-center justify-center space-x-4">
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <div className="w-6 h-4 bg-blue-500 rounded-sm"></div>
          <span>SSL</span>
        </div>
        <div className="text-xs text-gray-500">PCI DSS Compliant</div>
        <div className="text-xs text-gray-500">Secure Payment</div>
      </div>
    </div>
  );
};

export default RazorpayButton;