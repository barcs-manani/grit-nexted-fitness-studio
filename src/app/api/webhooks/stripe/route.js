import "server-only";

import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { digitStrRegEx } from "@/lib/validation";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request) {
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
        return NextResponse.json(
            { error: "Missing Stripe signature." },
            { status: 400 }
        );
    }
    const rawBody = await request.text();
    let event;
    try {
        event = stripe.webhooks.constructEvent(
            rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("Invalid Stripe webhook signature: ", err);
        return NextResponse.json(
            { error: "Invalid webhook signature." },
            { status: 400 }
        );
    }
    try {
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;

            // For delayed payment methods, completed does not always mean the funds have arrived
            if (session.payment_status === "paid") {
                const orderId = session.metadata?.orderId;

                if (!orderId || !digitStrRegEx.test(orderId)) {
                    return NextResponse.json(
                        { error: "Missing or Invalid orderId in Stripe session." },
                        { status: 400 }
                    );
                }
                const orderIntID = BigInt(orderId);
                await prisma.$transaction(
                    async (tx) => {
                        const order = await tx.order.findUnique({
                            where: { id: orderIntID },
                            include: {
                                orderItems: true,
                                pendingMemberships: true,
                            },
                        });
                        if (!order) {
                            return NextResponse.json(
                                { error: "Order not found!" },
                                { status: 404 }
                            );
                        }

                        // VALIDATE/CHANGE paymentState of order to paid
                        if (order.paymentState === "PAID") return order;

                        await tx.order.update({
                            where: { id: order.id },
                            data: {
                                paymentState: "PAID"
                            },
                        });

                        for (const orderItem of order.orderItems) {
                            await tx.orderItem.update({
                                where: { id: orderItem.id },
                                data: {
                                    totalPaid: orderItem.itemAmount,
                                },
                            });
                        }

                        for (const pendingMem of order.pendingMemberships) {
                            await tx.pendingMembership.update({
                                where: { id: pendingMem.id },
                                data: {
                                    isProcessed: true,
                                },
                            });
                        }

                        // Add new members
                        for (const pendingMem of order.pendingMemberships) {
                            await tx.member.create({
                                data: {
                                    accountId: order.accountId,
                                    primaryAccount: pendingMem.primaryAccount,
                                    fullName: pendingMem.fullName,
                                    emailAddress: pendingMem.emailAddress,
                                    phoneNumber: pendingMem.phoneNumber,
                                    ageGroupId: pendingMem.ageGroupId,
                                    branchId: pendingMem.branchId,
                                    membershipPlanId: pendingMem.membershipPlanId,
                                    isActive: true,
                                },
                            });
                        }
                        return order;
                    }
                );
                return NextResponse.json({ received: true });
            }
            return NextResponse.json({ received: false });
        }
    } catch (err) {
        console.error("Webhook processing failed: ", err);
        return NextResponse.json(
            { error: "Webhook processing failed: " },
            { status: 500 }
        )
    }
}