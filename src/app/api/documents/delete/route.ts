import { NextResponse } from "next/server";
import { supabase } from "../../../../../lib/supabaseClient";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth-config";

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, file_url } = await req.json();

    if (!id || !file_url) {
      return NextResponse.json({ error: "Missing document ID or URL" }, { status: 400 });
    }

    // Delete from storage
    const filePath = file_url.split("/storage/v1/object/public/documents/")[1];
    const { error: storageError } = await supabase.storage
      .from("documents")
      .remove([filePath]);

    if (storageError) {
      return NextResponse.json({ error: storageError.message }, { status: 500 });
    }

    // Delete from DB
    const { error: dbError } = await supabase
      .from("documents")
      .delete()
      .eq("id", id)
      .eq("user_email", userEmail);
      // TODO: Refactor flashcards deletioin to only delete related flashcards per document
    const {error: flashcardError} = await supabase
      .from("flashcards")
      .delete()
      .eq("user_email", userEmail); 

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }
    if (flashcardError) {
      return NextResponse.json({ error: flashcardError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
