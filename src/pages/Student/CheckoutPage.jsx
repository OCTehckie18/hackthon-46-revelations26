import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Shield, CreditCard, QrCode } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { orderService } from '../../services/orderService';
import { paymentService } from '../../services/paymentService';
import PaymentForm from '../../components/payment/PaymentForm';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState('razorpay');
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    if (cart.items.length === 0) {
      navigate('/');
      return;
    }

    // Fetch detailed prediction for the order
    fetchOrderPrediction();
  }, [cart, navigate]);

  const fetchOrderPrediction = async () => {
    try {
      const predictionData = await orderService.getOrderPrediction({
        vendorId: cart.vendorId,
        items: cart.items,
      });
      setPrediction(predictionData);
    } catch (error) {
      toast.error('Failed to get order prediction');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setIsLoading(true);

      const orderPayload = {
        vendorId: cart.vendorId,
        items: cart.items,
        paymentMethod: selectedPayment,
        predictionToken: prediction?.token,
      };

      const order = await orderService.createOrder(orderPayload);
      setOrderData(order);

      if (selectedPayment === 'razorpay') {
        await handleRazorpayPayment(order);
      } else {
        // Handle other payment methods
        await handleCashPayment(order);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRazorpayPayment = async (order) => {
    try {
      const paymentData = await paymentService.createOrder(order.id, order.totalAmount);
      
      const options = {
        name: 'Campus Pre-Order',
        email: order.userEmail,
        phone: order.userPhone,
        handler: async (response) => {
          try {
            const verification = await paymentService.verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verification.success) {
              toast.success('Payment successful! Order confirmed.');
              clearCart();
              navigate(`/track-order/${order.id}`);
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        onDismiss: () => {
          toast.error('Payment cancelled');
        },
      };

      paymentService.handleRazorpayPayment(paymentData, options);
    } catch (error) {
      toast.error('Failed to initialize payment');
    }
  };

  const handleCashPayment = async (order) => {
    try {
      await orderService.confirmOrder(order.id);
      toast.success('Order placed successfully! Pay at pickup.');
      clearCart();
      navigate(`/track-order/${order.id}`);
    } catch (error) {
      toast.error('Failed to place order');
    }
  };

  const getTotal = () => {
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const platformFee = 5;
    const tax = subtotal * 0.05; // 5% tax
    return {
      subtotal,
      platformFee,
      tax,
      total: subtotal + platformFee + tax,
    };
  };

  if (cart.items.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link
        to="/"
        className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
            
            {/* Order Items */}
            <div className="space-y-4 mb-6">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={item.imageUrl || '/api/placeholder/100/100'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="font-semibold">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Prediction Display */}
            {prediction && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-blue-700">
                      Estimated Pickup Time
                    </span>
                  </div>
                  <div className="text-lg font-bold text-blue-700">
                    {new Date(prediction.pickupWindow.start).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                <p className="text-sm text-blue-600">
                  Your order will be ready for pickup during the 5-minute window starting at this time.
                  You'll receive a notification when it's ready.
                </p>
              </div>
            )}

            {/* Pickup Instructions */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-700 mb-2">Pickup Instructions</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Arrive during your 5-minute pickup window</li>
                <li>• Show your QR code or order number at the counter</li>
                <li>• Late pickups may incur additional waiting time</li>
                <li>• Contact vendor support if running late</li>
              </ul>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Method</h2>
            
            <div className="space-y-4">
              <button
                onClick={() => setSelectedPayment('razorpay')}
                className={`w-full p-4 border rounded-lg flex items-center justify-between transition-colors ${
                  selectedPayment === 'razorpay'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded ${
                    selectedPayment === 'razorpay' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Online Payment</div>
                    <div className="text-sm text-gray-500">Pay now with Razorpay</div>
                  </div>
                </div>
                {selectedPayment === 'razorpay' && (
                  <div className="w-5 h-5 rounded-full border-4 border-blue-500"></div>
                )}
              </button>

              <button
                onClick={() => setSelectedPayment('cash')}
                className={`w-full p-4 border rounded-lg flex items-center justify-between transition-colors ${
                  selectedPayment === 'cash'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded ${
                    selectedPayment === 'cash' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Pay at Pickup</div>
                    <div className="text-sm text-gray-500">Pay with cash or UPI at counter</div>
                  </div>
                </div>
                {selectedPayment === 'cash' && (
                  <div className="w-5 h-5 rounded-full border-4 border-blue-500"></div>
                )}
              </button>
            </div>

            {selectedPayment === 'razorpay' && (
              <div className="mt-6">
                <PaymentForm />
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Order Total & Checkout */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Order Total</h2>
            
            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{getTotal().subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Platform Fee</span>
                <span>₹{getTotal().platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (5%)</span>
                <span>₹{getTotal().tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{getTotal().total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-6">
              <Shield className="w-4 h-4" />
              <span>Secure payment · SSL encrypted</span>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isLoading || !prediction}
              className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                `Place Order · ₹${getTotal().total.toFixed(2)}`
              )}
            </button>

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center mt-4">
              By placing your order, you agree to our Terms of Service and Privacy Policy.
              You'll receive order confirmation and pickup notifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;