'use client';

import { Check } from 'lucide-react';
import React, { ButtonHTMLAttributes, useState } from 'react';

type ActionButtonProps = {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const ActionButton = ({ icon, children, onClick, ...props }: ActionButtonProps) => {
  const [clicked, setClicked] = useState(false);
  return (
    <button
      {...props}
      onClick={() => {
        onClick();
        setClicked(true);
        setTimeout(() => {
          setClicked(false);
        }, 2000);
      }}
      className="flex items-center gap-2 border border-white/20 rounded-md px-3 py-2 hover:text-white hover:border-white transition-all cursor-pointer"
    >
      {clicked ? <Check size={20} /> : icon} {children}
    </button>
  );
};

export default ActionButton;
