import React, { useState } from 'react';
import { Clock, TrendingUp, TrendingDown, Check, X, Info, Zap } from 'lucide-react';

const PredictionBadge = ({ prediction, size = 'md', showDetails = false, interactive = true }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!prediction) {
    return (
      <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-100 text-gray-600">
        <Clock className="w-4 h-4 mr-1.5" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  // Determine prediction status
  const getPredictionStatus = () => {
    const { estimatedMinutes, confidence, accuracy } = prediction;
    
    if (confidence >= 0.9) return 'high';
    if (confidence >= 0.7) return 'medium';
    if (confidence >= 0.5) return 'low';
    return 'very-low';
  };

  // Get color based on confidence
  const getStatusColor = (status) => {
    switch (status) {
      case 'high':
        return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' };
      case 'medium':
        return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' };
      case 'low':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' };
      case 'very-low':
        return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
    }
  };

  // Get icon based on confidence
  const getStatusIcon = (status) => {
    switch (status) {
      case 'high':
        return <Check className="w-4 h-4" />;
      case 'medium':
        return <TrendingUp className="w-4 h-4" />;
      case 'low':
        return <TrendingDown className="w-4 h-4" />;
      case 'very-low':
        return <X className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      padding: 'px-2 py-1',
      text: 'text-xs',
      icon: 'w-3 h-3',
      badgeHeight: 'h-6'
    },
    md: {
      padding: 'px-3 py-1.5',
      text: 'text-sm',
      icon: 'w-4 h-4',
      badgeHeight: 'h-8'
    },
    lg: {
      padding: 'px-4 py-2',
      text: 'text-base',
      icon: 'w-5 h-5',
      badgeHeight: 'h-10'
    }
  };

  const status = getPredictionStatus();
  const colors = getStatusColor(status);
  const config = sizeConfig[size];

  // Format time
  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${Math.round(minutes)} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  // Get confidence label
  const getConfidenceLabel = (confidence) => {
    if (confidence >= 0.9) return 'Very High';
    if (confidence >= 0.7) return 'High';
    if (confidence >= 0.5) return 'Medium';
    if (confidence >= 0.3) return 'Low';
    return 'Very Low';
  };

  return (
    <div className="relative">
      {/* Main Badge */}
      <div 
        className={`
          inline-flex items-center ${config.padding} rounded-lg border ${colors.border} 
          ${colors.bg} ${colors.text} ${config.badgeHeight} transition-all duration-200
          ${interactive ? 'hover:shadow-sm cursor-pointer' : ''}
          ${isExpanded ? 'rounded-b-none' : ''}
        `}
        onClick={() => interactive && setIsExpanded(!isExpanded)}
      >
        {/* Status Icon */}
        <div className={`${config.icon} mr-2`}>
          {getStatusIcon(status)}
        </div>
        
        {/* Time Display */}
        <div className={`font-medium ${config.text}`}>
          {prediction.estimatedMinutes !== undefined 
            ? formatTime(prediction.estimatedMinutes) 
            : '--'}
        </div>
        
        {/* Confidence Indicator */}
        {prediction.confidence !== undefined && (
          <div className={`ml-2 text-xs opacity-80 ${config.text}`}>
            ({Math.round(prediction.confidence * 100)}%)
          </div>
        )}
        
        {/* Info Button */}
        {interactive && (
          <button className="ml-2 opacity-70 hover:opacity-100">
            <Info className={config.icon} />
          </button>
        )}
      </div>

      {/* Expanded Details */}
      {isExpanded && interactive && (
        <div className={`
          absolute top-full left-0 right-0 mt-1 z-10 
          ${colors.bg} ${colors.text} border ${colors.border} 
          rounded-b-lg shadow-lg p-4 min-w-[280px] animate-fadeIn
        `}>
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              <span className="font-semibold">Prediction Details</span>
            </div>
            <button 
              onClick={() => setIsExpanded(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Confidence Meter */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Confidence</span>
              <span className="font-medium">
                {getConfidenceLabel(prediction.confidence)}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  status === 'high' ? 'bg-green-500' :
                  status === 'medium' ? 'bg-blue-500' :
                  status === 'low' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${(prediction.confidence || 0) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {prediction.confidence ? Math.round(prediction.confidence * 100) : 0}% accurate
            </div>
          </div>

          {/* Breakdown */}
          {prediction.breakdown && (
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Time Breakdown</div>
              <div className="space-y-2">
                {prediction.breakdown.baseTime !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Preparation</span>
                    <span className="font-medium">{formatTime(prediction.breakdown.baseTime)}</span>
                  </div>
                )}
                
                {prediction.breakdown.queueEffect !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Queue Wait</span>
                    <span className="font-medium">+{formatTime(prediction.breakdown.queueEffect)}</span>
                  </div>
                )}
                
                {prediction.breakdown.demandFactor !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Peak Hours</span>
                    <span className="font-medium">×{prediction.breakdown.demandFactor.toFixed(1)}</span>
                  </div>
                )}
                
                <div className="border-t pt-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Total Estimated Time</span>
                    <span>{formatTime(prediction.estimatedMinutes)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pickup Window */}
          {prediction.pickupWindow && (
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Pickup Window</div>
              <div className="flex items-center justify-between p-2 bg-white/50 rounded">
                <div className="text-center">
                  <div className="text-xs text-gray-500">From</div>
                  <div className="font-medium">
                    {new Date(prediction.pickupWindow.start).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className="w-4 h-px bg-gray-300 mx-2"></div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">To</div>
                  <div className="font-medium">
                    {new Date(prediction.pickupWindow.end).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Factors Affecting Time */}
          <div>
            <div className="text-sm font-medium mb-2">Factors Considered</div>
            <div className="flex flex-wrap gap-1">
              {prediction.factors?.map((factor, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-white/50 rounded text-xs"
                >
                  {factor}
                </span>
              )) || (
                <div className="text-xs text-gray-500">
                  Real-time queue, vendor capacity, item complexity
                </div>
              )}
            </div>
          </div>

          {/* Last Updated */}
          {prediction.lastUpdated && (
            <div className="text-xs text-gray-500 mt-3 pt-2 border-t">
              Updated {new Date(prediction.lastUpdated).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PredictionBadge;
