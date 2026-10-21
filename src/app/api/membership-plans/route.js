import "server-only"; // helps prevent the module from being imported into the browser code
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const plans = await prisma.membershipPlan.findMany({
            orderBy: {
                id: "asc",
            },
            select: {
                id: true,
                type: true,
                name: true,
                description: true,
                popular: true,
                pricing: {
                    select: {
                        id: true,
                        period: true,
                        currency: true,
                        amount: true,
                    },
                    orderBy: { id: "asc" }
                },
                perks: {
                    select: {
                        id: true,
                        name: true
                    },
                    orderBy: { id: "asc" },
                },
            },
        });

        const result = plans.map((plan) => ({
            ...plan,
            id: String(plan.id),
            pricing: plan.pricing.map((price) => (
                {
                    ...price,
                    id: String(price.id),
                    amount: price.amount.toString(),
                }
            )),
            perks: plan.perks.map((perk) => (
                {
                    ...perk,
                    id: String(perk.id),
                }
            )),
        }));

        return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
    } catch (error) {
        console.error("Failed to fetch membership plans: ", error);

        return NextResponse.json(
            { error: "Unable to load membership plans" },
            { status: 500 }
        )
    }
}