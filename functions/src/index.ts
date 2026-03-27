import {onCall, HttpsError} from "firebase-functions/v2/https";
import {initializeApp} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";
import {defineSecret} from "firebase-functions/params";
import {Resend} from "resend";

initializeApp();

const resendApiKey = defineSecret("RESEND_API_KEY");

export const sendPasswordResetEmail = onCall(
  {secrets: [resendApiKey]},
  async (request) => {
    const {email} = request.data as {email: string};

    if (!email) {
      throw new HttpsError("invalid-argument", "Email is required.");
    }

    let resetLink: string;
    try {
      resetLink = await getAuth().generatePasswordResetLink(email);
    } catch {
      throw new HttpsError("not-found", "No account found with that email.");
    }

    const resend = new Resend(resendApiKey.value());
    await resend.emails.send({
      from: "Campus Shuttle <onboarding@resend.dev>",
      to: [email],
      subject: "Reset your Campus Shuttle password",
      html: `
        <div style="font-family:Inter,sans-serif;max-width:480px;
          margin:0 auto;padding:32px;background:#f1f8f1;border-radius:16px;">
          <h1 style="font-size:22px;font-weight:800;
            color:#006b0a;margin-bottom:8px;">
            Reset your password
          </h1>
          <p style="font-size:14px;color:#3f4a40;
            line-height:1.6;margin-bottom:24px;">
            We received a request to reset the password for your
            KNUST Campus Shuttle account.
            Click the button below — this link expires in 1 hour.
          </p>
          <a href="${resetLink}"
            style="display:inline-block;background:#006b0a;
              color:#ffffff;padding:14px 28px;border-radius:12px;
              text-decoration:none;font-size:15px;font-weight:700;">
            Reset Password
          </a>
          <p style="font-size:12px;color:#717971;margin-top:24px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    return {success: true};
  }
);
