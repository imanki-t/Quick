import { useState, useRef, useLayoutEffect, ReactNode } from 'react';
import { cn } from '../utils/cn';

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  className?: string;
}

export function Tooltip({ children, content, className }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (isOpen && tooltipRef.current) {
      const padding = 12; // Safety margin from screen edge
      
      // Reset position first to get natural coordinates
      tooltipRef.current.style.left = '50%';
      tooltipRef.current.style.right = 'auto';
      tooltipRef.current.style.transform = 'translateX(-50%)';

      const rect = tooltipRef.current.getBoundingClientRect();

      // Adjust if overflowing the right edge
      if (rect.right > window.innerWidth - padding) {
        tooltipRef.current.style.left = 'auto';
        tooltipRef.current.style.right = '0';
        tooltipRef.current.style.transform = 'none';
      } 
      // Adjust if overflowing the left edge
      else if (rect.left < padding) {
        tooltipRef.current.style.left = '0';
        tooltipRef.current.style.right = 'auto';
        tooltipRef.current.style.transform = 'none';
      }
    }
  }, [isOpen]);

  return (
    <div
      className="relative flex items-center justify-center cursor-pointer"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen(!isOpen)}
    >
      {children}
      {isOpen && (
        <div
          ref={tooltipRef}
          className={cn(
            "absolute bottom-full mb-2 z-50 w-max max-w-[90vw] whitespace-normal rounded-md bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-100 shadow-md dark:bg-zinc-100 dark:text-zinc-900",
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}

export default Tooltip;
