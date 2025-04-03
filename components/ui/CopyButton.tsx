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
      className="absolute top-4 right-4 text-white/40 border-[1px] border-white/5 rounded-full p-2 hover:text-white/80 hover:border-white/20"
    >
      {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
    </button>
  );
};

export default CopyButton;
