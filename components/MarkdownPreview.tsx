import React, { useMemo } from 'react';
import EverythingMarkdown from 'everything-markdown';

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

  return (
    <div className="overflow-y-auto h-full scrollbar-hide bg-black px-10 relative flex flex-col pb-10">
      <div className="bg-card/50 p-8 rounded-xl">
        {latestMarkdownId && <EverythingMarkdown content={markdownContent} />}
      </div>
    </div>
  );
};

export default MarkdownPreview;
