import { useEffect, useState } from 'react';
import garrisonLogo from '@/assets/garrison-logo-icon.png';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          onLoadingComplete();
          return 100;
        }
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div
      className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center"
      style={{
        background: '#399B53',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <div className="flex flex-col items-center space-y-10">
        {/* Advanced multi-layer spinning rings */}
        <div className="relative">
          {/* Outer spinning ring with gradient */}
          <div className="absolute inset-0 -m-6">
            <svg className="w-56 h-56 animate-spin [animation-duration:3s]" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0.2 }} />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#grad1)"
                strokeWidth="2"
                strokeDasharray="90 200"
                strokeLinecap="round"
              />
            </svg>
          </div>
          
          {/* Middle spinning ring - reverse direction */}
          <div className="absolute inset-0 -m-6">
            <svg className="w-56 h-56 animate-spin [animation-direction:reverse] [animation-duration:4s]" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(255, 255, 255, 0.5)"
                strokeWidth="1.5"
                strokeDasharray="60 150"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Inner spinning ring */}
          <div className="absolute inset-0 -m-6">
            <svg className="w-56 h-56 animate-spin [animation-duration:2s]" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="35"
                fill="none"
                stroke="rgba(255, 255, 255, 0.7)"
                strokeWidth="2.5"
                strokeDasharray="40 180"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Pulsing glow effect behind logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 bg-white/20 rounded-full animate-pulse [animation-duration:2s] blur-xl"></div>
          </div>

          {/* Logo with scale and rotation animation */}
          <div className="relative w-44 h-44 flex items-center justify-center animate-[scale-in_1s_ease-out,pulse_3s_ease-in-out_infinite]">
            <div className="w-36 h-36 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <img
                src={garrisonLogo}
                alt="Garrison Financial Nexus"
                className="w-32 h-32 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Company name with staggered fade-in */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-white font-poppins animate-fade-in [animation-delay:300ms] tracking-wide drop-shadow-lg">
            Garrison Financial Nexus
          </h2>
          <p className="text-base text-white/90 animate-fade-in [animation-delay:600ms] font-medium tracking-wider">
            Your Gateway To Financial Prosperity
          </p>
        </div>

        {/* Advanced progress bar with glow */}
        <div className="w-80 space-y-3">
          <div className="relative h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            {/* Glow effect */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-all duration-300"
              style={{ 
                width: `${progress}%`,
                filter: 'blur(8px)'
              }}
            />
            {/* Main progress bar */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/80 transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Loading percentage and text */}
          <div className="flex items-center justify-between text-white">
            <span className="text-sm font-medium animate-pulse">Loading...</span>
            <span className="text-lg font-bold tracking-wider">{progress}%</span>
          </div>
        </div>

        {/* Animated dots */}
        <div className="flex space-x-2 animate-fade-in [animation-delay:900ms]">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:0ms]"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:150ms]"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:300ms]"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
