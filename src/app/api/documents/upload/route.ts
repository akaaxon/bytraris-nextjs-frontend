import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth-config";
import { supabase } from "../../../../../lib/supabaseClient";
import { randomUUID } from "crypto";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { GoogleAuth } from "google-auth-library";
import path from "path";

const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 150;

// -------------------- UTIL FUNCTIONS --------------------

function chunkTextWithOverlap(text: string) {
  const chunks: { text: string }[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length);
    chunks.push({ text: text.slice(start, end) });
    start += CHUNK_SIZE - CHUNK_OVERLAP;
  }
  return chunks;
}

async function getAccessToken() {
  const auth = new GoogleAuth({
    keyFile: path.join(process.cwd(), "ocr-platform-473411-1d4b1bf9cd16.json"),
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });

  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  return tokenResponse.token;
}



async function extractTextWithDocumentAIRest(buffer: Buffer): Promise<string> {
  const endpoint = `https://eu-documentai.googleapis.com/v1/projects/637363361869/locations/eu/processors/a3bfe9b26e358b72:process`;
  const base64Content = buffer.toString("base64");

  const requestBody = {
    inlineDocument: {
      content: base64Content,
      mimeType: "application/pdf",
    },
  };

  console.log("Sending request to Document AI...");
  console.log("PDF size (bytes):", buffer.length);
  console.log("Request body keys:", Object.keys(requestBody));
  console.log("MIME type:", requestBody.inlineDocument.mimeType);

  const token = await getAccessToken();
  if (!token) {
    throw new Error("Failed to get Google Cloud access token.");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });

  console.log("📥 Document AI Response Status:", response.status);

  const rawResponse = await response.text();
  console.log("📄 Raw Response Text:", rawResponse.slice(0, 500)); // only log first 500 chars for testing remove later

  if (!response.ok) {
    throw new Error(`Document AI REST call failed (${response.status}): ${rawResponse}`);
  }

  let result: any;
  try {
    result = JSON.parse(rawResponse);
  } catch (parseError) {
    console.error("❌ Failed to parse Document AI JSON:", parseError);
    throw new Error("Invalid JSON returned from Document AI.");
  }

 // Extract text according to the response structure, handling both JSON formats in case it is text or document with pages
const document = result.document;
let finalText = "";
if (document?.text) {
  finalText = document.text;
} else if (document?.pages) {
  // fallback: build from blocks if needed
  for (const page of document.pages) {
    for (const block of page.blocks || []) {
      if (block.layout?.textAnchor?.textSegments) {
        for (const segment of block.layout.textAnchor.textSegments) {
          const startIndex = parseInt(segment.startIndex || 0);
          const endIndex = parseInt(segment.endIndex || 0);
          finalText += document.text?.slice(startIndex, endIndex) || "";
        }
      }
    }
    finalText += "\n";
  }
}

console.log("✅ Extracted text length:", finalText.length);
return finalText.trim();

}




export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    if (!userEmail)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file)
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (file.type !== "application/pdf")
      return NextResponse.json({ error: "Unsupported file type." }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop();
    const filePath = `${userEmail}/${randomUUID()}.${ext}`;

    // Upload to Supabase
    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, buffer, { contentType: file.type });
    if (uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 });

    console.log(`📦 Uploaded file ${file.name} (${buffer.length} bytes) to ${filePath}`);

    // --- OCR with Document AI ---
    const text = await extractTextWithDocumentAIRest(buffer);
    if (!text)
      return NextResponse.json({ error: "OCR failed. No text extracted." }, { status: 400 });

    const chunks = chunkTextWithOverlap(text);
    console.log("🧩 Created text chunks:", chunks.length);

    // --- Embed ---
    const embedder = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY!,
      model: "text-embedding-004",
    });

    const embeddings: number[][] = [];
    for (const chunk of chunks) {
      const embedding = await embedder.embedQuery(chunk.text);
      embeddings.push(embedding);
    }
    console.log("✨ Generated embeddings for all chunks.");

    // --- Save metadata ---
    const { data: publicUrlData } = supabase.storage
      .from("documents")
      .getPublicUrl(filePath);
    const fileUrl = publicUrlData?.publicUrl ?? "";

    const { data: docData, error: docInsertError } = await supabase
      .from("documents")
      .insert({
        user_email: userEmail,
        file_name: file.name,
        file_path: filePath,
        file_url: fileUrl,
        file_type: file.type,
        uploaded_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (docInsertError) throw docInsertError;

    // --- Save embeddings ---
    const { error: insertError } = await supabase
      .from("documents_embeddings")
      .insert(
        chunks.map((c, i) => ({
          document_id: docData.id,
          user_email: userEmail,
          file_path: filePath,
          chunk: c.text,
          embedding: embeddings[i],
        }))
      );

    if (insertError) throw insertError;

    return NextResponse.json({
      message: "✅ PDF uploaded, OCR processed via Document AI (REST), and embedded successfully.",
      url: fileUrl,
      document_id: docData.id,
    });
  } catch (err: any) {
    console.error("🚨 Upload Route Error:", err.message);
    console.error("🔍 Full error object:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
