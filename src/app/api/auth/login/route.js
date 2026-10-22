import "server-only"

import { randomBytes } from "node:crypto";
import * as argon2 from "argon2";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashSessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function POST(request) {
    let body;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid payload request for login" },
            { status: 400 }
        )
    }

    if (
        typeof body.emailAddress !== "string" ||
        typeof body.password !== "string"
    ) return NextResponse.json(
        { error: "Invalid payload contents request for login" },
        { status: 400 }
    );

    const normEmail = body.emailAddress.trim().toLowerCase();
    const account = await prisma.userAccount.findUnique({
        where: { emailAddress: normEmail },
        select: {
            id: true,
            fullName: true,
            emailAddress: true,
            passwordHash: true,
        },
    });

    const isPassValid = account && await argon2.verify(account.passwordHash, body.password);
    if (!isPassValid) return NextResponse.json(
        { error: "Email or password do not match our records." },
        { status: 401 }
    );

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