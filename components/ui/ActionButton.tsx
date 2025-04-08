'use client';

import { Check } from 'lucide-react';
import React, { ButtonHTMLAttributes, useState } from 'react';

type ActionButtonProps = {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
  ref?: React.RefObject<HTMLButtonElement | null>;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const ActionButton = ({ icon, ref, children, onClick, ...props }: ActionButtonProps) => {
  const [clicked, setClicked] = useState(false);
  return (
    <button
      ref={ref}
      {...props}
      onClick={() => {
        onClick();
        setClicked(true);
        setTimeout(() => {
          setClicked(false);
        }, 2000);
      }}
      className="flex items-center gap-2 border bg-primary/10 border-primary/50 rounded-md px-3 py-2 text-primary hover:border-primary disabled:border-gray-700 disabled:cursor-not-allowed disabled:text-gray-700 disabled:bg-black transition-all cursor-pointer"
    >
      {clicked ? <Check size={20} /> : icon} <div className="hidden xl:block">{children}</div>
    </button>
  );
};

export default ActionButton;
