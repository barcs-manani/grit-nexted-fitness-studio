import "server-only";

import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const account = await getCurrentUser();
    if (!account) {
        return NextResponse.json(
            { error: "Access denied!" },
            { status: 401 }
        );
    }
    const members = await prisma.member.findMany({
        where: { accountId: BigInt(account.id) },
        orderBy: { id: "asc" },
        select: {
            id: true,
            accountId: true,
            primaryAccount: true,
            fullName: true,
            emailAddress: true,
            phoneNumber: true,
            isActive: true,
            branchLocation: {
                select: {
                    country: true,
                    city: true,
                },
            },
            ageGroup: {
                select: {
                    type: true,
                    group: true
                }
            },
            membershipPlan: {
                select: {
                    id: true,
                    type: true,
                    name: true,
                    description: true
                }
            }
        }
    });

    const result = members.map((member) => ({
        ...member,
        id: member.id.toString(),
        accountId: member.accountId.toString(),
        membershipPlan: {
            ...member.membershipPlan,
            id: member.membershipPlan.id.toString(),
        },
    }))
    return NextResponse.json(
        result,
        { 
            status: 200,
            headers: {
                "Cache-Control": "no-store",
            }
         }
    );
}