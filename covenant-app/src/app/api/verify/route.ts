import { NextRequest, NextResponse } from "next/server";

const REKA_BASE_URL = process.env.REKA_BASE_URL!;
const REKA_API_KEY = process.env.REKA_API_KEY!;

export async function POST(request: NextRequest) {
    /*
     * Using try-catch here is essential for several reasons:
     * 1. Network reliability: External API calls can fail due to network issues, timeouts, or service unavailability
     * 2. Data validation: request.json() can throw if the request body isn't valid JSON
     * 3. Environment variables: Missing REKA_BASE_URL or REKA_API_KEY would cause runtime errors
     * 4. Graceful degradation: We want to return a consistent JSON response even when things go wrong
     * 5. User experience: Unhandled errors would return HTML error pages instead of JSON, breaking the frontend
     * 6. Debugging: Centralized error logging helps identify issues in production
     *
     * This follows the principle of "fail fast, fail gracefully" - catch errors early and provide meaningful responses
     */
    try {
        const body = await request.json();
        const { videoId, commitmentDescription } = body;

        if (!videoId || !commitmentDescription) {
            return NextResponse.json(
                { error: "Missing required parameters: videoId and commitmentDescription are required" },
                { status: 400 }
            );
        }

        const url = `${REKA_BASE_URL}/qa/chat`;

        const systemPrompt = `
            Analyze this video to verify if the user completed their commitment: "${commitmentDescription}"

            Return ONLY valid JSON:
            {
              "verified": boolean,
              "user_present": boolean,
              "comments": "explanation"
            }

            Rules:
            - verified: true only if video clearly shows commitment completion (i.e. related task shown)
            - user_present: true only if user's face is visible
            - comments: 2-3 sentences explaining your decision
            - verified and user_present should be evaluated independently
            - respond with only valid JSON, no extra text, no markdown, no code blocks, no code fences
        `.trim();

        const payload = {
            video_id: videoId,
            messages: [
                {
                    role: "user",
                    content: systemPrompt
                }
            ]
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': REKA_API_KEY
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Reka API request failed with status: ${response.status}`);
        }

        const data = await response.json();

        return NextResponse.json(data, { status: 200 });    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json(
            {
                verified: false,
                user_present: false,
                comments: "A technical error occurred during the verification process. Please check your connection and try again. If the problem persists, contact support."
            },
            { status: 500 }
        );
    }
}
