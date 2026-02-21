"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: { name: string; image?: string }) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");
    const userId = (session.user as any).id;

    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                image: data.image,
            },
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error: any) {
        console.error("DEBUG_ERROR: Failed to update profile:", error);
        return { error: "Failed to update profile." };
    }
}

export async function changePassword(data: { oldPassword: string; newPassword: string }) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");
    const userId = (session.user as any).id;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) throw new Error("User not found");

        if (!user.password_hash) {
            return { error: "This account uses social login and has no password set." };
        }

        const isPasswordCorrect = await bcrypt.compare(data.oldPassword, user.password_hash);
        if (!isPasswordCorrect) {
            return { error: "Current password is incorrect." };
        }

        const hashedPassword = await bcrypt.hash(data.newPassword, 12);
        await prisma.user.update({
            where: { id: userId },
            data: { password_hash: hashedPassword },
        });

        return { success: true };
    } catch (error: any) {
        console.error("DEBUG_ERROR: Failed to change password:", error);
        return { error: "Failed to change password." };
    }
}
