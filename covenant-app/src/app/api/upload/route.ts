import { NextRequest, NextResponse } from "next/server";

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
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded. Please provide a video file." },
                { status: 400 }
            );
        }

        const rekaForm = new FormData();

        rekaForm.append("index", "true");
        rekaForm.append("enable_thumbnails", "false");
        rekaForm.append("video_name", file.name);
        rekaForm.append("file", file, file.name);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'x-api-key': REKA_API_KEY
            },
            body: rekaForm
        });

        if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new Error(`Reka upload failed (${response.status}): ${text || 'no body'}`);
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Upload failed due to a server error. Please try again later.' },
            { status: 500 }
        );
    }
}
