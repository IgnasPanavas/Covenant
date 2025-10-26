import { NextRequest, NextResponse } from "next/server";

const REKA_BASE_URL = process.env.REKA_BASE_URL!;
const REKA_API_KEY = process.env.REKA_API_KEY!;

export async function POST(request: NextRequest) {
    const url = `${REKA_BASE_URL}/videos/upload`;

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

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

        console.log('Uploading to Reka:', {
            name: file.name,
            size: file.size,
            type: file.type,
        });


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
    } catch (error: unknown) {
        console.error('Upload error (raw):', error);
        if (error instanceof Error) {
            console.error('Upload error message:', error.message);
            console.error('Upload error stack:', error.stack);
        } else {
        console.error('Upload error (stringified):', JSON.stringify(error, null, 2));
        }

        return NextResponse.json(
            { error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
}

}
