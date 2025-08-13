// src/components/LoadingSpinner.tsx
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-2',
  xl: 'h-12 w-12 border-4',
};

export default function LoadingSpinner({ 
  size = 'md', 
  className,
  text 
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={cn(
          'animate-spin rounded-full border-solid border-purple-600 border-t-transparent',
          sizeClasses[size],
          className
        )}
      />
      {text && (
        <p className="text-sm text-gray-600 font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}