import React, { useMemo } from 'react';
import EverythingMarkdown from 'everything-markdown';
import { Book } from 'lucide-react';

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
    <div className="h-full w-full overflow-y-auto scrollbar-hide">
      {latestMarkdownId ? (
        <div className="p-8 pb-14">
          <div className="bg-card/80 rounded-xl border border-white/10 shadow-lg ">
            <div className="p-6 md:p-8">
              <EverythingMarkdown content={markdownContent} />
            </div>
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
