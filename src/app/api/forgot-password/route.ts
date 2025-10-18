import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabaseClient";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req: Request) {
  const body = await req.json();
  const { email } = body;

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  try {

    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (fetchError || !user) {
      return NextResponse.json({ message: "No user found" }, { status: 404 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour


    const { error: updateError } = await supabase
      .from("users")
      .update({
        reset_token: token,
        reset_token_expiry: expiry,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error(updateError);
      return NextResponse.json(
        { message: "Failed to generate reset token", error: updateError.message },
        { status: 500 }
      );
    }

    const resetUrl = `${process.env.NEXTAUTH_URL}/resetPassword?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Bytaris Support" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Reset your password",
      html: `
        <p>You requested to reset your password.</p>
        <p>Click <a href="${resetUrl}">here</a> to reset your password. This link is valid for 1 hour.</p>
      `,
    });

    return NextResponse.json({ message: "Reset link sent" }, { status: 200 });
  } catch (err) {
    console.error("Error in forgot-password route:", err);
    return NextResponse.json({ message: "Something went wrong", error: err }, { status: 500 });
  }
}
