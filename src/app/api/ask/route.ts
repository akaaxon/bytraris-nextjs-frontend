/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth-config";
import { supabase } from "../../../../lib/supabaseClient";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    if (!userEmail)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { question, document_id } = await req.json();
    if (!question)
      return NextResponse.json({ error: "Question required" }, { status: 400 });
    if (!document_id) {
      return NextResponse.json(
        { error: "document_id required" },
        { status: 400 }
      );
    }

    // Embed question
    const embedder = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY!,
      model: "text-embedding-004",
    });
    const queryEmbedding = await embedder.embedQuery(question);

    // Vector search with the help of a Postgres function and chatGPT code 
    const { data: matches, error:rpcError } = await supabase.rpc("match_documents", {
      query_embedding: queryEmbedding,
      match_count: 20,
      p_user_email: userEmail,
      p_document_id: document_id,
    });
    console.log("RPC error:", rpcError);
console.log("Raw matches:", matches);


    const context =
      matches
        ?.map((m: any) => `[${m.file_name}]\n${m.chunk}`)
        .join("\n\n") || "";

    // Ask Gemini
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
You are an AI study assistant. Use the provided document context to answer the question.Explain as much as possible don't depend on short questions. Don't include additional info if not asked to. Be very precise


DOCUMENT CONTEXT:
${context}

QUESTION:
${question}
`;

    const reply = await model.generateContent(prompt);
    const answer = reply.response.text();

    return NextResponse.json({ answer });
  } catch (err: any) {
    console.error("QA Route Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
