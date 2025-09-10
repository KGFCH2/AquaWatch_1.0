import React from 'react';
import { Droplets } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-900 flex items-center justify-center">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="text-center z-10">
        {/* Rotating Earth */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto relative">
            {/* Earth sphere */}
            <div className="w-full h-full bg-gradient-to-br from-green-400 via-blue-500 to-blue-600 rounded-full shadow-2xl animate-spin relative overflow-hidden">
              {/* Continents */}
              <div className="absolute inset-0 rounded-full">
                {/* India highlight */}
                <div className="absolute top-8 right-6 w-3 h-4 bg-orange-400 rounded-sm transform rotate-12 animate-pulse"></div>
                {/* Other continents */}
                <div className="absolute top-4 left-4 w-6 h-8 bg-green-600 rounded-lg opacity-80"></div>
                <div className="absolute bottom-6 left-8 w-8 h-6 bg-green-600 rounded-lg opacity-80"></div>
                <div className="absolute top-12 right-2 w-4 h-6 bg-green-600 rounded-lg opacity-80"></div>
              </div>
              
              {/* Atmosphere glow */}
              <div className="absolute -inset-2 bg-blue-400 rounded-full opacity-20 blur-md"></div>
            </div>
            
            {/* Orbital ring */}
            <div className="absolute -inset-4 border-2 border-blue-300 rounded-full opacity-30 animate-pulse"></div>
          </div>
          
          {/* Water droplets floating around */}
          <div className="absolute -top-4 -left-4">
            <Droplets className="w-6 h-6 text-blue-300 animate-bounce" style={{ animationDelay: '0s' }} />
          </div>
          <div className="absolute -top-2 -right-6">
            <Droplets className="w-4 h-4 text-blue-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
          </div>
          <div className="absolute -bottom-6 -left-2">
            <Droplets className="w-5 h-5 text-teal-300 animate-bounce" style={{ animationDelay: '1s' }} />
          </div>
          <div className="absolute -bottom-4 -right-4">
            <Droplets className="w-4 h-4 text-blue-300 animate-bounce" style={{ animationDelay: '1.5s' }} />
          </div>
        </div>

        {/* Loading text */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white mb-2">
            AquaWatch
          </h1>
          <div className="flex items-center justify-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce bounce-delay-0"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce bounce-delay-200"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce bounce-delay-400"></div>
            </div>
            <span className="text-xl text-blue-200 font-medium">Connecting...</span>
          </div>
          <p className="text-blue-300 text-sm max-w-md mx-auto">
            Initializing water crisis monitoring systems across India
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-8 w-64 mx-auto">
          <div className="w-full bg-blue-800 rounded-full h-1">
            <div className="bg-gradient-to-r from-blue-400 to-teal-400 h-1 rounded-full animate-pulse" 
                 style={{ 
                   animation: 'loading 3s ease-in-out infinite',
                   width: '100%'
                 }}>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes loading {
            0% { width: 0%; }
            50% { width: 70%; }
            100% { width: 100%; }
          }
        `}
      </style>
    </div>
  );
};