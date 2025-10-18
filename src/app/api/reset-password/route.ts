import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabaseClient";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }


    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("id")
      .eq("reset_token", token)
      .gt("reset_token_expiry", new Date().toISOString())
      .single();

    if (fetchError || !user) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }


    const hashedPassword = await bcrypt.hash(newPassword, 10);


    const { error: updateError } = await supabase
      .from("users")
      .update({
        password: hashedPassword,
        reset_token: null,
        reset_token_expiry: null,
      })
      .eq("id", user.id);

    if (updateError) {
      return NextResponse.json(
        { message: "Failed to reset password", error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error: error },
      { status: 500 }
    );
  }
}
