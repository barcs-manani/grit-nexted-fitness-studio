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
            password
        } = body;
        if (
            typeof fullName !== "string" ||
            !fullName.trim() ||
            fullName.trim().length > 150 ||
            typeof emailAddress !== "string" ||
            typeof phoneNumber !== "string" ||
            typeof password !== "string"
        ) {
            return NextResponse.json(
                { error: "Invalid fields in signup request" },
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

        const passwordHash = await argon2.hash(password);
        const accountReg = await prisma.userAccount.create({
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
        )
    }
}