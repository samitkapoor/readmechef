'use client';

import { useEffect, useState } from 'react';
import { ClientMessage, Repository } from './actions';
import { useActions, useUIState } from 'ai/rsc';
import { generateId } from 'ai';
import Chatbox from '@/components/Chatbox';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function Home() {
  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();

  const params = useParams();
  const { data: session } = useSession();

  const [repository, setRepository] = useState<Repository | null>(null);
  const [firstTime, setFirstTime] = useState<boolean>(true);

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
    setConversation((currentConversation: ClientMessage[]) => [
      ...currentConversation,
      { id: generateId(), role: 'user', display: input }
    ]);

    const message = await continueConversation(input, repository, session?.user?.accessToken);

    setConversation((currentConversation: ClientMessage[]) => [...currentConversation, message]);
  };

  return (
    <div className="mt-20">
      <Chatbox handleSendMessage={handleSendMessage} messages={conversation} />
    </div>
  );
}
