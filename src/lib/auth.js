import "server-only"

import { NextResponse } from "next/server";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

export const SESSION_COOKIE = process.env.SESSION_COOKIE;

export function hashSessionToken(token) {
    return createHash("sha256").update(token).digest("hex");
}

export async function getCurrentUser() {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;

    if (!token) return null;

    const session = await prisma.userSession.findFirst({
        where: {
            tokenHash: hashSessionToken(token),
            expiresAt: { gt: new Date() },
        },
        select: {
            account: {
                select: {
                    id: true,
                    fullName: true,
                    emailAddress: true
                }
            }
        }
    });

    if (!session) return null;

    return {
        id: session.account.id.toString(),
        fullName: session.account.fullName,
        emailAddress: session.account.emailAddress,
    };
}

export async function createSession(account) {
    // Setting up the session
    const rawToken = randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)); // 30 Days session expiry

    // new session
    await prisma.userSession.create({
        data: {
            accountId: account.id,
            tokenHash: hashSessionToken(rawToken),
            expiresAt
        },
    });

    const response = NextResponse.json({
        account: {
            id: account.id.toString(),
            fullName: account.fullName,
            emailAddress: account.emailAddress,
        },
    });

    response.cookies.set(SESSION_COOKIE, rawToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: expiresAt,
    });

    return response;
}