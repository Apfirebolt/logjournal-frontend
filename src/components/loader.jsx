'use client';

import React from 'react';

const Loader = () => {
    return (
        <div className="flex items-center justify-center min-h-screen space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '-0.15s' }}></div>
            <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '-0.3s' }}></div>
        </div>
    );
};

export default Loader;