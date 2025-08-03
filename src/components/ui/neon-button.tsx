
import React from 'react';
import { cn } from '@/lib/utils';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'secondary';
}

const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, children, variant = 'default', ...props }, ref) => {
    const baseClasses = "relative overflow-hidden px-8 py-3 font-semibold text-white rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const variantClasses = {
      default: "bg-garrison-green hover:bg-green-600 focus:ring-garrison-green shadow-[0_0_20px_rgba(57,155,83,0.3)] hover:shadow-[0_0_30px_rgba(57,155,83,0.6)]",
      secondary: "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 shadow-[0_0_20px_rgba(107,114,128,0.3)] hover:shadow-[0_0_30px_rgba(107,114,128,0.6)]"
    };

    return (
      <>
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes shine {
              0% { transform: translateX(-100%) skewX(-25deg); }
              100% { transform: translateX(400%) skewX(-25deg); }
            }
            
            .animate-shine {
              animation: shine 2s infinite linear;
            }
          `
        }} />
        <button
          className={cn(baseClasses, variantClasses[variant], className)}
          ref={ref}
          {...props}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {children}
          </span>
          
          {/* Moving light effect */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent w-1/4 h-full animate-shine" />
          </div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-garrison-green/20 via-garrison-green/40 to-garrison-green/20 animate-pulse" />
        </button>
      </>
    );
  }
);

NeonButton.displayName = "NeonButton";

export { NeonButton };
