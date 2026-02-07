import React, { useState } from "react";
import { Clock, Info, Plus, Minus } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { usePredictions } from "../../hooks/usePredictions";
import toast from "react-hot-toast";

const MenuItemCard = ({ item, vendorId }) => {
  const { addToCart, cart } = useCart();
  const { predictions, isLoading } = usePredictions();
  const [showDetails, setShowDetails] = useState(false);

  const prediction = predictions[item.id];
  const cartItem = cart.items.find((cartItem) => cartItem.id === item.id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addToCart(
      {
        ...item,
        vendorId,
        prediction: prediction?.estimatedMinutes,
      },
      vendorId,
    );
  };

  const handleIncrement = () => {
    addToCart(
      {
        ...item,
        vendorId,
        prediction: prediction?.estimatedMinutes,
      },
      vendorId,
    );
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      // Update quantity logic
    } else {
      // Remove from cart logic
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden animate-fadeIn">
      {/* Item Image */}
      <div className="h-48 overflow-hidden">
        <img
          src={item.imageUrl || "/api/placeholder/400/300"}
          alt={item.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
          <span className="text-lg font-bold text-blue-600">₹{item.price}</span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {item.tags?.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Prediction Display */}
        <div className="mb-4">
          {isLoading ? (
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              <span className="text-sm">Calculating wait time...</span>
            </div>
          ) : prediction ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-700">
                    Ready in {prediction.estimatedMinutes} min
                  </span>
                </div>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-green-600 hover:text-green-800"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>

              {showDetails && prediction.breakdown && (
                <div className="mt-2 pt-2 border-t border-green-200">
                  <p className="text-xs text-green-600 mb-1">Breakdown:</p>
                  <ul className="text-xs text-green-700 space-y-1">
                    <li>• Base prep: {prediction.breakdown.baseTime} min</li>
                    <li>• Queue: +{prediction.breakdown.queueEffect} min</li>
                    <li>• Peak hours: {prediction.breakdown.demandFactor}</li>
                  </ul>
                </div>
              )}

              <div className="text-xs text-green-600 mt-1">
                Pickup by:{" "}
                {new Date(prediction.pickupWindow.start).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                )}
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-700">
                  Prediction unavailable
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <div className="flex items-center justify-between">
          {quantity > 0 ? (
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDecrement}
                className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-lg font-semibold">{quantity}</span>
              <button
                onClick={handleIncrement}
                className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isLoading || !prediction}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          )}

          {quantity > 0 && (
            <div className="text-sm text-gray-600">
              Total: ₹{(item.price * quantity).toFixed(2)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
