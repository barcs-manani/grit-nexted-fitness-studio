import "server-only"

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mailRegEx } from "@/data/InputValidation";

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            fullName,
            emailAddress,
            phoneNumber,
            age,
            branch,
            membershipType
        } = body;
        if (
            typeof fullName !== "string" ||
            !fullName.trim() ||
            fullName.trim().length > 150 ||
            typeof emailAddress !== "string" ||
            typeof phoneNumber !== "string" ||
            typeof age !== "number" ||
            typeof branch !== "number" ||
            typeof membershipType !== "string"
        ) {
            return NextResponse.json(
                { error: "Please provide all required registration fields!" },
                { status: 400 }
            );
        }

        const normEmail = emailAddress.trim().toLowerCase();
        const normName = fullName.trim();
        const normPhone = phoneNumber.trim();

        if (
            normEmail.length > 254 ||
            !mailRegEx.test(normEmail)
        ) {
            return NextResponse.json(
                { error: "Please provide a valid email address" },
                { status: 400 }
            )
        }

        if (normPhone.length > 30) {
            return NextResponse.json(
                { error: "The phone number provided is too long!" },
                { status: 400 }
            )
        }

        // Resolve the plan from the database
        const plan = await prisma.membership_plans.findUnique({
            where: { type: membershipType },
            select: { id: true, type: true, name: true }
        });
        if (!plan) {
            return NextResponse.json(
                { error: "The selected membership plan is invalid " },
                { status: 400 }
            );
        }
        const registration = await prisma.registrations.create({
            data: {
                fullName: normName,
                emailAddress: normEmail,
                phoneNumber: normPhone,
                ageGroupId: BigInt(age),
                branchId: BigInt(branch),
                membershipPlanId: plan.id,
            },
            select: {
                id: true,
                fullName: true,
                createdAt: true
            },
        });

        return NextResponse.json(
            {
                message: "Registration submitted successfully",
                registration: {
                    id: registration.id.toString(),
                    fullName: registration.fullName,
                    createdAt: registration.createdAt,
                    membershipType: plan.type,
                },
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("Registration submission failed: ", error);
        return NextResponse.json(
            { error: "Unable to submit your registration please try again." },
            { status: 500 }
        )
    }
}