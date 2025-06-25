import React, { useEffect, useState } from 'react';
import { Book } from 'lucide-react';

import { ClientMessage } from '@/types/ai.types';
import RenderMarkdown from './RenderMarkdown';
import { extractMarkdownContent } from '@/lib/utils';

interface MarkdownPreviewProps {
  messages: ClientMessage[];
  latestMarkdownId: string | null;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ messages, latestMarkdownId }) => {
  const [markdownContent, setMarkdownContent] = useState('');

  useEffect(() => {
    if (!latestMarkdownId) return;

    const message = messages.find((message) => message.id === latestMarkdownId);
    if (!message) return;

    // Extract content using the new utility function that handles both formats
    const content = extractMarkdownContent(message.display);
    setMarkdownContent(content);
  }, [messages, latestMarkdownId]);

  return (
    <div className="h-full w-full overflow-y-auto scrollbar-hide">
      {latestMarkdownId && markdownContent ? (
        <div className="p-8 pb-14 pt-[80px]">
          <div className="bg-[#181818] rounded-xl p-8 border border-white/50 shadow-lg mt-[140px]">
            <RenderMarkdown markdown={markdownContent} />
          </div>
        </div>
      ) : (
        <div className="flex items-start pt-40 justify-center h-full">
          <div className="text-center p-8 max-w-md">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Book className="text-primary w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">README Preview</h3>
            <p className="text-white/60 text-sm">
              Your generated README will appear here. Start a conversation to generate content.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkdownPreview;
