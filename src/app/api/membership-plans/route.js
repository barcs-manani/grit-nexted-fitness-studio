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
};

export async function POST(request) {
    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid query for membership plan create request" },
            { status: 400 }
        )
    }
    try {
        const {
            type,
            name,
            description,
            popular,
            pricing = [],
            perks = [],
        } = body;

        if (
            typeof type !== "string" || !type.trim() ||
            typeof name !== "string" || !name.trim() ||
            typeof description !== "string" || !description.trim() ||
            !pricing || !Array.isArray(pricing) || pricing.length === 0 ||
            !perks || !Array.isArray(perks) || perks.length === 0
        ) return NextResponse.json(
            { error: "Invalid fields in plan addition request!" },
            { status: 400 },
        );

        const existingPlanType = await prisma.membershipPlan.findUnique({
            where: { type: type.trim() },
            select: {
                type: true
            },
        });

        if (existingPlanType) return NextResponse.json(
            { error: "Membership plan with the type provided already exists!" },
            { status: 409 }
        );

        const plan = await prisma.$transaction(
            async (tx) => {
                const createdPlan = await tx.membershipPlan.create({
                    data: {
                        type: type.trim(),
                        name: name.trim(),
                        description: description.trim(),
                        popular: popular ?? false,
                        pricing: {
                            create: pricing.map(({ period, currency, amount }) => ({
                                period: period.trim(),
                                currency: currency.trim(),
                                amount, // Send a decimal string eg "15.00"
                            }))
                        },
                        perks: {
                            create: perks.map(({ name }) => ({ name: name.trim() }))
                        },
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
                                amount: true
                            }
                        },
                        perks: {
                            select: {
                                id: true,
                                name: true
                            },
                        },
                        createdAt: true
                    }
                });
                if (!createdPlan?.id) throw new Error("Plan creation request returned an invalid response!");

                return createdPlan;
            }
        );
        return NextResponse.json(
            {
                ...plan,
                id: String(plan.id),
                pricing: plan.pricing.map((price) => ({
                    ...price,
                    id: String(price.id),
                    amount: price.amount.toString(),
                })),
                perks: plan.perks.map((perk) => ({
                    ...perk,
                    id: String(perk.id),
                })),
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Membership plan submission failed: ", error);
        return NextResponse.json(
            { error: "Unable to submit membership plan please try again." },
            { status: 500 }
        )
    }
};