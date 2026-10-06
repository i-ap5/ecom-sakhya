import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getAdminSdk, subscribeToNewsletter } from "@/lib/medusa/admin";

const DATA_FILE = path.join(process.cwd(), "data", "newsletter-subscribers.json");
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Local-dev fallback only: serverless hosts like Vercel have a read-only filesystem,
// so production must use Medusa (MEDUSA_ADMIN_API_KEY).
async function saveToLocalFile(email: string) {
  let subscribers: string[] = [];
  try {
    subscribers = JSON.parse(await fs.readFile(DATA_FILE, "utf-8"));
  } catch {
    subscribers = [];
  }
  if (!subscribers.includes(email)) {
    subscribers.push(email);
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(subscribers, null, 2));
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    const sdk = getAdminSdk();
    if (sdk) {
      await subscribeToNewsletter(sdk, email);
    } else if (process.env.NODE_ENV === "development") {
      await saveToLocalFile(email);
    } else {
      console.error("Newsletter signup failed: MEDUSA_ADMIN_API_KEY is not set");
      return NextResponse.json(
        { error: "Sign-ups are temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Newsletter signup failed", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
