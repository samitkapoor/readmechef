export type ClientMessage = {
  id: string;
  role: 'user' | 'assistant';
  display: string;
};
