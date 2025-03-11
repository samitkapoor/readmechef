import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { user: string } }) {
  const user = (await params).user;
  console.log('User:', user);
  const repos = await fetch(`https://api.github.com/users/${user}/repos`, {
    headers: {
      Authentication: 'Bearer ' + process.env.GITHUB_ID
    }
  });
  const data = await repos.json();

  return NextResponse.json({ repos: data });
}
