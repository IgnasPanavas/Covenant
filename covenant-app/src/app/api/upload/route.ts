import { NextRequest, NextResponse } from "next/server";

const REKA_BASE_URL = process.env.REKA_BASE_URL!;
const REKA_API_KEY = process.env.REKA_API_KEY!;

export async function POST(request: NextRequest) {
    const url = `${REKA_BASE_URL}/videos/upload`;

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
        return new Response('No file uploaded', { status: 400 });
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

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
}
