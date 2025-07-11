'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

import Chatbox from '@/components/Chatbox';
import MarkdownPreview from '@/components/MarkdownPreview';
import { useRepository } from '@/hooks/useRepository';
import { useChat } from '@/hooks/useChat';
import Loader from '@/components/ui/Loader';
import { Copy, Download, Eye, MessageCircle } from 'lucide-react';
import ActionButton from '@/components/ui/ActionButton';
import { extractMarkdownContent } from '@/lib/utils';

export const maxDuration = 30;

export default function RepositoryPage() {
  const params = useParams();
  const { data: session } = useSession();
  const repositoryName = params.repoName as string;
  const accessToken = session?.user?.accessToken;

  const { repository, isLoading } = useRepository(
    session?.user?.username || '',
    repositoryName,
    accessToken || '',
    session?.user?.platform || ''
  );
  const { messages, latestMarkdownId, sendMessage } = useChat(repository);

  const [hasRequestedReadme, setHasRequestedReadme] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const mainDivRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement | null>(null);
  const copyBtnRef = useRef<HTMLButtonElement | null>(null);
  const downloadBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (repository && !hasRequestedReadme && !isLoading && !loadingMessage) {
      setLoadingMessage(true);
      sendMessage('Generate a README.md for this repository.').then(() => {
        setLoadingMessage(false);
      });
      setHasRequestedReadme(true);
    }
  }, [repository, hasRequestedReadme, isLoading, sendMessage]);

  useEffect(() => {
    if (mainDivRef.current) {
      mainDivRef.current.focus();
    }
  }, []);

  const handleCopyToClipboard = () => {
    const message = messages.find((message) => message.id === latestMarkdownId);
    if (message) {
      const content = extractMarkdownContent(message.display);
      if (content) {
        navigator.clipboard.writeText(content);
      }
    }
  };

  const handleDownload = () => {
    // Function to download the README.md file
    const message = messages.find((message) => message.id === latestMarkdownId);
    if (message) {
      const content = extractMarkdownContent(message.display);
      if (content) {
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'README.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }
  };

  // Helper function to check if markdown content is available
  const isMarkdownContentAvailable = () => {
    if (!latestMarkdownId) return false;
    const message = messages.find((message) => message.id === latestMarkdownId);
    if (!message) return false;
    const content = extractMarkdownContent(message.display);
    return content.length > 0;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const noModifiers = !event.altKey && !event.shiftKey && !event.metaKey && !event.ctrlKey;

    if (document.activeElement === chatInputRef.current) {
      return;
    }

    if (noModifiers) {
      switch (event.key.toLowerCase()) {
        case 'c':
          if (latestMarkdownId) {
            if (copyBtnRef.current) {
              copyBtnRef.current.click();
            }
          }
          break;
        case 'd':
          if (latestMarkdownId) {
            if (downloadBtnRef.current) {
              downloadBtnRef.current.click();
            }
          }
          break;
        case '/':
          event.preventDefault();
          if (chatInputRef.current) {
            chatInputRef.current.focus();
          }
          break;
        case 'escape':
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
          if (mainDivRef.current) {
            mainDivRef.current.focus();
          }
          break;
      }
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div
      ref={mainDivRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden h-screen outline-none"
    >
      <div className="col-span-2 h-min fixed top-[100px] w-full z-10 pb-2 pointer-events-none">
        <div className="grid grid-cols-2 gap-10 w-full px-8 h-min">
          <div className="hidden lg:flex items-center justify-start pl-5">
            <div className="flex items-start justify-start gap-3 px-2 py-2 backdrop-blur-lg border-[1px] border-white/10 rounded-lg">
              <div className="h-10 w-10 border border-primary/30 rounded-lg flex items-center justify-center shadow-sm shadow-primary/10">
                <MessageCircle size={22} className="text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold text-white tracking-tight">Chat</p>
                <p className="text-sm text-white/60 flex items-center gap-1 leading-none">
                  <span>Working on</span>
                  <span className="text-primary">{repository?.name || 'Repository'}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-between pl-4 pr-7 py-2">
            <div className="flex items-center gap-3 px-2 py-2 backdrop-blur-lg border-[1px] border-white/10 rounded-lg">
              <div className="h-10 w-10 border border-primary/30 rounded-lg flex items-center justify-center shadow-sm shadow-primary/10">
                <Eye size={22} className="text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold text-white tracking-tight">Preview</p>
                <p className="text-sm text-white/60 leading-none">README.md</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex px-2 py-2 backdrop-blur-lg border-[1px] border-white/10 rounded-lg absolute right-16 top-[100px] mr-1 mt-2.5 items-center gap-2">
        <ActionButton
          ref={downloadBtnRef}
          icon={<Download size={18} />}
          onClick={handleDownload}
          disabled={!isMarkdownContentAvailable()}
        >
          Download (D)
        </ActionButton>
        <ActionButton
          ref={copyBtnRef}
          icon={<Copy size={18} />}
          onClick={handleCopyToClipboard}
          disabled={!isMarkdownContentAvailable()}
        >
          Copy (C)
        </ActionButton>
      </div>
      <div className="overflow-y-auto col-span-2 lg:col-span-1 h-full scrollbar-hide md:pr-5 md:pl-10 md:pb-5 bg-background/50">
        <Chatbox
          handleSendMessage={sendMessage}
          messages={messages}
          loading={loadingMessage}
          setLoading={setLoadingMessage}
          chatInputRef={chatInputRef}
        />
      </div>
      <div className="hidden lg:block overflow-hidden pr-8">
        <MarkdownPreview messages={messages} latestMarkdownId={latestMarkdownId} />
      </div>
    </div>
  );
}
