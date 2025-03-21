import React from 'react';
import { CodeBlock } from 'react-code-block';

// Define types for markdown tokens
interface MarkdownToken {
  type:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'ul'
    | 'ol'
    | 'li'
    | 'hr'
    | 'codeblock'
    | 'p'
    | 'blockquote'
    | 'table'
    | 'img';
  content?: string | React.ReactNode;
  language?: string;
  url?: string;
  alt?: string;
  tableData?: string[][];
  ordered?: boolean;
  checked?: boolean;
  level?: number;
}

// Interface for inline text elements
interface InlineElement {
  type: 'text' | 'code' | 'link' | 'bold' | 'italic' | 'strikethrough' | 'image';
  content: string;
  url?: string;
  alt?: string;
}

/**
 * Main Markdown Renderer component
 * Parses and renders markdown content
 */
const MarkdownRenderer = ({ content }: { content: string }) => {
  const tokens: MarkdownToken[] = [];
  let isInCodeBlock = false;
  let codeBlockLines: string[] = [];
  let codeLanguage = 'plaintext';
  let inTable = false;
  let tableData: string[][] = [];
  let tableHeaders: string[] = [];

  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Handle code blocks
    if (line.startsWith('```')) {
      if (!isInCodeBlock) {
        isInCodeBlock = true;
        // Extract language if specified
        const langMatch = line.match(/^```(\w+)/);
        codeLanguage = langMatch && langMatch[1] ? langMatch[1] : 'plaintext';
        if (codeLanguage === 'markdown') continue;
      } else {
        tokens.push({
          type: 'codeblock',
          content: (
            <CodeBlock code={codeBlockLines.join('\n')} language={codeLanguage}>
              <CodeBlock.Code
                className={`bg-[#2f2f2f6f] overflow-auto p-4 rounded-xl shadow-lg max-w-[800px] h-auto hide-scrollbar`}
              >
                <div className="table-row">
                  <CodeBlock.LineContent className="table-cell text-sm">
                    <CodeBlock.Token />
                  </CodeBlock.LineContent>
                </div>
              </CodeBlock.Code>
            </CodeBlock>
          ),
          language: codeLanguage
        });
        codeBlockLines = [];
        isInCodeBlock = false;
        codeLanguage = 'plaintext';
      }
      continue;
    }

    if (isInCodeBlock) {
      codeBlockLines.push(rawLine); // Use rawLine to preserve indentation
      continue;
    }

    // Handle tables
    if (line.startsWith('|') && line.endsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableHeaders = line
          .split('|')
          .slice(1, -1)
          .map((header) => header.trim());

        // Skip the separator row
        if (
          i + 1 < lines.length &&
          lines[i + 1].trim().startsWith('|') &&
          lines[i + 1].trim().endsWith('|') &&
          lines[i + 1].includes('-')
        ) {
          i++;
          continue;
        }
      } else {
        const rowData = line
          .split('|')
          .slice(1, -1)
          .map((cell) => cell.trim());
        tableData.push(rowData);
      }

      // Check if the next line is not a table row
      if (i + 1 >= lines.length || !lines[i + 1].trim().startsWith('|')) {
        tokens.push({
          type: 'table',
          tableData: [tableHeaders, ...tableData]
        });
        inTable = false;
        tableData = [];
        tableHeaders = [];
      }
      continue;
    }

    // Reset table state if line is not a table
    if (inTable && !line.startsWith('|')) {
      tokens.push({
        type: 'table',
        tableData: [tableHeaders, ...tableData]
      });
      inTable = false;
      tableData = [];
      tableHeaders = [];
    }

    // Handle other markdown elements
    const markdownElement = getMarkdownElement(line, lines, i);
    if (markdownElement) {
      tokens.push(markdownElement);
    }
  }

  // Clean up any unfinished tables
  if (inTable) {
    tokens.push({
      type: 'table',
      tableData: [tableHeaders, ...tableData]
    });
  }

  return (
    <div className="flex flex-col">
      {tokens.map((token, index) => (
        <RenderToken key={index} token={token} />
      ))}
    </div>
  );
};

/**
 * Parse a line of markdown into a token
 */
