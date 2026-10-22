import "server-only"
import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

export const SESSION_COOKIE = "grit_session";

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