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
};

export async function POST(request) {
    let body;
    try {
        body = await request.json();
    } catch (error) {
        return NextResponse.json(
            { error: "Invalid request body for age group addition request" },
            { status: 400 }
        );
    }

    const { type, group } = body;
    if (
        !type.trim() || typeof type !== "string" ||
        !group.trim() || typeof group !== "string"
    ) return NextResponse.json(
        { error: "Invalid fields in body for age group addition request." },
        { status: 400 }
    );

    const existingGroup = await prisma.memberAgeGroup.findUnique({
        where: { 
            type_group: {
                type: type.trim(),
                group: group.trim(),
            },
         },
        select: { type: true, group: true },
    });
    if (existingGroup) return NextResponse.json(
        { error: "Age group with the type provided already exists." },
        { status: 409 }
    );

    const ageGroup = await prisma.memberAgeGroup.create({
        data: {
            type: type,
            group: group
        },
        select: {
            id: true,
            group: true
        },
    });

    if (!ageGroup?.id) return NextResponse.json(
        { error: "Invalid response returned from age group addition request" },
        { status: 400 }
    );

    return NextResponse.json(
        { message: "Age group created successfully!"},
        { status: 201},
        {
            id: ageGroup.id.toString(),
            group: ageGroup.group
        }
    )
}