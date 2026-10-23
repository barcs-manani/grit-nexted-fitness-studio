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

export async function POST(request) {
    let body;
    try {
        body = await request.json();
    } catch (error) {
        return NextResponse.json(
            { error: "Invalid request body for branch location addition request" },
            { status: 400 }
        );
    }

    const { country, city } = body;
    if (
        !city.trim() || typeof city !== "string" ||
        !country.trim() || typeof country !== "string"
    ) return NextResponse.json(
        { error: "Invalid fields in body for branch location addition request." },
        { status: 400 }
    );

    const existingBranch = await prisma.branchLocation.findUnique({
        where: { city: city, country: country },
        select: { city: true, country: true },
    });
    if (existingBranch) return NextResponse.json(
        { error: "Branch location with the city provided already exists." },
        { status: 409 }
    );

    const branch = await prisma.branchLocation.create({
        data: {
            city: city,
            country: country
        },
        select: {
            id: true,
            city: true,
            country: true
        },
    });

    if (!branch?.id) return NextResponse.json(
        { error: "Invalid response returned from branch location addition request" },
        { status: 400 }
    );

    return NextResponse.json(
        { message: "Branch location created successfully!"},
        { status: 201},
        {
            id: branch.id.toString(),
            country: branch.country,
            city: branch.city
        },
    )
}