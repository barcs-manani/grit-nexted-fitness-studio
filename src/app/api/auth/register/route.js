import "server-only"

import * as argon2 from "argon2";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mailRegEx } from "@/lib/validation";
import { createSession } from "@/lib/auth";

export async function POST(request) {
    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid query for signup request!" },
            { status: 400 }
        )
    }
    try {
        const {
            fullName,
            emailAddress,
            phoneNumber,
            password,
            member
        } = body;
        if (
            typeof fullName !== "string" ||
            !fullName.trim() ||
            fullName.trim().length > 150 ||
            typeof emailAddress !== "string" ||
            typeof phoneNumber !== "string" ||
            typeof password !== "string" ||
            !member ||
            (!member?.branchId || typeof member.branchId !== "number") ||
            (!member?.ageGroupId || typeof member.ageGroupId !== "number") ||
            (!member?.membershipPlanId || typeof member.membershipPlanId !== "number")
        ) {
            return NextResponse.json(
                { error: "Invalid fields in member registration request" },
                { status: 400 }
            );
        }

        const normEmail = emailAddress.trim().toLowerCase();
        const existingAccount = await prisma.userAccount.findUnique({
            where: { emailAddress: normEmail },
            select: {
                emailAddress: true
            },
        });

        if (existingAccount) return NextResponse.json(
            { error: "Account with the email provided already exists!" },
            { status: 409 }
        );

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
        const plan = await prisma.membershipPlan.findUnique({
            where: { id: member.membershipPlanId },
            select: { id: true, type: true, name: true }
        });
        if (!plan) {
            return NextResponse.json(
                { error: "The selected membership plan is invalid " },
                { status: 400 }
            );
        }

        // Resolve the age group from the database
        const ageGroup = await prisma.memberAgeGroup.findUnique({
            where: { id: member.ageGroupId },
            select: { id: true, type: true, group: true }
        });
        if (!ageGroup) {
            return NextResponse.json(
                { error: "The selected age group is invalid " },
                { status: 400 }
            );
        }

        // Resolve the branch from the database
        const branch = await prisma.branchLocation.findUnique({
            where: { id: member.branchId },
            select: { id: true, city: true }
        });
        if (!branch) {
            return NextResponse.json(
                { error: "The selected branch location is invalid " },
                { status: 400 }
            );
        }
        const passwordHash = await argon2.hash(password);
        const { accountReg, memberReg } = await prisma.$transaction(
            async (tx) => {
                // create account
                const accountReg = await tx.userAccount.create({
                    data: {
                        fullName: normName,
                        emailAddress: normEmail,
                        phoneNumber: normPhone,
                        passwordHash,
                    },
                    select: {
                        id: true,
                        fullName: true,
                        emailAddress: true,
                        createdAt: true
                    },
                });
                if (!accountReg?.id) throw new Error("Account creation returned an invalid response!");

                // Create primary member record
                const memberReg = await tx.member.create({
                    data: {
                        accountId: accountReg.id,
                        primaryAccount: member.primaryAccount,
                        fullName: normName,
                        emailAddress: normEmail,
                        phoneNumber: normPhone,
                        ageGroupId: member.ageGroupId,
                        branchId: member.branchId,
                        membershipPlanId: member.membershipPlanId
                    },
                    select: {
                        id: true,
                        fullName: true,
                        createdAt: true
                    }
                });
                if (!memberReg?.id) throw new Error("Primary member record creation returned an invalid response!");

                return { accountReg, memberReg };
            }
        );

        return await createSession(
            {
                id: accountReg.id,
                fullName: accountReg.fullName,
                emailAddress: accountReg.emailAddress,
                createdAt: accountReg.createdAt,
            }
        );
    } catch (error) {
        console.error("Registration submission failed: ", error);
        return NextResponse.json(
            { error: "Unable to submit your registration please try again." },
            { status: 500 }
        );
    }
}