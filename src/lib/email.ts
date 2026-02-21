import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "SpendSantai <onboarding@resend.dev>";

export async function sendVerificationEmail(
    email: string,
    token: string,
    name?: string | null
) {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const verificationUrl = `${baseUrl}/verify?token=${token}`;

    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: "Verify your SpendSantai account",
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0a0a12;font-family:'Inter',system-ui,-apple-system,sans-serif;">
    <div style="max-width:480px;margin:40px auto;padding:0 20px;">
        <!-- Header -->
        <div style="text-align:center;padding:32px 0;">
            <h1 style="color:#f0f0f5;font-size:24px;font-weight:700;margin:0;">SpendSantai</h1>
            <p style="color:rgba(240,240,245,0.55);font-size:14px;margin:8px 0 0;">Smart Financial Tracker</p>
        </div>

        <!-- Card -->
        <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:40px 32px;text-align:center;">
            <div style="width:64px;height:64px;margin:0 auto 24px;background:rgba(99,102,241,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;">
                <span style="font-size:28px;">✉️</span>
            </div>

            <h2 style="color:#f0f0f5;font-size:20px;font-weight:700;margin:0 0 8px;">Verify your email</h2>
            <p style="color:rgba(240,240,245,0.55);font-size:14px;line-height:1.6;margin:0 0 32px;">
                Hi${name ? ` ${name}` : ""},<br>
                Click the button below to verify your account and start tracking your finances.
            </p>

            <!-- Button -->
            <a href="${verificationUrl}" 
               style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;text-decoration:none;padding:14px 40px;border-radius:14px;font-weight:600;font-size:14px;box-shadow:0 4px 20px rgba(99,102,241,0.3);">
                Verify My Account
            </a>

            <p style="color:rgba(240,240,245,0.35);font-size:12px;margin:24px 0 0;line-height:1.5;">
                Or copy and paste this link into your browser:<br>
                <a href="${verificationUrl}" style="color:#818cf8;word-break:break-all;">${verificationUrl}</a>
            </p>
        </div>

        <!-- Footer -->
        <div style="text-align:center;padding:24px 0;">
            <p style="color:rgba(240,240,245,0.25);font-size:11px;margin:0;">
                If you didn&apos;t create a SpendSantai account, you can safely ignore this email.
            </p>
        </div>
    </div>
</body>
</html>
            `.trim(),
        });

        if (error) {
            console.error("Resend error:", error);
            return { success: false, error: error.message };
        }

        return { success: true, id: data?.id };
    } catch (err: any) {
        console.error("Email send error:", err);
        return { success: false, error: err.message };
    }
}
