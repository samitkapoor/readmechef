import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names and merges tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extracts README markdown content from AI response message
 * Supports both new delimiter format and legacy format for backward compatibility
 * Handles streaming edge cases where delimiters may be incomplete
 */
// First, try to extract using the new delimiter format
const startDelimiter = '---README-CONTENT-START---';
const endDelimiter = '---README-CONTENT-END---';

export const extractMarkdownContent = (messageContent: string): string => {
  const startIndex = messageContent.indexOf(startDelimiter);
  const endIndex = messageContent.indexOf(endDelimiter);

  // If we have start delimiter but no end delimiter (streaming in progress)
  // return empty string to avoid showing explanatory text
  if (startIndex === -1 && endIndex === -1) {
    return '';
  }

  if (startIndex !== -1 && endIndex === -1) {
    return messageContent.split(startDelimiter)[1];
  }

  if (startIndex !== -1 && endIndex !== -1) {
    return messageContent.substring(startIndex + startDelimiter.length, endIndex).trim();
  }

  return '';
};

export const extractExplanatoryText = (messageContent: string, isMobile: boolean): string => {
  const startIndex = messageContent.indexOf(startDelimiter);
  const endIndex = messageContent.indexOf(endDelimiter);

  if (isMobile) {
    return messageContent.replaceAll(startDelimiter, '').replaceAll(endDelimiter, '');
  }

  // If we have start delimiter but no end delimiter (streaming in progress)
  // return empty string to avoid showing explanatory text
  if (startIndex === -1 && endIndex === -1) {
    return messageContent;
  }

  if (startIndex !== -1 && endIndex === -1) {
    return messageContent.split(startDelimiter)[0];
  }

  if (startIndex !== -1 && endIndex !== -1) {
    return (
      messageContent.substring(0, startIndex).trim() +
      '\n' +
      messageContent.substring(endIndex + endDelimiter.length).trim()
    ).replaceAll('`', '');
  }

  return '';
};
