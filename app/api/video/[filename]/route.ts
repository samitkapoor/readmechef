import { NextRequest, NextResponse } from 'next/server';
import { stat, createReadStream } from 'fs';
import { promisify } from 'util';
import path from 'path';
import { Readable } from 'stream';

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
 * Helper function to convert Node.js ReadStream to Web ReadableStream
 * This makes it compatible with NextResponse
 */
function nodeStreamToWebStream(nodeStream: Readable): ReadableStream {
  return new ReadableStream({
    start(controller) {
      nodeStream.on('data', (chunk) => {
        controller.enqueue(chunk);
      });
      nodeStream.on('end', () => {
        controller.close();
      });
      nodeStream.on('error', (err) => {
        controller.error(err);
      });
    },
    cancel() {
      nodeStream.destroy();
    }
  });
}

/**
 * GET handler for video streaming
 * Supports range requests for efficient streaming
 */
export async function GET(request: NextRequest) {
  try {
    // Extract filename from URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const filename = pathParts[pathParts.length - 1];

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

      // Convert Node.js stream to Web ReadableStream and return with appropriate headers
      return new NextResponse(nodeStreamToWebStream(stream), {
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

      // Convert Node.js stream to Web ReadableStream and return with appropriate headers
      return new NextResponse(nodeStreamToWebStream(stream), {
        status: 200,
        headers
      });
    }
  } catch (error) {
    console.error('Error streaming video:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
