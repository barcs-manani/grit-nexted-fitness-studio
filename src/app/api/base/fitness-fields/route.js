import "server-only"
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const fields = await prisma.fitnessField.findMany({
            orderBy: {
                id: "asc",
            },
            select: {
                id: true,
                name: true,
            },
        });

        const result = fields.map((field) => ({
            ...field,
            id: String(field.id)
        }));

        return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
    } catch (error) {
        console.error("Failed to fetch fitness fields: ", error);
        return NextResponse.json(
            { error: "Unable to load fitness fields" },
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
            { error: "Invalid request body for fitness field addition request" },
            { status: 400 }
        );
    }

    const { name } = body;
    if (!name.trim() || typeof name !== "string") {
        return NextResponse.json(
            { error: "Invalid fields in body for fitness field addition request." },
            { status: 400 }
        );
    }

    const existingField = await prisma.fitnessField.findUnique({
        where: { name: name.trim().toLowerCase() },
        select: { name: true },
    });
    if (existingField) {
        return NextResponse.json(
            { error: "Field name provided already exists." },
            { status: 409 }
        );
    }

    const fitnessField = await prisma.fitnessField.create({
        data: { name: name.trim().toLowerCase(), },
        select: {
            id: true,
            name: true,
        },
    });

    if (!fitnessField?.id) return NextResponse.json(
        { error: "Invalid response returned from fitness field addition request" },
        { status: 400 }
    );

    return NextResponse.json(
        { message: "Fitness field created successfully!" },
        { status: 201 },
        {
            id: fitnessField.id.toString(),
            name: fitnessField.name,
        },
    );
}