import "server-only"
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const trainers = await prisma.trainer.findMany({
            orderBy: { id: "asc" },
            select: {
                id: true,
                fullName: true,
                emailAddress: true,
                gender: true,
                imageURL: true,
                branch: {
                    select: {
                        id: true,
                        city: true,
                    },
                },
                fitnessFields: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        const result = trainers.map((trainer) => ({
            ...trainer,
            id: String(trainer.id),
            branch: {
                id: String(trainer.branch.id),
                city: trainer.branch.city
            },
            fitnessFields: trainer.fitnessFields.map(({ id, name }) => ({
                id: String(id),
                name: name,
            })),
        }));

        return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch trainers records." },
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
            { error: "Invalid request body for trainer addition request" },
            { status: 400 }
        );
    }

    const {
        fullName,
        emailAddress,
        gender,
        imageURL,
        branchId,
        fitnessFieldIds
    } = body;

    /*---------------------------VALIDATION--------------------------*/
    // Validate trainer
    if (
        typeof fullName !== "string" || !fullName.trim() ||
        typeof emailAddress !== "string" || !emailAddress.trim() ||
        typeof gender !== "string" || !gender.trim() ||
        typeof branchId !== "string" || !branchId.trim() ||
        !Array.isArray(fitnessFieldIds) || fitnessFieldIds.length === 0
    ) {
        return NextResponse.json(
            { error: "Invalid trainer addition request body." },
            { status: 400 }
        );
    }
    if (typeof imageURL !== "string" || !imageURL.trim()) console.warn("Trainer addition request missing image path")

    const normName = fullName.trim();
    const normEmail = emailAddress.trim();
    const normGender = gender.trim();
    const normURL = imageURL?.trim() || null;
    const branchID = Number(branchId.trim());

    if (!Number.isSafeInteger(branchID)) {
        return NextResponse.json(
            { error: "Invalid trainer branch item. Not a valid integer in string" },
            { status: 400 }
        );
    }

    const existingTrainer = await prisma.trainer.findUnique({
        where: { emailAddress: normEmail },
        select: { emailAddress: true },
    });
    if (existingTrainer) return NextResponse.json(
        { error: "A trainer with the email provided already exists." },
        { status: 409 }
    );

    // Validate fitnessFieldIds
    const fieldIds = [...new Set(
        fitnessFieldIds.map((f) => Number(f))
    )];

    if (fieldIds.some((id) => !Number.isSafeInteger(id) || id < 0)) {
        return NextResponse.json(
            { error: "Invalid fitnessFieldId." },
            { status: 400 }
        );
    }

    const existingFields = await prisma.fitnessField.findMany({
        where: { id: { in: fieldIds } },
        select: { id: true }
    });
    if (existingFields.length !== fieldIds.length) {
        return NextResponse.json(
            { error: "One or more fitnessFieldIds do not exist." },
            { status: 404 }
        );
    }

    const existingBranch = await prisma.branchLocation.findUnique({
        where: { id: branchID },
        select: { city: true }
    });
    if (!existingBranch) {
        return NextResponse.json(
            { error: "branch item does not exist." },
            { status: 404 }
        );
    }

    const trainer = await prisma.$transaction(
        async (tx) => {
            const addedTrainer = await tx.trainer.create({
                data: {
                    fullName: normName,
                    emailAddress: normEmail,
                    gender: normGender,
                    imageURL: normURL,
                    branch: {
                        connect: { id: branchID },
                    },
                    fitnessFields: {
                        connect: fitnessFieldIds.map((id) => ({ id: Number(id) })),
                    },
                },
                select: {
                    id: true,
                    fullName: true,
                    emailAddress: true,
                    gender: true,
                    branch: {
                        select: {
                            id: true,
                            city: true,
                            country: true,
                        },
                    },
                    fitnessFields: {
                        select: {
                            name: true
                        }
                    },
                    imageURL: true
                },
            });

            if (!addedTrainer?.id) return NextResponse.json(
                { error: "Invalid response returned from trainer addition request" },
                { status: 400 }
            );

            return addedTrainer;
        }
    );

    const result = {
        ...trainer,
        id: String(trainer.id),
        branch: {
            ...trainer.branch,
            id: String(trainer.branch.id),
        },
    };

    return NextResponse.json(
        {
            message: "Schedule added successfully!",
            schedule: result,
        },
        { status: 201 },
    );
}