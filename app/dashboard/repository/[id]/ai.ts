import React from 'react';
import { createAI, getAIState } from 'ai/rsc';
import { ServerMessage, ClientMessage, continueConversation } from './actions';

interface UIState {
  id: string;
  role: 'user' | 'assistant' | 'function';
  display: React.ReactNode;
}

export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation
  },
  onSetAIState: async () =>
    // { state, done }
    {
      'use server';

      // if (done) {
      //   saveChat(state);
      // }
    },
  onGetUIState: async () => {
    'use server';

    const history = getAIState();

    return history.map((message: ServerMessage) => ({
      id: message.id,
      role: message.role,
      display:
        message.role === 'function'
          ? React.createElement('div', null, message.content)
          : message.content
    })) as UIState[];
  }
});
