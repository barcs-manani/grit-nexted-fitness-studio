import "server-only"
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const branches = await prisma.branchLocation.findMany({
            orderBy: {
                id: "asc",
            },
            select: {
                id: true,
                country: true,
                city: true,
            },
        });

        const result = branches.map((branch) => ({
            ...branch,
            id: String(branch.id)
        }))

        return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
    } catch (error) {
        console.error("Failed to fetch branch locations: ", error);
        return NextResponse.json(
            { error: "Unable to load branch locations" },
            { status: 500 }
        )
    }
}