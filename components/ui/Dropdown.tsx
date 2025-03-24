'use client';

import { DropdownProps } from '@/types/component.types';
import { Check, ChevronDown, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

const Dropdown = ({ options, value, onChange, optionsHeading, placeholder }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative select-none">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={twMerge(
          'w-full px-3 py-1 text-sm rounded-md border border-gray-700 bg-[var(--card)] text-white focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer flex items-center gap-1',
          isOpen && 'ring-2 ring-secondary'
        )}
      >
        <p>{placeholder}</p>
        <ChevronDown size={14} />
      </div>
      {isOpen && (
        <div className="flex flex-col absolute top-full right-0 mt-2 rounded-md overflow-hidden bg-gray-700 border-[1px] border-gray-700 gap-[1px] w-[275px]">
          <div className="px-3 py-2 flex items-center justify-between bg-[var(--card)] font-semibold">
            <p className="text-sm text-white ">{optionsHeading}</p>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="cursor-pointer hover:brightness-110"
            >
              <X size={14} />
            </button>
          </div>
          {options.map((option) => (
            <div
              onClick={() => {
                onChange(option.value);
              }}
              className="w-full px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer bg-[var(--card)] hover:bg-[var(--card)]/70 flex items-center gap-2"
              key={option.value}
            >
              {value === option.value ? (
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="cursor-pointer hover:brightness-110"
                >
                  <Check size={14} />
                </button>
              ) : (
                <div className="">
                  <Check size={14} className="opacity-0" />
                </div>
              )}
              <p className="text-xs text-white ">{option.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
