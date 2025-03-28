'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

import Chatbox from '@/components/Chatbox';
import MarkdownPreview from '@/components/MarkdownPreview';
import { useRepository } from '@/hooks/useRepository';
import { useChat } from '@/hooks/useChat';
import { Copy, Eye, MessageCircle } from 'lucide-react';
import ActionButton from '@/components/ui/ActionButton';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function RepositoryPage() {
  const params = useParams();
  const { data: session } = useSession();
  const repositoryId = params.id as string;
  const accessToken = session?.user?.accessToken;

  // Custom hooks for repository data and chat functionality
  const { repository, isLoading } = useRepository(repositoryId, accessToken || '');
  const { messages, latestMarkdownId, sendMessage } = useChat(repository, accessToken);

  // State to track if initial README generation has been requested
  const [hasRequestedReadme, setHasRequestedReadme] = useState(false);

  // Auto-generate README when repository data is loaded
  useEffect(() => {
    if (repository && !hasRequestedReadme && !isLoading) {
      sendMessage('Generate a README.md for this repository.');
      setHasRequestedReadme(true);
    }
  }, [repository, hasRequestedReadme, isLoading, sendMessage]);

  const handleCopyToClipboard = () => {
    const content = messages.find((message) => message.id === latestMarkdownId)?.display || '';
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="pt-[70px] grid grid-cols-2 gap-0 overflow-hidden h-screen bg-black">
      <div className="col-span-2 h-min fixed top-[70px] w-full z-10">
        <div className="grid grid-cols-2 gap-10 w-full px-6 h-min">
          <div className="flex items-center gap-3 px-5 bg-gradient-to-r from-black to-transparent backdrop-blur-sm py-2">
            <div className="h-10 w-10 border border-primary/30 rounded-lg flex items-center justify-center shadow-sm shadow-primary/10">
              <MessageCircle size={22} className="text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">Chat</h1>
              <p className="text-sm text-white/60 flex items-center gap-1 leading-none">
                <span>Working on</span>
                <span className="text-primary">{repository?.name || 'Repository'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between px-5 bg-gradient-to-r from-black via-transparent to-black backdrop-blur-sm py-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 border border-primary/30 rounded-lg flex items-center justify-center shadow-sm shadow-primary/10">
                <Eye size={22} className="text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">Preview</h1>
                <p className="text-sm text-white/60 leading-none">README.md</p>
              </div>
            </div>
            <ActionButton
              icon={<Copy size={18} />}
              onClick={handleCopyToClipboard}
              disabled={!latestMarkdownId}
            >
              Copy
            </ActionButton>
          </div>
        </div>
      </div>
      <div className="overflow-y-auto h-full scrollbar-hide pr-5 pl-10 pb-5 bg-background/50">
        <Chatbox handleSendMessage={sendMessage} messages={messages} />
      </div>
      <MarkdownPreview messages={messages} latestMarkdownId={latestMarkdownId} />
    </div>
  );
}
