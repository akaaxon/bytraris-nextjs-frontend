import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

  
    const { data: user, error } = await supabase
      .from("users")
      .select("id")  
      .eq("email", email)
      .single();    

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ user: null });
      }
      console.error(error);
      return NextResponse.json({ message: "Error fetching user", error }, { status: 500 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Unexpected error", err }, { status: 500 });
  }
}
