import { useSession } from 'next-auth/react';
import React, { MouseEventHandler, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
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

  useEffect(() => {
    const message = 'Generate a README.md file for this repository.';

    handleSendMessage(message);
  }, []);

  const handleSendMessage = async (message: string) => {
    try {
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, content: message, role: 'user', type: 'text' }
      ]);

      const res = await fetch('/api/repo/create-readme', {
        method: 'POST',
        body: JSON.stringify({
          message: message,
          repository,
          accessToken: session?.user?.accessToken
        })
      });

      const p = await res.json();

      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, content: p?.message[0].text, role: 'assistant', type: 'markdown' }
      ]);

      console.log(p);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full h-full border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col bg-white dark:bg-slate-800 shadow-md">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 p-3 rounded-lg max-w-[80%] overflow-x-auto ${
              message.role === 'user'
                ? 'bg-amber-50 dark:bg-amber-900/30 ml-auto'
                : 'bg-gray-50 dark:bg-slate-700'
            }`}
          >
            <div className="text-sm font-semibold mb-1 text-gray-900 dark:text-white">
              {message.role === 'user' ? 'You' : 'ReadmeChef'}
            </div>
            {message.type === 'text' && (
              <div className="text-gray-700 dark:text-gray-300">{message.content}</div>
            )}
            {message.type === 'markdown' && <ReactMarkdown>{message.content}</ReactMarkdown>}
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 p-3">
        <textarea
          id="message"
          className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          placeholder="Type your message here..."
          rows={3}
        ></textarea>
        <div className="mt-2 flex justify-end">
          <button
            onClick={(e) => {
              e.preventDefault();
              const message = document.getElementById('message') as HTMLTextAreaElement;
              handleSendMessage(message.value);
            }}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 dark:hover:bg-amber-400 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbox;
