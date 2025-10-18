import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth-config";
import { supabase } from "../../../../../lib/supabaseClient";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    if (!userEmail)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { file_path, document_id } = await req.json();

    let targetFilePath = file_path;

    // Resolve file_path if only document_id is sent
    if (!targetFilePath && document_id) {
      const { data: doc, error: docError } = await supabase
        .from("documents")
        .select("file_path")
        .eq("id", document_id)
        .single();
      if (docError || !doc?.file_path) {
        return NextResponse.json({ error: "Invalid document_id" }, { status: 400 });
      }
      targetFilePath = doc.file_path;
    }

    if (!targetFilePath)
      return NextResponse.json({ error: "file_path or document_id required" }, { status: 400 });

    // Fetch chunks from Supabase
    const { data: chunks, error: chunkError } = await supabase
      .from("documents_embeddings")
      .select("*")
      .eq("user_email", userEmail)
      .eq("file_path", targetFilePath);

    if (chunkError) throw chunkError;
    if (!chunks || chunks.length === 0)
      return NextResponse.json({ error: "No chunks found" }, { status: 404 });

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const combinedText = chunks.map(c => c.chunk).join("\n\n");

    const prompt = `
You are an AI study assistant.
From the following text, generate 10 concise flashcards in strict JSON format.
Each flashcard must look like this:
{"question": "...", "answer": "..."}
Rules:
- Keep questions short and clear.
- Keep answers concise and correct.
- Respond ONLY with a JSON array.

TEXT:
${combinedText}
    `;

    const response = await model.generateContent(prompt);
    const rawText = response.response.text();

    let cleanedText = rawText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    const jsonMatch = cleanedText.match(/\[.*\]/s);
    if (jsonMatch) cleanedText = jsonMatch[0];

    let flashcards: { question: string; answer: string }[] = [];
    try {
      flashcards = JSON.parse(cleanedText);
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    if (!flashcards.length)
      return NextResponse.json({ error: "No flashcards generated" }, { status: 500 });

    // Delete old flashcards for this file
    await supabase
      .from("flashcards")
      .delete()
      .eq("user_email", userEmail)
      .eq("file_path", targetFilePath);

    // Insert new flashcards
    const { error: insertError } = await supabase.from("flashcards").insert(
      flashcards.map(fc => ({
        user_email: userEmail,
        file_path: targetFilePath,
        question: fc.question,
        answer: fc.answer,
      }))
    );

    if (insertError) throw insertError;

    return NextResponse.json({ message: "Flashcards generated", count: flashcards.length });
  } catch (error) {
    console.error("POST flashcards error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
