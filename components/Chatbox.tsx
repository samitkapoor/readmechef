import dayjs from 'dayjs';
import { Send } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState, useRef } from 'react';
import { EverythingMarkdown } from 'everything-markdown';

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  private: boolean;
  default_branch: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: number;
  content: string;
  role: 'user' | 'assistant';
  type: 'text' | 'markdown';
}

const Chatbox = ({ repository }: { repository: Repository }) => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [firstTime, setFirstTime] = useState(true);
  const [loading, setLoading] = useState(false);
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false) {
      if (firstTime) {
        const message = 'Generate a README.md file for this repository.';

        handleSendMessage(message);
        setFirstTime(false);
      }

      effectRan.current = true;
    }
  }, []);

  const handleSendMessage = async (message: string) => {
    try {
      setLoading(true);
      const previousConversation = messages;

      setMessages((prev) => {
        if (messages.length + 1 === 1 && messages.length === 0) {
          return [...prev, { id: prev.length + 1, content: message, role: 'user', type: 'text' }];
        } else {
          return [...prev, { id: prev.length + 1, content: message, role: 'user', type: 'text' }];
        }
      });

      const res = await fetch('/api/repo/create-readme', {
        method: 'POST',
        body: JSON.stringify({
          message: message,
          repository,
          accessToken: session?.user?.accessToken,
          previousConversation
        })
      });

      const p = await res.json();

      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, content: p?.message[0].text, role: 'assistant', type: 'markdown' }
      ]);

      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{ gridTemplateRows: '1fr 155px' }}
      className="w-full h-full border-gray-700 grid grid-cols-1 shadow-md relative"
    >
      <div className="flex flex-col flex-nowrap shrink-0 pb-4 overflow-y-auto w-full relative">
        <div className="w-full flex items-center justify-start mt-10 text-white/70 px-4 text-sm mb-1">
          {dayjs().format('DD/MM/YYYY hh:mm:ss A')}
        </div>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded-lg mx-4 mb-4 overflow-x-auto shrink-0 ${
              message.role === 'user'
                ? 'bg-neutral-700/90 ml-auto max-w-[50%]'
                : 'bg-neutral-900/80 max-w-[75%]'
            }`}
          >
            <div className="text-sm font-semibold mb-1 text-gray-900 dark:text-white">
              {message.role === 'user' ? 'You' : 'ReadmeChef'}
            </div>
            {message.type === 'text' && (
              <div className="text-gray-700 dark:text-gray-300">{message.content}</div>
            )}
            {message.type === 'markdown' && (
              <EverythingMarkdown
                content={message.content
                  .split('```markdown')[1]
                  .substring(0, message.content.split('```markdown')[1].length - 4)}
              />
            )}
          </div>
        ))}
        {loading && (
          <div className="text-gray-700 dark:text-gray-300 ml-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-l-2 border-[var(--secondary)]" />
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="border-t-[1px] border-[var(--primary)]/10 p-3 backdrop-blur-3xl sticky bottom-0">
        <div
          style={{
            boxShadow: '-5px -5px 10px 0px rgba(255, 0, 0, 0.15)'
          }}
          className="flex items-end gap-4 rounded-lg backdrop-blur-3xl bg-gradient-to-r from-transparent to-red-900/10 border-[1px] border-[var(--primary)]/70"
        >
          <textarea
            id="message"
            className="w-full m-4 border border-gray-700 resize-none outline-none border-none text-white placeholder-gray-400 h-[100px] bg-transparent"
            placeholder="Type your message here..."
          ></textarea>

          <button
            onClick={(e) => {
              e.preventDefault();
              const message = document.getElementById('message') as HTMLTextAreaElement;
              handleSendMessage(message.value);
              (document.getElementById('message') as HTMLTextAreaElement).value = '';
            }}
            className="p-4 bg-primary text-white rounded-lg hover:bg-secondary transition-colors mr-4 mb-4 group cursor-pointer"
          >
            <Send
              size={20}
              className="group-hover:rotate-45 group-hover:mr-1 transition-all duration-150"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbox;
