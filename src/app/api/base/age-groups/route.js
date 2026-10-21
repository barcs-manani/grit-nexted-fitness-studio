import "server-only"
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const ageGroups = await prisma.memberAgeGroup.findMany({
            orderBy: {
                id: "asc",
            },
            select: {
                id: true,
                type: true,
                group: true,
            },
        });

        const result = ageGroups.map((age) => ({
            ...age,
            id: String(age.id)
        }))

        return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
    } catch (error) {
        console.error("Failed to fetch age groups: ", error);
        return NextResponse.json(
            { error: "Unable to load age groups" },
            { status: 500 }
        )
    }
}