import { NextRequest, NextResponse } from 'next/server';
import { stat, createReadStream } from 'fs';
import { promisify } from 'util';
import path from 'path';

// Convert fs.stat to promise-based
const statPromise = promisify(stat);

// Map of supported video files and their paths
const VIDEO_FILES: Record<string, { path: string; type: string }> = {
  demo: {
    path: 'readmechef-demo.mp4',
    type: 'video/mp4'
  },
  'demo-compressed': {
    path: 'readmechef-demo-compressed.mp4',
    type: 'video/mp4'
  }
};

/**
 * GET handler for video streaming
 * Supports range requests for efficient streaming
 */
export async function GET(request: NextRequest, { params }: { params: { filename: string } }) {
  try {
    const filename = params.filename;

    // Check if the requested video exists in our map
    if (!VIDEO_FILES[filename]) {
      return new NextResponse('Video not found', { status: 404 });
    }

    const videoInfo = VIDEO_FILES[filename];
    const videoPath = path.join(process.cwd(), 'public', videoInfo.path);

    // Get file stats (including size)
    const stats = await statPromise(videoPath);
    const fileSize = stats.size;

    // Parse Range header for partial content support
    const range = request.headers.get('range');

    if (range) {
      // Handle range request (partial content)
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      // Create read stream for the specified range
      const stream = createReadStream(videoPath, { start, end });

      // Prepare response headers
      const headers = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize.toString(),
        'Content-Type': videoInfo.type,
        'Cache-Control': 'public, max-age=31536000'
      };

      // Return the stream with appropriate headers
      return new NextResponse(stream as any, {
        status: 206,
        headers
      });
    } else {
      // Handle full content request
      const stream = createReadStream(videoPath);

      // Prepare response headers
      const headers = {
        'Content-Length': fileSize.toString(),
        'Content-Type': videoInfo.type,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000'
      };

      // Return the stream with appropriate headers
      return new NextResponse(stream as any, {
        status: 200,
        headers
      });
    }
  } catch (error) {
    console.error('Error streaming video:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
