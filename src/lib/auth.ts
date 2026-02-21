import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        // Google OAuth
        ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
            ? [
                GoogleProvider({
                    clientId: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                }),
            ]
            : []),

        // Apple OAuth
        ...(process.env.APPLE_ID && process.env.APPLE_SECRET
            ? [
                AppleProvider({
                    clientId: process.env.APPLE_ID!,
                    clientSecret: process.env.APPLE_SECRET!,
                }),
            ]
            : []),

        // Email/Password credentials
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                const email = credentials.email.toLowerCase();
                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user) {
                    throw new Error("Account not found");
                }

                if (!user.password_hash) {
                    throw new Error("This account does not have a password. Please sign in with Google or Apple.");
                }

                const isPasswordCorrect = await bcrypt.compare(
                    credentials.password,
                    user.password_hash
                );

                if (!isPasswordCorrect) {
                    throw new Error("Invalid email or password");
                }

                if (!user.email_verified) {
                    throw new Error("Please verify your email before signing in. Check your inbox for the verification link.");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async signIn({ user, account }) {
            // Handle OAuth sign-in: create or link user
            if (account?.provider && account.provider !== "credentials") {
                const email = user.email?.toLowerCase();
                if (!email) return false;

                let dbUser = await prisma.user.findUnique({
                    where: { email },
                });

                if (!dbUser) {
                    // Create new user for OAuth
                    dbUser = await prisma.user.create({
                        data: {
                            email,
                            name: user.name || email.split("@")[0],
                            image: user.image,
                        },
                    });
                }

                // Store the user ID so JWT callback can use it
                user.id = dbUser.id;
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.image = (user as any).image;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).id = token.id;
                (session.user as any).image = token.image;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
};
