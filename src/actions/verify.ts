"use server";

import prisma from "@/lib/prisma";

export async function verifyEmail(token: string) {
    if (!token) {
        return { error: "Verification token is required." };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { verification_token: token },
        });

        if (!user) {
            return { error: "Invalid or expired verification token." };
        }

        if (user.email_verified) {
            return { success: true, message: "Email is already verified." };
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                email_verified: true,
                verification_token: null,
            },
        });

        return { success: true, message: "Email verified successfully!" };
    } catch (error: any) {
        console.error("Verification error:", error);
        return { error: "Verification failed. Please try again." };
    }
}