const getMarkdownElement = (
  line: string,
  allLines: string[],
  currentIndex: number
): MarkdownToken | null => {
  // Handle empty lines
  if (line.length === 0) {
    return null;
  }

  // Headers
  if (line.startsWith('# ')) return { type: 'h1', content: line.slice(2) };
  if (line.startsWith('## ')) return { type: 'h2', content: line.slice(3) };
  if (line.startsWith('### ')) return { type: 'h3', content: line.slice(4) };
  if (line.startsWith('#### ')) return { type: 'h4', content: line.slice(5) };
  if (line.startsWith('##### ')) return { type: 'h5', content: line.slice(6) };
  if (line.startsWith('###### ')) return { type: 'h6', content: line.slice(7) };

  // Blockquote
  if (line.startsWith('> ')) {
    return { type: 'blockquote', content: line.slice(2) };
  }

  // Horizontal rule
  if (line.match(/^(\*{3,}|-{3,}|_{3,})$/)) {
    return { type: 'hr' };
  }

  // Ordered list
  if (line.match(/^\d+\.\s/)) {
    const content = line.replace(/^\d+\.\s/, '');
    return { type: 'li', content, ordered: true };
  }

  // Unordered list or task list
  if (line.match(/^[\*\-\+]\s/)) {
    const content = line.replace(/^[\*\-\+]\s/, '');

    // Task list item
    if (content.startsWith('[ ] ') || content.startsWith('[x] ') || content.startsWith('[X] ')) {
      const checked = content.startsWith('[x]') || content.startsWith('[X]');
      return {
        type: 'li',
        content: content.slice(4),
        ordered: false,
        checked
      };
    }

    return { type: 'li', content, ordered: false };
  }

  // Image
  const imageMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/);
  if (imageMatch) {
    return {
      type: 'img',
      alt: imageMatch[1],
      url: imageMatch[2]
    };
  }

  // Regular paragraph
  return { type: 'p', content: line };
};

/**
 * Render a markdown token
 */
