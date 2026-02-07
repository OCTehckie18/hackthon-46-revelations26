import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, MapPin, QrCode, Share2, Download, Printer } from 'lucide-react';
import QRCode from 'qrcode.react';
import Confetti from 'react-confetti';

const PaymentSuccess = ({ order, onContinueShopping }) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [timeLeft, setTimeLeft] = useState(order.estimatedPrepTime || 15);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // Stop confetti after 5 seconds
    const confettiTimer = setTimeout(() => setShowConfetti(false), 5000);

    // Update window size for confetti
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(confettiTimer);
      clearInterval(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Order Confirmed!',
          text: `I just ordered from ${order.vendorName} via Campus Pre-Order!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Sharing cancelled:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `Order #${order.id} confirmed! Pickup at ${order.pickupTime} from ${order.vendorName}`
      );
      toast.success('Order details copied to clipboard!');
    }
  };

  const handleDownloadQR = () => {
    const canvas = document.getElementById('order-qr-code');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `order-${order.id}-qr.png`;
      link.href = url;
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 relative">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            Your order has been confirmed and is being prepared
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-xl shadow-lg border p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Order #{order.id}
              </h2>
              <p className="text-gray-500">
                {new Date().toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                ₹{order.totalAmount.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">Total Amount</div>
            </div>
          </div>

          {/* Vendor Info */}
          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{order.vendorName}</h3>
              <p className="text-sm text-gray-600">{order.vendorAddress}</p>
            </div>
          </div>

          {/* Pickup Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-green-600" />
                <span className="font-semibold">Pickup Time</span>
              </div>
              <div className="text-2xl font-bold text-green-700">
                {order.pickupTime}
              </div>
              <div className="text-sm text-green-600">
                Arrive during your 5-minute window
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Preparation Time</span>
              </div>
              <div className="text-2xl font-bold text-blue-700">
                {formatTime(order.estimatedPrepTime)}
              </div>
              <div className="text-sm text-blue-600">
                Current status: Preparing
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-5 h-5 text-purple-600" />
                <span className="font-semibold">Pickup Counter</span>
              </div>
              <div className="text-2xl font-bold text-purple-700">
                Counter {order.counterNumber || 'A'}
              </div>
              <div className="text-sm text-purple-600">
                Show QR code at counter
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="text-center mb-6">
            <div className="inline-block p-4 bg-white border rounded-xl">
              <div className="mb-3">
                <QRCode
                  id="order-qr-code"
                  value={JSON.stringify({
                    orderId: order.id,
                    token: order.token,
                    vendorId: order.vendorId,
                  })}
                  size={180}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div className="text-sm text-gray-600">
                Show this QR code at pickup counter
              </div>
              <div className="font-mono text-lg font-bold mt-2">
                {order.token}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={handleDownloadQR}
              className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download QR</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 border border-gray-500 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-2 border border-purple-500 text-purple-500 rounded-lg hover:bg-purple-50 transition-colors flex items-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Order</span>
            </button>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-lg border p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Order Items
          </h3>
          <div className="space-y-3">
            {order.items?.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">
                      Qty: {item.quantity} • ₹{item.price} each
                    </div>
                  </div>
                </div>
                <div className="font-semibold">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Your order is being prepared!</h3>
              <p className="opacity-90">
                Estimated preparation time: {formatTime(order.estimatedPrepTime)}
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{timeLeft}</div>
              <div className="text-sm opacity-90">minutes remaining</div>
            </div>
          </div>
          <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-1000"
              style={{
                width: `${((order.estimatedPrepTime - timeLeft) / order.estimatedPrepTime) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-xl shadow-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            What's Next?
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h4 className="font-medium">You'll receive notifications</h4>
                <p className="text-sm text-gray-600">
                  We'll notify you when preparation starts and when your order is ready for pickup
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <div>
                <h4 className="font-medium">Go to the pickup counter</h4>
                <p className="text-sm text-gray-600">
                  Arrive at {order.vendorName} during your pickup window ({order.pickupTime})
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <div>
                <h4 className="font-medium">Show your QR code</h4>
                <p className="text-sm text-gray-600">
                  Present the QR code or order token at the counter to collect your order
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="text-center mt-8">
          <button
            onClick={onContinueShopping}
            className="bg-blue-500 text-white py-3 px-8 rounded-lg font-semibold text-lg hover:bg-blue-600 transition-colors"
          >
            Continue Shopping
          </button>
          <p className="text-gray-500 text-sm mt-3">
            You can track your order from the Orders page
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;