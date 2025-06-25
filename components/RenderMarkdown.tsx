'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Image from 'next/image';
import styles from '../app/render-article.module.css';

// Define interfaces for component props
interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  children?: React.ReactNode;
}

interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | Blob;
  alt?: string;
}

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children?: React.ReactNode;
}

// Separate interfaces for thead and tbody props
interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children?: React.ReactNode;
}

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
  node?: LightHastElement;
  className?: string;
}

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children?: React.ReactNode;
}

interface TableCellProps
  extends React.ThHTMLAttributes<HTMLTableCellElement>,
    React.TdHTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode;
}

// Local interfaces to model HAST structure without direct import conflicts
interface LightElementContentProperties {
  [key: string]: unknown;
}

interface LightElementContent {
  type: 'element' | 'text' | 'comment' | 'root' | string;
  tagName?: string;
  value?: string;
  properties?: LightElementContentProperties;
  children?: LightElementContent[];
}

interface LightHastElement {
  type: 'element';
  tagName: string;
  properties?: LightElementContentProperties;
  children: LightElementContent[];
}

// New component for rendering images with Hooks
const MarkdownImage = ({ src, alt, width, height, ...props }: ImageProps) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    let objectUrl: string | undefined;
    if (src instanceof Blob) {
      objectUrl = URL.createObjectURL(src);
      setImageSrc(objectUrl);
    } else if (typeof src === 'string') {
      setImageSrc(src);
    } else {
      setImageSrc(undefined);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src]);

  return (
    <div className="flex flex-col">
      {imageSrc && (
        <Image
          src={imageSrc}
          alt={alt || ''}
          width={Number(width) || 700}
          height={Number(height) || 400}
          className="max-w-full h-auto rounded-lg shadow-lg mx-auto border border-gray-700 my-8"
          {...props}
        />
      )}
      {/* {alt && <p className="text-gray-400 text-xs italic font-medium text-center mb-8">{alt}</p>} */}
    </div>
  );
};

const RenderMarkdown = ({ markdown }: { markdown: string }) => {
  return (
    <div className="w-full">
      <div className={`${styles.markdownContent} prose prose-invert prose-lg max-w-none`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code: ({ inline, className, children, style, ...props }: CodeProps) => {
              const match = /language-(\w+)/.exec(className || '');
              const language = match ? match[1] : 'text';

              if (!inline && match) {
                return (
                  <div className="relative">
                    <SyntaxHighlighter
                      style={oneDark}
                      language={language}
                      PreTag="div"
                      customStyle={{
                        background: '#ffffff11',
                        border: '1px solid #ffffff22',
                        borderRadius: '0.75rem',
                        padding: '1.5rem',
                        fontSize: '0.875rem',
                        lineHeight: '1.5',
                        fontFamily:
                          "'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', monospace",
                        boxShadow:
                          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                      codeTagProps={{
                        style: {
                          background: 'transparent',
                          padding: '0',
                          fontSize: '0.875rem',
                          fontFamily:
                            "'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', monospace"
                        }
                      }}
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                );
              }

              // Inline code
              return (
                <code className={className} style={style} {...props}>
                  {children}
                </code>
              );
            },
            // Enhanced links
            a: ({ href, children, ...props }: LinkProps) => {
              const isExternal = href && (href.startsWith('http') || href.startsWith('https'));
              return (
                <a
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  {...props}
                >
                  {children}
                </a>
              );
            },
            // Enhanced images
            img: (props: ImageProps) => <MarkdownImage {...props} />,
            // Custom paragraph renderer to handle images correctly
            p: (props: ParagraphProps) => {
              const { node, children, className } = props;
              // Check if the paragraph node has exactly one child and that child is an image
              if (node && node.children.length === 1 && node.children[0].tagName === 'img') {
                // Render the children (MarkdownImage component) directly, without a wrapping <p>
                return <>{children}</>;
              }
              // For all other paragraphs, render them normally with their className for styling
              return <p className={className}>{children}</p>;
            },
            // Enhanced tables
            table: ({ children, ...props }: TableProps) => (
              <div className="overflow-x-auto rounded-lg border border-white/30 bg-transparent">
                <table className="min-w-full divide-y divide-gray-700" {...props}>
                  {children}
                </table>
              </div>
            ),
            thead: ({ children, ...props }: TableHeaderProps) => (
              <thead className="bg-transparent" {...props}>
                {children}
              </thead>
            ),
            tbody: ({ children, ...props }: TableBodyProps) => (
              <tbody className="bg-transparent" {...props}>
                {children}
              </tbody>
            ),
            th: ({ children, ...props }: TableCellProps) => (
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-l border-white/20"
                {...props}
              >
                {children}
              </th>
            ),
            td: ({ children, ...props }: TableCellProps) => (
              <td
                className="px-6 py-4 text-sm text-gray-300 border-b border-l border-white/20"
                {...props}
              >
                {children}
              </td>
            )
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default RenderMarkdown;
