import "server-only"

import * as argon2 from "argon2";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function POST(request) {
    let body;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid query for login request" },
            { status: 400 }
        )
    }

    if (
        typeof body.emailAddress !== "string" ||
        typeof body.password !== "string"
    ) return NextResponse.json(
        { error: "Invalid fields in login request" },
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

    return await createSession(account);
}