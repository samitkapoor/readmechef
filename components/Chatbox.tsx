import { useSession } from 'next-auth/react';
import React, { MouseEventHandler } from 'react';

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

const Chatbox = ({ repository }: { repository: Repository }) => {
  const { data: session } = useSession();
  const messages = [
    {
      id: 1,
      content: 'Generate a README.md file for this repository.',
      role: 'user'
    },
    {
      id: 2,
      content: 'Here is the README.md file for this repository.',
      role: 'assistant'
    }
  ];

  const handleSendMessage: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    const message = document.getElementById('message') as HTMLTextAreaElement;

    fetch('/api/repo/create-readme', {
      method: 'POST',
      body: JSON.stringify({
        message: message.value,
        repository,
        accessToken: session?.user?.accessToken
      })
    });
  };

  return (
    <div className="w-full h-full border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col bg-white dark:bg-slate-800 shadow-md">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 p-3 rounded-lg max-w-[80%] ${
              message.role === 'user'
                ? 'bg-amber-50 dark:bg-amber-900/30 ml-auto'
                : 'bg-gray-50 dark:bg-slate-700'
            }`}
          >
            <div className="text-sm font-semibold mb-1 text-gray-900 dark:text-white">
              {message.role === 'user' ? 'You' : 'ReadmeChef'}
            </div>
            <div className="text-gray-700 dark:text-gray-300">{message.content}</div>
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
            onClick={handleSendMessage}
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
