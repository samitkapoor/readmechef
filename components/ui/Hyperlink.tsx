import { ArrowUpRight } from 'lucide-react';
import React from 'react';

const Hyperlink = ({
  href,
  prefixIcon,
  text
}: {
  href: string;
  prefixIcon: React.ReactNode;
  text: string;
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="transition-colors flex items-center hover:text-white text-white/70 group hover:border-b-[1px] pt-1"
    >
      {prefixIcon}
      <p className="transition-all group-hover:ml-0.5">{text}</p>
      <ArrowUpRight
        size={18}
        className="group-hover:ml-1 group-hover:rotate-45 transition-all duration-150"
      />
    </a>
  );
};

export default Hyperlink;
