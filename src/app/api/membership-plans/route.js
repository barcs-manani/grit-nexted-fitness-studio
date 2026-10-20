import "server-only"; // helps prevent the module from being imported into the browser code
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const plans = await prisma.membership_plans.findMany({
            orderBy: {
                id: "asc",
            },
            select: {
                id: true,
                type: true,
                name: true,
                monthlyPrice: true
            },
        });

        const result = plans.map((plan) => ({
            ...plan,
            id: plan.id.toString(),
            monthlyPrice: Number(plan.monthlyPrice),
        }));

        return NextResponse.json(result);
    } catch (error) {
        console.error("Failed to fetch membership plans: ", error);

        return NextResponse.json(
            { error: "Unable to load membership plans" },
            { status: 500 }
        )
    }
}