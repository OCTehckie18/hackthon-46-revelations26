import React, { useState } from 'react';
import { CreditCard, Wallet, Banknote, Smartphone, Shield } from 'lucide-react';

const PaymentForm = ({ orderId, amount, onPaymentSuccess, onPaymentError }) => {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Pay with your card',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: Smartphone,
      description: 'Pay using UPI ID',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: Banknote,
      description: 'Bank transfer',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      id: 'wallet',
      name: 'Wallet',
      icon: Wallet,
      description: 'Paytm, PhonePe, etc.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const banks = [
    { id: 'sbi', name: 'State Bank of India' },
    { id: 'hdfc', name: 'HDFC Bank' },
    { id: 'icici', name: 'ICICI Bank' },
    { id: 'axis', name: 'Axis Bank' },
    { id: 'kotak', name: 'Kotak Mahindra Bank' },
  ];

  const wallets = [
    { id: 'paytm', name: 'Paytm' },
    { id: 'phonepe', name: 'PhonePe' },
    { id: 'googlepay', name: 'Google Pay' },
    { id: 'amazonpay', name: 'Amazon Pay' },
  ];

  const handleCardInput = (field, value) => {
    let formattedValue = value;
    
    if (field === 'number') {
      // Format card number with spaces
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) formattedValue = formattedValue.substring(0, 19);
    }
    
    if (field === 'expiry') {
      // Format expiry date
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2, 4);
      }
      if (formattedValue.length > 5) formattedValue = formattedValue.substring(0, 5);
    }
    
    if (field === 'cvv') {
      // Limit CVV to 3-4 digits
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) formattedValue = formattedValue.substring(0, 4);
    }
    
    setCardDetails(prev => ({
      ...prev,
      [field]: formattedValue,
    }));
  };

  const validateCard = () => {
    const { number, name, expiry, cvv } = cardDetails;
    
    if (!number.replace(/\s/g, '').match(/^\d{16}$/)) {
      return 'Please enter a valid 16-digit card number';
    }
    
    if (!name.trim()) {
      return 'Please enter cardholder name';
    }
    
    if (!expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      return 'Please enter a valid expiry date (MM/YY)';
    }
    
    if (!cvv.match(/^\d{3,4}$/)) {
      return 'Please enter a valid CVV';
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedMethod === 'card') {
      const error = validateCard();
      if (error) {
        onPaymentError?.(error);
        return;
      }
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const paymentData = {
        orderId,
        amount,
        method: selectedMethod,
        timestamp: new Date().toISOString(),
        transactionId: 'TXN' + Date.now(),
      };
      
      onPaymentSuccess?.(paymentData);
    } catch (error) {
      onPaymentError?.(error.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Payment Details</h3>
        <div className="flex items-center space-x-2 text-sm text-green-600">
          <Shield className="w-4 h-4" />
          <span>Secure Payment</span>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Payment Method
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setSelectedMethod(method.id)}
              className={`p-3 border rounded-lg text-left transition-all ${
                selectedMethod === method.id
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded ${method.bgColor}`}>
                  <method.icon className={`w-5 h-5 ${method.color}`} />
                </div>
                <div>
                  <div className="font-medium text-sm">{method.name}</div>
                  <div className="text-xs text-gray-500">{method.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit}>
        {selectedMethod === 'card' && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cardDetails.number}
                  onChange={(e) => handleCardInput('number', e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={19}
                />
                <div className="absolute right-3 top-3 flex space-x-2">
                  <div className="w-8 h-5 bg-blue-500 rounded-sm"></div>
                  <div className="w-8 h-5 bg-red-500 rounded-sm"></div>
                  <div className="w-8 h-5 bg-yellow-500 rounded-sm"></div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardDetails.name}
                onChange={(e) => handleCardInput('name', e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={cardDetails.expiry}
                  onChange={(e) => handleCardInput('expiry', e.target.value)}
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={cardDetails.cvv}
                    onChange={(e) => handleCardInput('cvv', e.target.value)}
                    placeholder="123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={4}
                  />
                  <div className="absolute right-3 top-3">
                    <div className="w-6 h-5 bg-gray-100 border rounded flex items-center justify-center text-xs">
                      CVV
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedMethod === 'upi' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              UPI ID
            </label>
            <input
              type="text"
              placeholder="username@upi"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Google Pay
              </button>
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                PhonePe
              </button>
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Paytm
              </button>
            </div>
          </div>
        )}

        {selectedMethod === 'netbanking' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Bank
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {banks.map((bank) => (
                <label
                  key={bank.id}
                  className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="bank"
                    value={bank.id}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-3">{bank.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {selectedMethod === 'wallet' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Wallet
            </label>
            <div className="grid grid-cols-2 gap-3">
              {wallets.map((wallet) => (
                <label
                  key={wallet.id}
                  className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="wallet"
                    value={wallet.id}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-2">{wallet.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Terms and Conditions */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              required
              className="w-4 h-4 mt-1 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-600">
              I agree to the Terms and Conditions and authorize payment of ₹{amount.toFixed(2)}.
              I understand that my card will be charged immediately and I can request a refund
              as per the cancellation policy.
            </span>
          </label>
        </div>

        {/* Pay Button */}
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Processing Payment...
            </>
          ) : (
            `Pay ₹${amount.toFixed(2)}`
          )}
        </button>

        {/* Security Info */}
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Shield className="w-3 h-3" />
              <span>256-bit SSL</span>
            </div>
            <div>•</div>
            <div>PCI DSS Compliant</div>
            <div>•</div>
            <div>Secure Payment</div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;