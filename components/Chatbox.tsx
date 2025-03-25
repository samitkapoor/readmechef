import dayjs from 'dayjs';
import { Send } from 'lucide-react';
import React from 'react';
import { ClientMessage } from '../app/dashboard/repository/[id]/actions';

// interface Repository {
//   id: number;
//   name: string;
//   full_name: string;
//   description: string | null;
//   language: string | null;
//   stargazers_count: number;
//   forks_count: number;
//   watchers_count: number;
//   private: boolean;
//   default_branch: string;
//   owner: {
//     login: string;
//     avatar_url: string;
//   };
//   html_url: string;
//   created_at: string;
//   updated_at: string;
// }

const Chatbox = ({
  handleSendMessage,
  messages
}: {
  handleSendMessage: (message: string) => Promise<void>;
  messages: ClientMessage[];
}) => {
  return (
    <div
      style={{ gridTemplateRows: '1fr 155px' }}
      className="w-full h-full border-gray-700 grid grid-cols-1 shadow-md relative"
    >
      <div className="flex flex-col flex-nowrap shrink-0 pb-4 overflow-y-auto w-full relative">
        <div className="w-full flex items-center justify-start mt-10 text-white/70 px-4 text-sm mb-1">
          {dayjs().format('DD/MM/YYYY hh:mm:ss A')}
        </div>
        {messages.map((message) => {
          console.log({ message });
          return (
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

              {message.role === 'user' ? (
                <div className="text-gray-700 dark:text-gray-300">{message.display}</div>
              ) : (
                <div>
                  <pre>{message.display}</pre>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Chat Input */}
      <div className="border-t-[1px] border-primary/10 p-3 backdrop-blur-3xl sticky bottom-0">
        <div
          style={{
            boxShadow: '-5px -5px 10px 0px rgba(255, 0, 0, 0.15)'
          }}
          className="flex items-end gap-4 rounded-lg backdrop-blur-3xl bg-gradient-to-r from-transparent to-red-900/10 border-[1px] border-primary/70"
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
