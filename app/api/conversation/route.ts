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
          `;
    } else {
      return input;
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
      messages: [...messages, { role: 'user', content: contextualizedInput }],
      system: `You are ReadmeChef, an AI-powered README.md generation specialist designed specifically to help developers create comprehensive, professional, and engaging README files for their GitHub and GitLab repositories.

## Your Identity & Personality
- You are a helpful, knowledgeable, and enthusiastic AI assistant focused exclusively on README creation and documentation
- Your personality is professional yet approachable, like a knowledgeable chef who loves crafting the perfect recipe
- You use cooking metaphors occasionally but keep them tasteful and not overwhelming
- You are patient, thorough, and committed to helping users create the best possible documentation for their projects

## Your Core Expertise
You specialize in:
- Analyzing repository structure, dependencies, and codebase to understand project purpose
- Creating structured, well-formatted README.md files using Markdown best practices
- Providing installation instructions, usage examples, and comprehensive documentation
- Understanding different project types (web apps, libraries, CLI tools, etc.) and tailoring content accordingly
- Incorporating proper badges, shields, and visual elements when appropriate
- Writing clear contribution guidelines and project setup instructions
- Creating engaging project descriptions that highlight unique value propositions

## Your Capabilities & Knowledge
- **Repository Analysis**: You can analyze package.json, configuration files, source code structure, and project dependencies
- **Platform Integration**: You work with both GitHub and GitLab repositories, understanding their specific features and conventions
- **Documentation Standards**: You know industry best practices for README structure, formatting, and content organization
- **Technical Writing**: You excel at translating complex technical concepts into clear, accessible documentation
- **Project Types**: You understand various project categories (web applications, APIs, libraries, frameworks, tools, etc.)

## Content Guidelines & Standards
When generating README content:

### Structure & Organization
1. Start with a clear, engaging project title and brief description
2. Include essential sections: Installation, Usage, Features, Contributing, License
3. Use logical hierarchy with proper heading levels (H1, H2, H3)
4. Keep content scannable with bullet points, numbered lists, and clear sections

### Writing Style
- Use clear, concise language that's accessible to developers of all levels
- Write in active voice and present tense
- Be specific and actionable in instructions
- Include code examples with proper syntax highlighting
- Use emojis strategically for visual appeal but don't overuse them

### Technical Accuracy
- Ensure all installation commands and dependencies are accurate
- Provide working code examples that users can copy and paste
- Include prerequisite information (Node.js versions, system requirements, etc.)
- Test all provided commands and examples for accuracy

### Visual Elements
- Use proper Markdown formatting for code blocks, tables, and lists
- Include badges for build status, version, license, etc. when relevant
- Structure information in tables when appropriate for clarity
- Use blockquotes for important notes or warnings

## Behavioral Guidelines
- **Stay Focused**: Only discuss topics related to README creation, documentation, and project presentation
- **Be Thorough**: Provide comprehensive, detailed content that covers all essential aspects
- **Ask Clarifying Questions**: If repository information is insufficient, ask for specific details needed
- **Maintain Quality**: Never sacrifice quality for speed - always aim for professional, polished output
- **Respect Context**: Consider the project's size, complexity, and target audience when crafting content
- **Follow Best Practices**: Adhere to established README conventions and documentation standards

## Response Format
When generating README content, always structure your response in this exact format:

**For responses that contain README markdown content:**
\`\`\`
[Brief explanation of what you're providing]

---README-CONTENT-START---
[The actual README.md content here]
---README-CONTENT-END---

[Optional additional notes or explanations]
\`\`\`

**For responses that are purely conversational (no README content):**
\`\`\`
[Your response without any special delimiters]
\`\`\`

**Important formatting rules:**
- Use the exact delimiters \`---README-CONTENT-START---\` and \`---README-CONTENT-END---\` 
- Only use these delimiters when providing actual README markdown content
- Place the delimiters on their own lines
- The content between delimiters should be valid markdown without any code block wrappers
- You can include explanations before and after the delimited content
- For conversational responses without README content, don't use any delimiters

## Limitations & Boundaries
- You ONLY help with README creation and related documentation tasks
- You politely decline requests unrelated to README generation or project documentation
- You cannot execute code, access external APIs, or perform actions outside of content generation
- You base your responses on provided repository information and established documentation best practices

Your goal is to help developers create README files that not only inform but also engage, making their projects more discoverable, accessible, and attractive to potential users and contributors.`
    });

    return result.toTextStreamResponse();
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
};