const RenderToken = ({ token }: { token: MarkdownToken }) => {
  switch (token.type) {
    case 'h1':
      return (
        <h1 className="text-3xl font-bold my-2">
          <RenderLine line={token.content} />
        </h1>
      );
    case 'h2':
      return (
        <h2 className="text-2xl font-bold mt-4">
          <RenderLine line={token.content} />
        </h2>
      );
    case 'h3':
      return (
        <h3 className="text-xl font-bold mt-4">
          <RenderLine line={token.content} />
        </h3>
      );
    case 'h4':
      return (
        <h4 className="text-lg font-bold mt-4">
          <RenderLine line={token.content} />
        </h4>
      );
    case 'h5':
      return (
        <h5 className="text-base font-bold mt-4">
          <RenderLine line={token.content} />
        </h5>
      );
    case 'h6':
      return (
        <h6 className="text-sm font-bold mt-4">
          <RenderLine line={token.content} />
        </h6>
      );
    case 'li':
      if (token.ordered) {
        return (
          <div className="ml-6 mt-1 flex gap-2">
            <span className="font-bold">•</span>
            <div>
              <RenderLine line={token.content} />
            </div>
          </div>
        );
      } else if (token.checked !== undefined) {
        return (
          <div className="ml-6 flex gap-2 items-center">
            <input type="checkbox" checked={token.checked} readOnly className="h-4 w-4" />
            <div>
              <RenderLine line={token.content} />
            </div>
          </div>
        );
      } else {
        return (
          <div className="ml-6 flex gap-2">
            <span className="font-bold">•</span>
            <div>
              <RenderLine line={token.content} />
            </div>
          </div>
        );
      }
    case 'hr':
      return <hr className="my-4 border-gray-300" />;
    case 'codeblock':
      return <div className="my-4">{token.content}</div>;
    case 'blockquote':
      return (
        <blockquote className="border-l-4 border-gray-300 pl-4 py-1 my-2 italic bg-gray-50 dark:bg-gray-800">
          <RenderLine line={token.content} />
        </blockquote>
      );
    case 'table':
      return (
        <div className="overflow-x-auto my-4">
          <table className="min-w-full border-collapse">
            {token.tableData && (
              <>
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    {token.tableData[0].map((header, i) => (
                      <th key={i} className="border px-4 py-2">
                        <RenderLine line={header} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {token.tableData.slice(1).map((row, i) => (
                    <tr key={i} className="even:bg-gray-50 dark:even:bg-gray-800">
                      {row.map((cell, j) => (
                        <td key={j} className="border px-4 py-2">
                          <RenderLine line={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </>
            )}
          </table>
        </div>
      );
    case 'img':
      return (
        <div className="my-2">
          <img src={token.url} alt={token.alt || ''} className="max-w-full h-auto rounded-lg" />
        </div>
      );
    case 'p':
      return (
        <p className="mb-0">
          <RenderLine line={token.content} />
        </p>
      );
    default:
      return null;
  }
};

/**
 * Parse and render inline markdown elements within a line
 */
const RenderLine = ({ line }: { line?: string | React.ReactNode }) => {
  if (typeof line !== 'string') {
    return <>{line}</>;
  }

  const elements: InlineElement[] = parseInlineElements(line);

  return (
    <>
      {elements.map((el, index) => {
        switch (el.type) {
          case 'text':
            return <span key={index}>{el.content}</span>;
          case 'code':
            return (
              <span
                key={index}
                className="bg-[#00000050] text-orange-400 px-1 py-1 text-sm rounded-md font-mono"
              >
                {el.content}
              </span>
            );
          case 'link':
            return (
              <a
                key={index}
                href={el.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {el.content}
              </a>
            );
          case 'bold':
            return <strong key={index}>{el.content}</strong>;
          case 'italic':
            return <em key={index}>{el.content}</em>;
          case 'strikethrough':
            return <del key={index}>{el.content}</del>;
          case 'image':
            return (
              <img
                key={index}
                src={el.url}
                alt={el.alt || ''}
                className="inline-block max-h-6 align-text-bottom mx-1"
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
};

/**
 * Parse inline markdown elements like bold, italic, code, links
 */
const parseInlineElements = (text: string): InlineElement[] => {
  const elements: InlineElement[] = [];
  let i = 0;
  let currentText = '';

  while (i < text.length) {
    // Check for link [text](url)
    if (text[i] === '[' && !text.substring(i).startsWith('![')) {
      const linkMatch = text.substring(i).match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        if (currentText) {
          elements.push({ type: 'text', content: currentText });
          currentText = '';
        }

        elements.push({
          type: 'link',
          content: linkMatch[1],
          url: linkMatch[2]
        });

        i += linkMatch[0].length;
        continue;
      }
    }

    // Check for image ![alt](url)
    if (text.substring(i).startsWith('![')) {
      const imgMatch = text.substring(i).match(/!\[([^\]]*)\]\(([^)]+)\)/);
      if (imgMatch) {
        if (currentText) {
          elements.push({ type: 'text', content: currentText });
          currentText = '';
        }

        elements.push({
          type: 'image',
          content: '',
          alt: imgMatch[1],
          url: imgMatch[2]
        });

        i += imgMatch[0].length;
        continue;
      }
    }

    // Check for bold **text**
    if (text.substring(i).startsWith('**')) {
      const matchEnd = text.indexOf('**', i + 2);
      if (matchEnd !== -1) {
        if (currentText) {
          elements.push({ type: 'text', content: currentText });
          currentText = '';
        }

        elements.push({
          type: 'bold',
          content: text.substring(i + 2, matchEnd)
        });

        i = matchEnd + 2;
        continue;
      }
    }

    // Check for italic *text*
    if (
      text[i] === '*' &&
      (i === 0 || text[i - 1] !== '*') &&
      (i === text.length - 1 || text[i + 1] !== '*')
    ) {
      const matchEnd = text.indexOf('*', i + 1);
      if (
        matchEnd !== -1 &&
        text[matchEnd - 1] !== '*' &&
        (matchEnd === text.length - 1 || text[matchEnd + 1] !== '*')
      ) {
        if (currentText) {
          elements.push({ type: 'text', content: currentText });
          currentText = '';
        }

        elements.push({
          type: 'italic',
          content: text.substring(i + 1, matchEnd)
        });

        i = matchEnd + 1;
        continue;
      }
    }

    // Check for strikethrough ~~text~~
    if (text.substring(i).startsWith('~~')) {
      const matchEnd = text.indexOf('~~', i + 2);
      if (matchEnd !== -1) {
        if (currentText) {
          elements.push({ type: 'text', content: currentText });
          currentText = '';
        }

        elements.push({
          type: 'strikethrough',
          content: text.substring(i + 2, matchEnd)
        });

        i = matchEnd + 2;
        continue;
      }
    }

    // Check for inline code `code`
    if (text[i] === '`') {
      const matchEnd = text.indexOf('`', i + 1);
      if (matchEnd !== -1) {
        if (currentText) {
          elements.push({ type: 'text', content: currentText });
          currentText = '';
        }

        elements.push({
          type: 'code',
          content: text.substring(i + 1, matchEnd)
        });

        i = matchEnd + 1;
        continue;
      }
    }

    currentText += text[i];
    i++;
  }

  if (currentText) {
    elements.push({ type: 'text', content: currentText });
  }

  return elements;
};

export default MarkdownRenderer;
