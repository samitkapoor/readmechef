import { NextRequest, NextResponse } from 'next/server';

/**
 * GET handler for video info
 * Returns high quality video metadata
 */
export async function GET(request: NextRequest) {
  try {
    // Define video options (high quality only)
    const videoOptions = {
      // Base URL for the video stream
      baseUrl: '/api/video',

      // High quality video only
      video: {
        id: 'demo',
        name: 'High Quality',
        url: '/api/video/demo',
        resolution: '1080p'
      }
    };

    return NextResponse.json(videoOptions, {
      headers: {
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });
  } catch (error) {
    console.error('Error providing video info:', error);
    return NextResponse.json({ error: 'Failed to get video info' }, { status: 500 });
  }
}
