// app/api/documents/get/route.ts
import { supabase } from "../../../../../lib/supabaseClient";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth-config";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch documents only for this user
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_email", userEmail)
      .order("uploaded_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Map each document to include the public URL using the full path
    const documentsWithUrls = data.map((doc) => {
      const { data: urlData } = supabase.storage
        .from("documents")
        .getPublicUrl(doc.file_path);

      return {
        ...doc,
        file_url: urlData?.publicUrl ?? "",
      };
    });

    return NextResponse.json({ documents: documentsWithUrls });
  } catch {
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}
