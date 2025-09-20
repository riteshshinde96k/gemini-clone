import React from 'react';

const MessageSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="flex justify-start">
          <div className="max-w-xs sm:max-w-md bg-gray-100 dark:bg-gray-700 rounded-r-lg rounded-tl-lg p-3">
            <div className="space-y-2">
              <div className="skeleton h-4 w-32"></div>
              <div className="skeleton h-4 w-24"></div>
              <div className="skeleton h-3 w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;
