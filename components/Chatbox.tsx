import { CornerDownLeft, Loader } from 'lucide-react';
import React, { useRef, useState, useEffect } from 'react';
import { ClientMessage } from '@/types/ai.types';

const isWindows = navigator.platform.includes('Win');

/**
 * Chatbox component
 * @param handleSendMessage - a function to send a message to the server
 * @param messages - an array of messages to display in the chat
 * @param repository - the current repository
 */
const Chatbox = ({
  handleSendMessage,
  messages
}: {
  handleSendMessage: (message: string) => Promise<void>;
  messages: ClientMessage[];
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (input: string) => {
    setLoading(true);
    await handleSendMessage(input);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      const message = e.currentTarget.value;
      sendMessage(message);
      e.currentTarget.value = '';
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    if (divRef.current && divRef.current.lastChild)
      (divRef.current.lastChild as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const message = (e.currentTarget.previousElementSibling as HTMLTextAreaElement).value;
    sendMessage(message);
    (e.currentTarget.previousElementSibling as HTMLTextAreaElement).value = '';
    scrollToBottom();
  };

  return (
    <div
      style={{ gridTemplateRows: '1fr auto' }}
      className="w-full h-full grid grid-cols-1 relative"
    >
      <div
        ref={divRef}
        className="flex flex-col flex-nowrap pb-6 overflow-y-auto w-full relative scrollbar-hide px-4"
      >
        {/* Messages */}
        {messages.map((message, i) => {
          return (
            <div
              key={message.id}
              className={`mb-6 shrink-0 flex-col flex scrollbar-hide ${
                message.role === 'user' ? 'items-end max-w-full' : 'items-start max-w-full'
              } ${i === 0 && 'mt-[80px]'}`}
            >
              <div className={`text-xs mb-1.5 text-white/60 flex items-center gap-1.5`}>
                <p className="font-medium">{message.role === 'user' ? 'You' : 'ReadmeChef'}</p>
                <div className="h-1 w-1 rounded-full bg-primary/70"></div>
                <p>{message.timestamp}</p>
              </div>

              {message.role === 'user' ? (
                <div className="text-white bg-primary py-3 px-4 rounded-2xl rounded-tr-sm shadow-sm max-w-[65%]">
                  {message.display}
                </div>
              ) : (
                <div className="text-white rounded-2xl rounded-tl-sm w-full py-4 px-5 overflow-x-auto bg-card/80 scrollbar-hide border-[1px] border-white/10 shadow-md max-w-[85%]">
                  <pre className="whitespace-pre-wrap break-words">{message.display}</pre>
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
            boxShadow: '-5px -5px 20px 10px rgba(255, 0, 0, 0.2'
          }}
          className="flex items-end gap-4 rounded-lg bg-gradient-to-r from-transparent to-secondary/20 border-[1px] border-primary/70"
        >
          <textarea
            onKeyDown={handleKeyDown}
            id="message"
            className="w-full m-4 border border-gray-700 resize-none outline-none border-none text-white placeholder-gray-400 h-[100px] bg-transparent scrollbar-hide"
            placeholder="Type your message here..."
          ></textarea>

          <button
            onClick={handleButtonClick}
            className="p-2 px-3 bg-primary text-white rounded-lg m-2 group cursor-pointer flex items-center justify-center hover:bg-secondary transition-all duration-200"
            title={isWindows ? 'Press Ctrl+Enter to send' : 'Press ⌘+Enter to send'}
          >
            {loading ? (
              <Loader className="animate-spin w-5 h-5" />
            ) : (
              <CornerDownLeft
                size={20}
                className="group-hover:scale-110 transition-all duration-200"
              />
            )}
          </button>
        </div>
        <div className="flex justify-center mt-2">
          <p className="text-xs text-white/40">
            {isWindows ? 'Press Ctrl + Enter to send' : 'Press ⌘ + Enter to send'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chatbox;
