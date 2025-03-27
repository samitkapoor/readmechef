import React, { useMemo } from 'react';
import { Copy } from 'lucide-react';
import EverythingMarkdown from 'everything-markdown';

import ActionButton from '@/components/ui/ActionButton';
import { ClientMessage } from '@/types/ai.types';

interface MarkdownPreviewProps {
  messages: ClientMessage[];
  latestMarkdownId: string | null;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ messages, latestMarkdownId }) => {
  const markdownContent = useMemo(() => {
    if (!latestMarkdownId) return '';

    const message = messages.find((message) => message.id === latestMarkdownId);
    if (!message) return '';

    // Extract content between markdown code blocks if present
    const content = message.display;
    const markdownMatch = content.split('```markdown');
    return markdownMatch.length > 1 ? markdownMatch[1] : content;
  }, [messages, latestMarkdownId]);

  const handleCopyToClipboard = () => {
    const content = messages.find((message) => message.id === latestMarkdownId)?.display || '';
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="overflow-y-auto h-full scrollbar-hide bg-black px-10 relative flex flex-col pb-10">
      <div className="w-full flex items-end justify-between mt-10 text-white/70 text-sm mb-5 px-2">
        <p className="text-xl font-bold text-white">Preview</p>
        <div className="flex items-center justify-end">
          <ActionButton
            icon={<Copy size={20} />}
            onClick={handleCopyToClipboard}
            disabled={!latestMarkdownId}
          >
            Copy
          </ActionButton>
        </div>
      </div>
      <div className="bg-card/50 p-8 rounded-xl">
        {latestMarkdownId && <EverythingMarkdown content={markdownContent} />}
      </div>
    </div>
  );
};

export default MarkdownPreview;
