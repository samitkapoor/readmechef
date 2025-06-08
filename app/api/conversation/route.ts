'use server';

import { google } from '@ai-sdk/google';
import { generateText, streamText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import { Repository } from '@/types/repository.types';
import { ClientMessage } from '@/types/ai.types';
import { createUser } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { auth } from '@/auth';
import { User } from 'next-auth';
import {
  fetchRepoDetails,
  fetchContributors,
  fetchAllRepoFiles
} from '@/services/repositoryService';

const generateContextualizedInput = async (
  input: string,
  repository: Repository,
  accessToken: string,
  isFirstMessage: boolean,
  platform: string
) => {
  try {
    if (isFirstMessage) {
      const repoDetails = await fetchRepoDetails(repository, accessToken, platform);

      const [files, contributors] = await Promise.all([
        fetchAllRepoFiles(repository, accessToken, platform, repoDetails),
        fetchContributors(repository, accessToken, platform)
      ]);

      return `
            Generate a README.md file for this repository:
            - Name: ${repository.name}
            - Owner: ${repository.owner.login}
            - Description: ${repository.description || 'No description provided'}
            - Primary Language: ${repoDetails.language || 'Unknown'}
            - Topics/Tags: ${repoDetails.topics.join(', ') || 'None'}
            - Stars: ${repoDetails.stars || 0}
            - Forks: ${repoDetails.forks || 0}
            - Open Issues: ${repoDetails.openIssues || 0}
            - Last Updated: ${repoDetails.lastUpdate || 'Unknown'}
            - Visibility: ${repoDetails.visibility || 'Unknown'}
            - Contributors: ${contributors.length > 0 ? JSON.stringify(contributors) : 'None found'}
            ${repoDetails.homepage ? `- Homepage: ${repoDetails.homepage}` : ''}
            
            Project Files and Structure:
            - Package.json: ${files.packageJson ? JSON.stringify(files.packageJson) : 'Not found'}
            - LICENSE: ${files.license ? JSON.stringify(files.license) : 'Not found'}
            - Existing README: ${files.readme ? JSON.stringify(files.readme) : 'Not found'}
            
            Root Directory Structure:
            ${JSON.stringify(files.rootStructure)}
            
            Configuration Files:
            ${JSON.stringify(files.configFiles)}
            
            Source Code Structure:
            ${JSON.stringify(files.sourceFiles)}
            
            Documentation Files:
            ${JSON.stringify(files.documentationFiles)}
  
            Generate a structured README with the following guidelines:
            1. Structure: Start with a clear project title and description.
            2. Essential Sections: Provide installation instructions with prerequisites, key features, API documentation (if available), contribution guidelines.
            3. Style & Formatting: Use professional language, markdown best practices, syntax-highlighted code blocks, tables, and lists for clarity.
            Strategically use emojis for emphasis and ensure proper markdown formatting.
            4. Special Considerations: If a README exists, improve structure while preserving valuable content. Address specific user requests, 
            highlight the project's unique value, add troubleshooting for common issues, and include links to additional documentation if available.
            5. Don't add configuration files, project structure, Usage section, Table of contents section to the README.md file unless asked by the user.
            6. Use all the information provided to you to understand the project and then generate the README.md file.
            7. If enough information is not available to generate the README.md file, ask the user for more information.
          `;
    } else {
      return `
          Continue helping with the README.md for repository ${repository.name} (${repository.owner.login}/${repository.name}).
          User request: ${input}
        `;
    }
  } catch (error) {
    console.error('Error generating contextualized input:', error);
    return `
        Repository Information:
        - Name: ${repository.name}
        - Owner: ${repository.owner.login}
        - Description: ${repository.description || 'No description provided'}
        
        I am helping you create a README.md file for this repository. ${input}
      `;
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const {
      history,
      input,
      repository
    }: {
      history: ClientMessage[];
      input: string;
      repository: Repository;
    } = await request.json();

    const session: { user: User } | null = await getServerSession(auth);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Something went wrong' }, { status: 400 });
    }

    const accessToken = session.user.accessToken;
    const platform = session.user.platform || 'github'; // Default to GitHub if not specified

    if (!history || !Array.isArray(history)) {
      return NextResponse.json({ message: 'Something went wrong' }, { status: 400 });
    }

    if (!input || typeof input !== 'string') {
      return NextResponse.json({ message: 'Something went wrong' }, { status: 400 });
    }

    if (!repository || typeof repository !== 'object' || !repository.name || !repository.owner) {
      return NextResponse.json({ message: 'Something went wrong' }, { status: 400 });
    }

    if (!accessToken || typeof accessToken !== 'string') {
      return NextResponse.json({ message: 'Something went wrong' }, { status: 400 });
    }

    createUser(session.user);

    const isReadmePrompt = await generateText({
      model: google('gemini-2.0-flash-001'),
      prompt: `Check if this prompt is about generating a README file or related to project documentation. 
Reply only with "YES" or "NO"
If the user is only thanking you and is not asking anything related to README file or related to project documentation, reply only with "Thanks".

Prompt: ${input}`
    });
    const isReadmePromptResult = isReadmePrompt.text;

    const responses = [
      "I'd love to help, but I left my 'answer anything' apron at home. README files only!",
      'This chef only knows how to spice up README files—other dishes are above my pay grade!',
      "Oven's not preheated for that request! Let's stick to README goodness.",
      "Ask me about README files and I'll serve it hot. Anything else? That's off the grill!",
      "That's beyond my kitchen counter! But I've got all the spices for a killer README.",
      "I tried answering that once... the pot boiled over. Stick to READMEs, it's safer.",
      "I only cook what's in the README cookbook—no substitutions, no fancy desserts!",
      "I'm not a generalist, I'm a README specialist. Ask me about README files only!"
    ];

    if (isReadmePromptResult.toLowerCase().trim().startsWith('no')) {
      return NextResponse.json(
        {
          message: responses[Math.floor(Math.random() * responses.length)]
        },
        { status: 201 }
      );
    } else if (isReadmePromptResult.toLowerCase().trim().startsWith('thanks')) {
      return NextResponse.json(
        {
          message: "You're welcome!"
        },
        { status: 201 }
      );
    }

    const messages = history.map((his) => ({ role: his.role, content: his.display }));

    const isFirstMessage = messages.length === 0;

    const contextualizedInput = await generateContextualizedInput(
      input,
      repository,
      accessToken,
      isFirstMessage,
      platform
    );

    const result = await streamText({
      model: google('gemini-2.0-flash-001'),
      messages: [...messages, { role: 'user', content: contextualizedInput }]
    });

    return result.toTextStreamResponse();
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
};
