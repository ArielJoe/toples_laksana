import { NextResponse } from "next/server";
import {
  validateCredentials,
  createToken,
  setAuthCookie,
} from "@/lib/auth";

const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

type LoginAttempt = {
  count: number;
  resetAt: number;
};

const loginAttempts = new Map<string, LoginAttempt>();

function getClientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function getAttemptKey(request: Request, email: unknown) {
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "unknown";
  return `${getClientIp(request)}:${normalizedEmail}`;
}

function getActiveAttempt(key: string) {
  const attempt = loginAttempts.get(key);

  if (!attempt) return null;

  if (Date.now() > attempt.resetAt) {
    loginAttempts.delete(key);
    return null;
  }

  return attempt;
}

function recordFailedAttempt(key: string) {
  const activeAttempt = getActiveAttempt(key);

  loginAttempts.set(key, {
    count: activeAttempt ? activeAttempt.count + 1 : 1,
    resetAt: activeAttempt?.resetAt ?? Date.now() + LOGIN_WINDOW_MS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    const attemptKey = getAttemptKey(request, email);
    const activeAttempt = getActiveAttempt(attemptKey);

    if (activeAttempt && activeAttempt.count >= MAX_LOGIN_ATTEMPTS) {
      const retryAfterSeconds = Math.ceil((activeAttempt.resetAt - Date.now()) / 1000);

      return NextResponse.json(
        { error: "Terlalu banyak percobaan login. Coba lagi beberapa saat." },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSeconds) },
        }
      );
    }

    if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
      return NextResponse.json(
        { error: "Email dan password harus diisi." },
        { status: 400 }
      );
    }

    const isValid = validateCredentials(email, password);

    if (!isValid) {
      recordFailedAttempt(attemptKey);

      return NextResponse.json(
        { error: "Email atau password salah." },
        { status: 401 }
      );
    }

    const token = await createToken(email);
    await setAuthCookie(token);
    loginAttempts.delete(attemptKey);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
