import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'spinner' | 'dots' | 'pulse';
}

const Loader: React.FC<LoaderProps> = ({ size = 'md', className = '', variant = 'spinner' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const renderSpinner = () => (
    <div className={`${sizeClasses[size]} relative`}>
      {/* Outer ring */}
      <div className="absolute inset-0 border-4 border-zinc-700 rounded-full"></div>
      
      {/* Animated ring */}
      <div className="absolute inset-0 border-4 border-transparent border-t-green-500 rounded-full animate-spin"></div>
      
      {/* Inner pulse */}
      <div className="absolute inset-2 bg-green-500/20 rounded-full animate-pulse"></div>
    </div>
  );

  const renderDots = () => (
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
  );

  const renderPulse = () => (
    <div className={`${sizeClasses[size]} bg-green-500 rounded-full animate-pulse`}></div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      default:
        return renderSpinner();
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {renderLoader()}
    </div>
  );
};

export default Loader; 