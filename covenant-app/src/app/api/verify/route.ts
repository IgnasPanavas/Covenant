import { NextRequest } from "next/server";

const REKA_BASE_URL = process.env.REKA_BASE_URL!;
const REKA_API_KEY = process.env.REKA_API_KEY!;

export async function POST(request: NextRequest) {
    const url = `${REKA_BASE_URL}/qa/chat`;

}
