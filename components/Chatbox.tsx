import { CornerDownLeft, Loader } from 'lucide-react';
import React, { useRef, useEffect, RefObject } from 'react';
import { ClientMessage } from '@/types/ai.types';
import ShinyText from './ui/ShinyText';
import CopyButton from './ui/CopyButton';
import HintText from './ui/HintText';
import RenderMarkdown from './RenderMarkdown';
import { extractExplanatoryText } from '@/lib/utils';

const isWindows = navigator.platform.includes('Win');

const Chatbox = ({
  handleSendMessage,
  messages,
  loading,
  setLoading,
  chatInputRef
}: {
  handleSendMessage: (message: string) => Promise<void>;
  messages: ClientMessage[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  chatInputRef?: RefObject<HTMLTextAreaElement | null>;
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
              } ${i === 0 ? 'mt-[170px]' : 'mt-[0px]'}`}
            >
              <div className={`text-xs mb-1.5 text-white/40 flex font-light items-center gap-1.5`}>
                <p>{message.role === 'user' ? 'You' : 'ReadmeChef'}</p>
                <div className="h-1 w-1 rounded-full bg-primary/70"></div>
                <p>{message.timestamp}</p>
              </div>

              {message.role === 'user' ? (
                <div className="group flex flex-col max-w-[65%] w-full items-end justify-end">
                  <div className="flex flex-col items-end justify-end">
                    <div className="text-white bg-[#198d49] py-4 px-5 rounded-2xl rounded-tr-sm shadow-sm text-xs md:text-[15px] tracking-tight">
                      {message.display}
                    </div>
                    <div className="group-hover:opacity-100 opacity-0 transition-opacity duration-200 flex items-center justify-end gap-2 mr-1 mt-1">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(message.display);
                        }}
                        className="text-white/40 text-xs hover:underline"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="hidden lg:block text-white group rounded-2xl rounded-tl-sm text-xs p-6 md:text-sm w-full overflow-x-auto bg-[#151515] scrollbar-hide border-[1px] border-white/20 shadow-md max-w-[85%] tracking-tight relative">
                    <CopyButton text={message.display} />

                    <RenderMarkdown markdown={extractExplanatoryText(message.display, false)} />
                  </div>

                  <div className="block lg:hidden text-white group rounded-2xl rounded-tl-sm text-xs p-6 md:text-sm w-full overflow-x-auto bg-[#151515] scrollbar-hide border-[1px] border-white/20 shadow-md max-w-[85%] tracking-tight relative">
                    <CopyButton text={message.display} />

                    <RenderMarkdown markdown={extractExplanatoryText(message.display, true)} />
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
        <div className="flex items-end gap-4 rounded-lg bg-[#222222] border-[1px] border-white/40 relative">
          <textarea
            ref={chatInputRef}
            onKeyDown={handleKeyDown}
            id="message"
            className="w-full m-4 border border-gray-700 resize-none outline-none border-none text-white placeholder-gray-400 h-[80px] bg-transparent scrollbar-hide"
            placeholder={'Type a message...'}
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
        <div className="flex justify-between mt-1">
          <HintText text={'Press /'} />
          <HintText text={isWindows ? 'Press CTRL + Enter to send' : 'Press ⌘ + Enter to send'} />
        </div>
      </div>
    </div>
  );
};

export default Chatbox;
