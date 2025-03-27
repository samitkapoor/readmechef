'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

import Chatbox from '@/components/Chatbox';
import MarkdownPreview from '@/components/MarkdownPreview';
import { useRepository } from '@/hooks/useRepository';
import { useChat } from '@/hooks/useChat';

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

  return (
    <div className="pt-[70px] grid grid-cols-2 gap-0 overflow-hidden h-screen bg-black">
      <div className="overflow-y-auto h-full scrollbar-hide pr-5 pl-10 pb-5 bg-background/50">
        <Chatbox
          handleSendMessage={sendMessage}
          messages={messages}
          repository={repository}
        />
      </div>
      <MarkdownPreview 
        messages={messages}
        latestMarkdownId={latestMarkdownId}
      />
    </div>
  );
}
