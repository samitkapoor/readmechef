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

export const maxDuration = 30;

export default function RepositoryPage() {
  const params = useParams();
  const { data: session } = useSession();
  const repositoryName = params.repoName as string;
  const accessToken = session?.user?.accessToken;

  const { repository, isLoading } = useRepository(
    session?.user?.username || '',
    repositoryName,
    accessToken || ''
  );
  const { messages, latestMarkdownId, sendMessage } = useChat(repository);

  const [hasRequestedReadme, setHasRequestedReadme] = useState(false);

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden h-screen">
      <div className="col-span-2 h-min fixed top-[100px] w-full z-10 pb-2">
        <div className="grid grid-cols-2 gap-10 w-full px-10 h-min">
          <div className="hidden md:flex items-start justify-start pl-5">
            <div className="flex items-start justify-start gap-3 px-2 py-2 backdrop-blur-lg border-[1px] border-white/10 rounded-lg">
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
          </div>

          <div className="hidden md:flex items-center justify-between pl-4 pr-7 py-2">
            <div className="flex items-center gap-3 px-2 py-2 backdrop-blur-lg border-[1px] border-white/10 rounded-lg">
              <div className="h-10 w-10 border border-primary/30 rounded-lg flex items-center justify-center shadow-sm shadow-primary/10">
                <Eye size={22} className="text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">Preview</h1>
                <p className="text-sm text-white/60 leading-none">README.md</p>
              </div>
            </div>
            <div className="px-2 py-2 backdrop-blur-lg border-[1px] border-white/10 rounded-lg">
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
      </div>
      <div className="overflow-y-auto h-full scrollbar-hide md:pr-5 md:pl-10 md:pb-5 bg-background/50">
        <Chatbox handleSendMessage={sendMessage} messages={messages} />
      </div>
      <div className="hidden md:block overflow-hidden pr-8">
        <MarkdownPreview messages={messages} latestMarkdownId={latestMarkdownId} />
      </div>
    </div>
  );
}
