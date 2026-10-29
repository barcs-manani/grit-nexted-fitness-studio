import "server-only"
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const schedules = await prisma.schedule.findMany({
            orderBy: {
                id: "asc",
            },
            select: {
                id: true,
                period: true,
                times: {
                    select: {
                        id: true,
                        time: true,
                        description: true,
                        focusAreas: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        const result = schedules.map((sch) => ({
            ...sch,
            id: String(sch.id),
            times: sch.times.map((time) => (
                {
                    ...time,
                    id: String(time.id),                }
            )),
        }));

        return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
    } catch (error) {
        console.error("Failed to fetch schedules: ", error);
        return NextResponse.json(
            { error: "Unable to load schedules" },
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
            { error: "Invalid request body for schedule addition request" },
            { status: 400 }
        );
    }

    const {
        period,
        times,
    } = body;

    /*---------------------------VALIDATION--------------------------*/
    // Validate schedule
    if (typeof period !== "string" || !period.trim()) {
        return NextResponse.json(
            { error: "Invalid schedules in body for schedule addition request." },
            { status: 400 }
        );
    }

    const existingSchedule = await prisma.schedule.findUnique({
        where: { period: period },
        select: { period: true },
    });
    if (existingSchedule) return NextResponse.json(
        { error: "Schedule period provided already exists." },
        { status: 409 }
    );

    // Check for "custom" entry
    const hasTimes = times?.length && times.length > 0;
    if (hasTimes) {
        for (const t of times) {
            const { time, description, focusAreaIds } = t;
            if (
                typeof time !== "string" || !time.trim() ||
                typeof description !== "string" || !description.trim() ||
                !Array.isArray(focusAreaIds) || focusAreaIds.length === 0
            ) return NextResponse.json(
                { error: "Invalid schedule time in body for schedule addition request." },
                { status: 400 }
            );
        }

        // Validate focusAreaIds
        const focusIds = [...new Set(
            times.flatMap(({ focusAreaIds }) => focusAreaIds.map(Number))
        )];

        if (focusIds.some((id) => !Number.isSafeInteger(id) || id < 0)) {
            return NextResponse.json(
                { error: "Invalid focusAreaId." },
                { status: 400 }
            );
        }

        const existingFocusAreas = await prisma.fitnessField.findMany({
            where: { id: { in: focusIds } },
            select: { id: true }
        });
        if (existingFocusAreas.length !== focusIds.length) {
            return NextResponse.json(
                { error: "One or more focusAreaIds do not exist." },
                { status: 404 }
            );
        }
    }

    const schedule = await prisma.$transaction(
        async (tx) => {
            const createdSchedule = await tx.schedule.create({
                data: {
                    period: period.trim(),
                    times: hasTimes ? {
                        create: times.map(({ time, description, focusAreaIds }) => (
                            {
                                time: time.trim(),
                                description: description.trim(),
                                focusAreas: {
                                    connect: focusAreaIds.map((id) => ({ id: Number(id.trim()) })),
                                },
                            }
                        )),
                    } : null,
                },
                select: {
                    id: true,
                    period: true,
                    times: {
                        select: {
                            id: true,
                            time: true,
                            description: true,
                            focusAreas: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!createdSchedule?.id) return NextResponse.json(
                { error: "Invalid response returned from schedule addition request" },
                { status: 400 }
            );

            return createdSchedule;
        }
    );

    const result = {
        ...schedule,
        id: String(schedule.id),
        times: schedule.times.map((time) => (
            {
                ...time,
                id: String(time.id),
                focus: time.focusAreas.map((f) => (f.name))
            }
        )),
    };

    return NextResponse.json(
        {
            message: "Schedule added successfully!",
            schedule: result,
        },
        { status: 201 },
    );
}