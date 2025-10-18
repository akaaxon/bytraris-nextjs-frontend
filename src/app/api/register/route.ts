import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabaseClient";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Hash password 
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const { data, error } = await supabase
      .from("users")
      .insert([{ name, email, password: hashedPassword }])
      .select(); 

    if (error) {
      console.error(error);
      return NextResponse.json(
        { message: "Error occurred while registering.", error },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "User Registered", data }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Unexpected error occurred while registering.", err },
      { status: 500 }
    );
  }
}
