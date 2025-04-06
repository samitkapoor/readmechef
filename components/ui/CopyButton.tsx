import { Check, Copy } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const CopyButton = ({ text }: { text: string }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 1000);
    }
  }, [copied]);

  return (
    <button
      onClick={handleCopy}
      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-3 right-3 text-white/40 border-[1px] border-white/20 rounded-lg p-2 hover:text-white/80 hover:border-white/50 backdrop-blur-md"
    >
      {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
    </button>
  );
};

export default CopyButton;
