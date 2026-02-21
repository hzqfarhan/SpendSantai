"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";

export async function registerUser(formData: FormData) {
    const email = (formData.get("email") as string)?.toLowerCase();
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    if (!email || !password) {
        return { error: "Missing fields" };
    }

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return { error: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomUUID();

    try {
        const user = await prisma.user.create({
            data: {
                email,
                password_hash: hashedPassword,
                name,
                email_verified: false,
                verification_token: verificationToken,
            },
        });

        // Send verification email
        const emailResult = await sendVerificationEmail(email, verificationToken, name);

        if (!emailResult.success) {
            console.warn("Failed to send verification email:", emailResult.error);
            // Don't fail registration — user can still verify via the on-screen link
        }

        return {
            success: true,
            userId: user.id,
            verificationToken: verificationToken,
            emailSent: emailResult.success,
        };
    } catch (error) {
        console.error("Registration error:", error);
        return { error: "Something went wrong" };
    }
}
