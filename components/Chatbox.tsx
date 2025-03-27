import { Command, CornerDownLeft, Dot } from 'lucide-react';
import React, { useRef } from 'react';
import { ClientMessage } from '@/types/ai.types';
import { Repository } from '@/types/github.types';

const Chatbox = ({
  handleSendMessage,
  messages,
  repository
}: {
  handleSendMessage: (message: string) => Promise<void>;
  messages: ClientMessage[];
  repository: Repository | null;
}) => {
  const divRef = useRef<HTMLDivElement>(null);

  return (
    <div
      style={{ gridTemplateRows: '1fr 155px' }}
      className="w-full h-full border-gray-700 grid grid-cols-1 shadow-md relative"
    >
      <div
        ref={divRef}
        className="flex flex-col flex-nowrap shrink-0 pb-4 overflow-y-auto w-full relative scrollbar-hide px-1"
      >
        <div className="w-full flex items-start justify-start mt-10 text-white/70 text-sm mb-1 flex-col">
          <p className="text-xl font-bold text-white">Chat</p>
          <p className="text-sm">
            Currently working on <span className="text-white">{repository?.name}</span>
          </p>
        </div>
        {messages.map((message) => {
          return (
            <div
              key={message.id}
              className={`rounded-lg mb-4 shrink-0 flex-col flex scrollbar-hide ${
                message.role === 'user' ? 'ml-auto max-w-[65%]' : 'max-w-[85%]'
              }`}
            >
              <div
                className={`text-sm mb-1 text-gray-300 flex items-center ${
                  message.role === 'user' ? 'ml-auto' : ''
                }`}
              >
                <p>{message.role === 'user' ? 'You' : 'ReadmeChef'}</p>
                <Dot />
                <p>{message.timestamp}</p>
              </div>

              {message.role === 'user' ? (
                <div className="text-white bg-primary py-3 px-4 rounded-lg">{message.display}</div>
              ) : (
                <div className="text-white rounded-lg w-full py-3 px-4 overflow-x-auto bg-card/80 scrollbar-hide border-[1px] border-white/5">
                  <pre>{message.display}</pre>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Chat Input */}
      <div className="sticky bottom-0 py-2">
        <div
          style={{
            boxShadow: '-5px -5px 10px 0px rgba(255, 0, 0, 0.15)'
          }}
          className="flex items-end gap-4 rounded-lg bg-gradient-to-r from-transparent to-secondary/20 border-[1px] border-primary/70"
        >
          <textarea
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                const message = document.getElementById('message') as HTMLTextAreaElement;
                handleSendMessage(message.value);
                (document.getElementById('message') as HTMLTextAreaElement).value = '';
                setTimeout(() => {
                  if (divRef.current && divRef.current.lastChild)
                    (divRef.current.lastChild as HTMLElement).scrollIntoView({
                      behavior: 'smooth'
                    });
                }, 1000);
              }
            }}
            id="message"
            className="w-full m-4 border border-gray-700 resize-none outline-none border-none text-white placeholder-gray-400 h-[100px] bg-transparent scrollbar-hide"
            placeholder="Type your message here..."
          ></textarea>

          <button
            onClick={(e) => {
              e.preventDefault();
              const message = document.getElementById('message') as HTMLTextAreaElement;
              handleSendMessage(message.value);
              (document.getElementById('message') as HTMLTextAreaElement).value = '';
              if (divRef.current)
                divRef.current.scrollTo({
                  top: divRef.current.scrollHeight,
                  behavior: 'smooth'
                });
            }}
            className="p-4 bg-primary text-white rounded-lg hover:bg-secondary transition-colors mr-4 mb-4 group cursor-pointer flex items-center whitespace-nowrap gap-1"
          >
            {navigator.platform.includes('Win') ? (
              <span className="group-hover:rotate-12 transition-all duration-150 text-xs">
                CTRL
              </span>
            ) : (
              <Command size={20} className="group-hover:rotate-12 transition-all duration-150" />
            )}
            <CornerDownLeft
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
