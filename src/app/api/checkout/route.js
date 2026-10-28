import "server-only";

import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request) {
    const account = await getCurrentUser();
    if (!account) {
        return NextResponse.json(
            { error: "User must be signed in for this transaction." },
            { status: 401 }
        );
    }
    let body;
    try {
        body = await request.json();
    } catch (error) {
        return NextResponse.json(
            { error: "Invalid request body for payment request" },
            { status: 400 }
        );
    }

    try {
        const {
            membershipPlanId,
            primaryAccount,
            ageGroupId,
            branchId,
            fullName,
            emailAddress,
            phoneNumber
        } = body;

        if (
            typeof membershipPlanId !== "string" || !membershipPlanId.trim() ||
            (primaryAccount && typeof primaryAccount !== "boolean") ||
            typeof fullName !== "string" || !fullName.trim() ||
            typeof emailAddress !== "string" || !emailAddress.trim() ||
            typeof phoneNumber !== "string" || !phoneNumber.trim() ||
            typeof ageGroupId !== "number" || !Number.isSafeInteger(ageGroupId) ||
            typeof branchId !== "number" || !Number.isSafeInteger(branchId)
        ) {
            return NextResponse.json(
                { error: "Membership registration request body is invalid" },
                { status: 400 }
            );
        }
        const memPlanIntId = Number(membershipPlanId);
        if (!Number.isSafeInteger(memPlanIntId)) {
            return NextResponse.json(
                { error: "Membership plan id is invalid" },
                { status: 400 }
            );
        }
        const plan = await prisma.membershipPlan.findUnique({
            where: { id: memPlanIntId, },
            select: {
                id: true,
                type: true,
                pricing: {
                    select: {
                        id: true,
                        period: true,
                        currency: true,
                        amount: true,
                    },
                },
            },
        });
        if (!plan) {
            return NextResponse.json(
                { error: "Membership plan not found" },
                { status: 404 }
            );
        }
        if (!plan.pricing.length) {
            return NextResponse.json(
                { error: "Membership plan has no recorded pricing model." },
                { status: 400 }
            );
        }
        const { id, amount, currency, period } = plan.pricing[0];
        const amountFmt = Math.round(Number(amount) * 100);
        const periodFmt = period.slice(0, -2);
        if (!Number.isSafeInteger(amountFmt) || amountFmt <= 0) {
            return NextResponse.json(
                { error: "Invalid membership plan price" },
                { status: 400 }
            );
        }

        const order = await prisma.$transaction(
            async (tx) => {
                const createdOrder = await tx.order.create({
                    data: {
                        accountId: BigInt(account.id),
                        paymentState: "PENDING",
                        orderItems: {
                            create: {
                                membershipPlanId: memPlanIntId,
                                membershipPriceId: id,
                                itemAmount: amount,
                                totalPaid: 0.00,
                                currency: currency,
                            },
                        },
                        pendingMemberships: {
                            create: {
                                membershipPlanId: memPlanIntId,
                                primaryAccount: primaryAccount,
                                fullName: fullName.trim(),
                                emailAddress: emailAddress.trim(),
                                phoneNumber: phoneNumber.trim(),
                                ageGroupId: ageGroupId,
                                branchId: branchId,
                            }
                        },
                    },
                    select: {
                        id: true,
                        paymentState: true
                    }
                });
                if (!createdOrder?.id) {
                    throw new Error("Invalid response from order create request.");
                }
                return createdOrder;
            }
        );
        if (!order?.id) {
            return NextResponse.json(
                { error: "Invalid response returned by order create request." },
                { status: 400 }
            )
        }

        const appURL = process.env.NEXT_PUBLIC_APP_URL;
        if (!appURL) {
            throw new Error("NEXT_PUBLIC_APP_URL is not configured!");
        }

        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            allowed_payment_method_types: ["card"],
            client_reference_id: order.id.toString(),
            metadata: {
                orderId: order.id.toString(),
            },
            line_items: [
                {
                    price_data: {
                        currency: currency,
                        product_data: {
                            name: `${plan.type} membership plan`,
                        },
                        unit_amount: amountFmt,
                        recurring: {
                            interval: periodFmt
                        }
                    },
                    quantity: 1,
                },
            ],
            success_url: `${appURL}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${appURL}/payments/cancelled`,
        });

        if (!session) {
            return NextResponse.json(
                { error: "Stripe session could not be created. " },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { checkoutURL: session.url, orderId: order.id.toString() },
        );
    } catch (err) {
        console.error("Checkout session failed: ", err);
        return NextResponse.json(
            { error: "Unable to start checkout." },
            { status: 500 }
        );
    }
}