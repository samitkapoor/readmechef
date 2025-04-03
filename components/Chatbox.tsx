import { CornerDownLeft, Loader } from 'lucide-react';
import React, { useRef, useEffect } from 'react';
import { ClientMessage } from '@/types/ai.types';
import ShinyText from './ui/ShinyText';
import CopyButton from './ui/CopyButton';
import EverythingMarkdown from 'everything-markdown';

const isWindows = navigator.platform.includes('Win');

const Chatbox = ({
  handleSendMessage,
  messages,
  loading,
  setLoading
}: {
  handleSendMessage: (message: string) => Promise<void>;
  messages: ClientMessage[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
}) => {
  const divRef = useRef<HTMLDivElement>(null);

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
        {messages.map((message, i) => {
          return (
            <div
              key={message.id}
              className={`mb-6 shrink-0 flex-col flex scrollbar-hide ${
                message.role === 'user' ? 'items-end max-w-full' : 'items-start max-w-full'
              } ${i === 0 ? 'mt-[170px]' : 'mt-[16px]'}`}
            >
              <div className={`text-xs mb-1.5 text-white/40 flex font-light items-center gap-1.5`}>
                <p>{message.role === 'user' ? 'You' : 'ReadmeChef'}</p>
                <div className="h-1 w-1 rounded-full bg-primary/70"></div>
                <p>{message.timestamp}</p>
              </div>

              {message.role === 'user' ? (
                <div className="text-white bg-[#198d49] py-4 px-5 rounded-2xl rounded-tr-sm shadow-sm max-w-[65%] text-xs md:text-[15px] tracking-tight">
                  {message.display}
                </div>
              ) : (
                <>
                  <div className="text-white rounded-2xl rounded-tl-sm text-xs md:text-sm w-full py-5 px-2 sm:px-0 overflow-x-auto bg-[#151515] scrollbar-hide border-[1px] border-white/20 shadow-md max-w-[85%] tracking-tight relative">
                    <CopyButton text={message.display} />
                    <EverythingMarkdown
                      content={
                        message.display.startsWith('```markdown')
                          ? message.display.replace('```markdown', '').replace('```markdown', '')
                          : message.display
                      }
                      className="dark"
                    />
                  </div>
                </>
              )}
            </div>
          );
        })}
        {loading && (
          <div className="text-white rounded-2xl rounded-tl-sm text-xs md:text-sm w-full pb-3 px-2 scrollbar-hide tracking-tight">
            <ShinyText text="Generating..." speed={1} />
          </div>
        )}
      </div>

      <div className="sticky bottom-0 py-0 px-2">
        <div className="flex items-end gap-4 rounded-lg bg-[#222222] border-[1px] border-white/40">
          <textarea
            onKeyDown={handleKeyDown}
            id="message"
            className="w-full m-4 border border-gray-700 resize-none outline-none border-none text-white placeholder-gray-400 h-[80px] bg-transparent scrollbar-hide rounded-lg"
            placeholder="Type your message here..."
          ></textarea>

          <button
            onClick={handleButtonClick}
            className="px-2 py-2 bg-[#198d49] text-white rounded-lg m-2 group cursor-pointer flex items-center justify-center transition-all duration-200"
            title={isWindows ? 'Press Ctrl+Enter to send' : 'Press ⌘+Enter to send'}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center h-5 w-5">
                <Loader className="animate-spin" />
              </div>
            ) : (
              <CornerDownLeft
                size={24}
                className="group-hover:rotate-90 transition-all duration-200"
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
