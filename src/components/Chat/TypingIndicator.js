import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-100 dark:bg-gray-700 rounded-r-lg rounded-tl-lg p-3 max-w-xs">
        <div className="flex items-center space-x-1">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
            Gemini is typing...
          </span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
