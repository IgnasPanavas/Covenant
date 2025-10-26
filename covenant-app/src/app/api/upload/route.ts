import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REKA_BASE_URL = process.env.REKA_BASE_URL!;
const REKA_API_KEY = process.env.REKA_API_KEY!;

export async function POST(request: NextRequest) {
  // Check if environment variables are set
  if (!REKA_BASE_URL || !REKA_API_KEY) {
    console.error('Missing environment variables:', { REKA_BASE_URL: !!REKA_BASE_URL, REKA_API_KEY: !!REKA_API_KEY });
    return NextResponse.json(
      { error: 'Server configuration error: Missing Reka API credentials' },
      { status: 500 }
    );
  }

  const url = `${REKA_BASE_URL}/videos/upload`;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    console.log('Upload request received:', {
      hasFile: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type
    });

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded. Please provide a video file." },
        { status: 400 }
      );
    }

    // Convert the web File into a proper Blob so it can be streamed correctly
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });

    const rekaForm = new FormData();
    rekaForm.append("index", "true");
    rekaForm.append("enable_thumbnails", "false");
    rekaForm.append("video_name", file.name);
    rekaForm.append("file", blob, file.name);

    console.log('Uploading to Reka:', {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "x-api-key": REKA_API_KEY,
      },
      body: rekaForm,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error('Reka upload failed:', {
        status: response.status,
        statusText: response.statusText,
        body: text
      });
      throw new Error(
        `Reka upload failed (${response.status}): ${text || "no body"}`
      );
    }

    const data = await response.json();
    console.log('Upload successful:', data);
    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    console.error('Upload error:', error);
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Upload failed due to a server error. Please try again later.',
      },
      { status: 500 }
    );
  }
}
