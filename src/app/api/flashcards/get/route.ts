import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth-config";
import { supabase } from "../../../../../lib/supabaseClient";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    if (!userEmail)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const document_id = req.nextUrl.searchParams.get("id");
    if (!document_id)
      return NextResponse.json({ error: "document_id is required" }, { status: 400 });

    // Resolve file_path from document_id
    const { data: doc, error: docError } = await supabase
      .from("documents")
      .select("file_path")
      .eq("id", document_id)
      .single();
    if (docError || !doc?.file_path)
      return NextResponse.json({ error: "Invalid document_id" }, { status: 400 });

    const { data: flashcards, error } = await supabase
      .from("flashcards")
      .select("*")
      .eq("user_email", userEmail)
      .eq("file_path", doc.file_path)
      .order("page_number", { ascending: true });

    if (error)
      return NextResponse.json({ error: "Failed to fetch flashcards" }, { status: 500 });

    return NextResponse.json({ flashcards: flashcards || [] });
  } catch (err) {
    console.error("GET flashcards error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
