import { ServerMessage } from './actions';
import { AI } from './ai';

export default function ChatLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  // get chat history from database
  const history: ServerMessage[] = [];

  return (
    <AI initialAIState={history} initialUIState={[]}>
      <div className="overflow-hidden">{children}</div>
    </AI>
  );
}
