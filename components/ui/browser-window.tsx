import React from 'react';
import { motion } from 'framer-motion';

type BrowserWindowProps = {
  children: React.ReactNode;
  url?: string;
  className?: string;
  childrenClassName?: string;
  ref?: React.RefObject<HTMLDivElement | null>;
} & React.HTMLAttributes<HTMLDivElement>;

const BrowserWindow: React.FC<BrowserWindowProps> = ({
  children,
  url,
  className,
  childrenClassName,
  ref,
  ...props
}) => {
  return (
    <div
      ref={ref}
      className={`flex flex-col items-center justify-center overflow-hidden border border-primary/30 rounded-ss-lg rounded-se-lg shadow-lg bg-neutral-900 h-full w-full relative backdrop-blur-md ${className}`}
      {...props}
    >
      {/* Browser Header */}
      <div className="flex items-center px-4 py-2 bg-card border-b border-primary/20 w-full">
        {/* Traffic Light Buttons */}
        <div className="flex space-x-2">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-3 h-3 rounded-full bg-error cursor-pointer"
          />
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-3 h-3 rounded-full bg-warning cursor-pointer"
          />
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-3 h-3 rounded-full bg-success cursor-pointer"
          />
        </div>

        {/* URL Bar */}
        <div className="flex-1 mx-4">
          <div className="h-6 bg-background/80 rounded-md w-full flex items-center justify-center px-3 border border-primary/20">
            <p className="text-xs text-text/80">{url}</p>
          </div>
        </div>
      </div>

      {/* Browser Content */}
      <div className={`w-full flex-1 flex items-center justify-center ${childrenClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default BrowserWindow;
