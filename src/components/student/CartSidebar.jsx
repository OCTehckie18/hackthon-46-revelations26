import React from "react";
import { X, ShoppingCart, Clock, Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { Link } from "react-router-dom";

const CartSidebar = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    clearCart,
  } = useCart();

  const handleCheckout = () => {
    setIsCartOpen(false);
    // Navigate to checkout
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sidebar */}
      <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white z-50 shadow-xl animate-slideIn">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="w-6 h-6 text-blue-500" />
              <div>
                <h2 className="text-lg font-semibold">Your Order</h2>
                <p className="text-sm text-gray-500">
                  {cart.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                  items
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <ShoppingCart className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">Your cart is empty</p>
                <p className="text-sm">
                  Add items from a vendor to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          ₹{item.price} each
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 hover:bg-red-100 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-medium">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="font-semibold">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>

                    {/* Prediction Info */}
                    {item.prediction && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <div className="flex items-center space-x-2 text-sm text-green-600">
                          <Clock className="w-4 h-4" />
                          <span>~{item.prediction} min preparation time</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-4 bg-white">
            {/* Summary */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Platform Fee</span>
                <span>₹5.00</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>₹{(getCartTotal() + 5).toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              {cart.items.length > 0 && (
                <>
                  <button
                    onClick={clearCart}
                    className="w-full py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Clear Cart
                  </button>
                  <Link
                    to="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="block w-full bg-blue-500 text-white py-3 rounded-lg font-medium text-center hover:bg-blue-600 transition-colors"
                  >
                    Proceed to Checkout
                  </Link>
                </>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
