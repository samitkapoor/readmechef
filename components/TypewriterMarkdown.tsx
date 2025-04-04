import React, { useState, useEffect, useRef } from 'react';
import EverythingMarkdown from 'everything-markdown';

interface TypewriterMarkdownProps {
  content: string;
  typingSpeed?: number;
  charSpeed?: number;
  className?: string;
}

const TypewriterMarkdown: React.FC<TypewriterMarkdownProps> = ({
  content,
  typingSpeed = 80, // Speed in milliseconds per line
  charSpeed = 10, // Speed in milliseconds per character
  className = ''
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Split content into lines
    const lines = content.split('\n');
    let currentLineIndex = 0;
    const completedLines: string[] = [];
    let currentLine = '';
    let currentCharIndex = 0;
    let timer: NodeJS.Timeout;
    let inCodeBlock = false;

    // Reset when content changes
    setDisplayedContent('');
    setIsComplete(false);

    const typeNextCharacter = () => {
      const lineToType = lines[currentLineIndex];

      if (currentCharIndex < lineToType.length) {
        // Add the next character to the current line
        currentLine += lineToType[currentCharIndex];
        currentCharIndex++;

        // Update the displayed content
        setDisplayedContent([...completedLines, currentLine].join('\n'));

        // Schedule the next character - type code faster
        const speed = inCodeBlock ? charSpeed / 1.5 : charSpeed;
        timer = setTimeout(typeNextCharacter, speed);
      } else {
        // Line complete - move to next line
        completedLines.push(currentLine);
        currentLine = '';
        currentCharIndex = 0;
        currentLineIndex++;

        // Schedule the next line
        typeNextLine();
      }
    };

    const typeNextLine = () => {
      if (currentLineIndex < lines.length) {
        // Calculate delay for the next line
        const nextLine = lines[currentLineIndex];
        let delay = typingSpeed;

        // Check if we're entering or exiting a code block
        if (nextLine.trim().startsWith('```')) {
          inCodeBlock = !inCodeBlock;

          // Add the code block marker
          completedLines.push(nextLine);
          currentLineIndex++;

          if (inCodeBlock) {
            // Starting a code block
            delay = typingSpeed / 2;
          } else {
            // Ending a code block
            delay = typingSpeed;
          }

          timer = setTimeout(typeNextLine, delay);
        }
        // Different timing based on content
        else if (nextLine.trim() === '') {
          // Empty line - add it immediately and continue
          completedLines.push('');
          currentLineIndex++;
          timer = setTimeout(typeNextLine, delay / 4);
        } else if (nextLine === '---') {
          // Horizontal rule - add immediately and continue
          completedLines.push(nextLine);
          currentLineIndex++;
          timer = setTimeout(typeNextLine, delay);
        } else {
          // Start typing characters for this line
          timer = setTimeout(typeNextCharacter, charSpeed);
        }
      } else {
        // All lines complete
        setIsComplete(true);
      }
    };

    // Start the typing effect
    timer = setTimeout(typeNextLine, 500);

    // Cleanup on unmount or content change
    return () => {
      clearTimeout(timer);
    };
  }, [content, typingSpeed, charSpeed]);

  // Auto-scroll to keep the cursor in view
  useEffect(() => {
    if (contentRef.current && !isComplete) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [displayedContent, isComplete]);

  return (
    <div className={`typewriter-container w-full h-full flex flex-col ${className}`}>
      <div ref={contentRef} className="markdown-content relative flex-1 overflow-hidden">
        <div className="prose prose-invert prose-headings:text-white/90 prose-a:text-primary hover:prose-a:text-primary/80 prose-blockquote:border-l-secondary/70 prose-blockquote:text-white/70 max-w-none">
          <EverythingMarkdown className="dark" content={displayedContent} />
        </div>
      </div>
    </div>
  );
};

export default TypewriterMarkdown;
