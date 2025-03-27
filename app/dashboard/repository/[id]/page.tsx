'use client';

import { useEffect, useState } from 'react';
import { generateId } from 'ai';
import Chatbox from '@/components/Chatbox';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import EverythingMarkdown from 'everything-markdown';
import { Repository } from '@/types/github.types';
import { ClientMessage } from '@/types/ai.types';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function Home() {
  const params = useParams();
  const { data: session } = useSession();

  const [repository, setRepository] = useState<Repository | null>(null);
  const [firstTime, setFirstTime] = useState<boolean>(true);
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [latestMarkdownId, setLatestMarkdownId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepository = async () => {
      if (!session?.user?.accessToken) return;

      try {
        const res = await fetch(`https://api.github.com/repositories/${params.id}`, {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
            Accept: 'application/vnd.github+json'
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch repository details');
        }

        const data = await res.json();
        setRepository(data);
      } catch (err) {
        console.error('Error fetching repository:', err);
      }
    };

    fetchRepository();
  }, [params.id, session?.user?.accessToken]);

  useEffect(() => {
    if (!repository) return;
    if (!firstTime) return;

    handleSendMessage('Generate a README.md for this repository.');
    setFirstTime(false);
  }, [repository]);

  const handleSendMessage = async (input: string) => {
    setMessages((currentMessages: ClientMessage[]) => [
      ...currentMessages,
      { id: generateId(), role: 'user', display: input }
    ]);

    const response = await fetch('/api/conversation', {
      method: 'POST',
      body: JSON.stringify({
        history: messages,
        input: input,
        repository: repository,
        accessToken: session?.user?.accessToken
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let result = '';
    const newMessageId = generateId();
    setLatestMarkdownId(newMessageId);

    setMessages((currentMessages: ClientMessage[]) => [
      ...currentMessages,
      { id: newMessageId, role: 'assistant', display: result }
    ]);

    if (reader) {
      while (true) {
        const { done, value } = await reader.read(); // Read chunks
        if (done) break;
        result += decoder.decode(value, { stream: true }); // Decode the chunk
        setMessages((currentMessages: ClientMessage[]) => {
          const messageIndex = currentMessages.findIndex((message) => message.id === newMessageId);
          if (messageIndex === -1) return currentMessages;

          // Create a new array with the updated message
          return currentMessages.map((message, index) => {
            if (index === messageIndex) {
              return { ...message, display: result };
            }
            return message;
          });
        });
      }
    }
  };

  return (
    <div className="pt-[70px] grid grid-cols-2 gap-10 overflow-hidden h-screen">
      <div className="overflow-y-auto h-full scrollbar-hide px-5">
        <Chatbox handleSendMessage={handleSendMessage} messages={messages} />
      </div>
      <div className="overflow-y-auto h-full py-10 scrollbar-hide bg-black px-5">
        {latestMarkdownId && (
          <EverythingMarkdown
            content={
              messages
                .find((message) => message.id === latestMarkdownId)
                ?.display.split('```markdown')[1] || ''
            }
          />
        )}
      </div>
    </div>
  );
}
