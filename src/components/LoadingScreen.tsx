import { useEffect, useState } from 'react';
import garrisonLogo from '@/assets/garrison-full-logo.png';

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
          setTimeout(onLoadingComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 transition-opacity duration-500 ${
        progress === 100 ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center space-y-8">
        {/* Logo with spinning border */}
        <div className="relative">
          {/* Animated spinning border */}
          <div className="absolute inset-0 -m-4">
            <svg className="w-40 h-40 animate-spin" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeDasharray="70 200"
                strokeLinecap="round"
                className="opacity-70"
              />
            </svg>
          </div>
          
          {/* Secondary spinning border */}
          <div className="absolute inset-0 -m-4">
            <svg className="w-40 h-40 animate-spin [animation-direction:reverse] [animation-duration:3s]" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeDasharray="30 200"
                strokeLinecap="round"
                className="opacity-40"
              />
            </svg>
          </div>

          {/* Logo with pulse animation */}
          <div className="relative w-32 h-32 animate-pulse [animation-duration:2s]">
            <img
              src={garrisonLogo}
              alt="Garrison Financial Nexus"
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Company name */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground font-poppins animate-fade-in">
            Garrison Financial Nexus
          </h2>
          <p className="text-sm text-muted-foreground animate-fade-in [animation-delay:200ms]">
            Your Gateway To Financial Prosperity
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Loading percentage */}
        <div className="text-sm font-medium text-primary">
          {progress}%
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
