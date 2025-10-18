"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Loader2,
  CheckCircle2,
  XCircle,
  Trash2,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

type UploadedFile = {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
};



export default function UploadDocuments() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<UploadedFile | null>(
    null
  );
  const [deleteFile, setDeleteFile] = useState<UploadedFile | null>(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Fetch files
  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/documents/get");
      if (!res.ok) throw new Error("Failed to fetch files");
      const data = await res.json();
      setUploadedFiles(data.documents || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Upload file
  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");

      const uploadData = await res.json();
      setMessage({ type: "success", text: "File uploaded successfully!" });
      setFile(null);

      // Refresh list
      fetchFiles();

      // Generate flashcards
      await generateFlashcards(uploadData.document_id);
    } catch (err :unknown) {
      setMessage({ type: "error", text: (err instanceof Error && err.message) ? err.message : "Failed to upload file", });
    } finally {
      setUploading(false);
    }
  };

  // Generate flashcards
  const generateFlashcards = async (documentId: string) => {
    try {
      const res = await fetch("/api/flashcards/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document_id: documentId }),
      });
      if (!res.ok) throw new Error("Failed to generate flashcards");
      const data = await res.json();
      console.log("Flashcards generated:", data);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete file
  const confirmDelete = async () => {
    if (!deleteFile) return;

    try {
      const res = await fetch("/api/documents/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: deleteFile.id,
          file_url: deleteFile.file_url,
        }),
      });
      if (!res.ok) throw new Error("Failed to delete file");

      setUploadedFiles((prev) => prev.filter((f) => f.id !== deleteFile.id));
      if (selectedDocument?.id === deleteFile.id) {
        setSelectedDocument(null);
      }
    } catch (err: unknown) {
      setMessage({
        type: "error",
        text: (err instanceof Error && err.message) ? err.message : "Failed to delete file",
      });
    } finally {
      setDeleteFile(null);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 py-8 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-xl flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-orange-500">
          Documents
        </h1>
        <label
          htmlFor="file-input"
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded cursor-pointer transition text-sm sm:text-base"
        >
          Upload Document
        </label>
        <input
          type="file"
          id="file-input"
          accept=".pdf,.docx,.txt, .pptx"
          className="hidden"
          onChange={(e) => e.target.files && setFile(e.target.files[0])}
        />
      </div>

      {/* Selected file */}
      {file && (
        <div className="w-full max-w-xl bg-gray-900 border border-gray-700 rounded-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <div className="flex items-start sm:items-center gap-3 flex-1">
            <FileText className="text-orange-400 h-6 w-6 flex-shrink-0" />
            <div className="break-words">
              <p className="font-semibold">{file.name}</p>
              <p className="text-sm text-gray-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <div className="flex gap-2 sm:gap-3 mt-2 sm:mt-0">
            <button
              onClick={() => setFile(null)}
              className="text-red-400 hover:text-red-500 transition text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2 text-sm sm:text-base ${
                uploading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {uploading && <Loader2 className="animate-spin h-4 w-4" />}
              Upload
            </button>
          </div>
        </div>
      )}

      {/* Message */}
      {message && (
        <div
          className={`mb-6 flex items-center justify-center p-3 rounded-md text-sm sm:text-base ${
            message.type === "success"
              ? "bg-green-700 text-white"
              : "bg-red-700 text-white"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="mr-2" />
          ) : (
            <XCircle className="mr-2" />
          )}
          {message.text}
        </div>
      )}

      {/* Files list */}
      {loading ? (
        <p className="text-gray-400">Loading files...</p>
      ) : uploadedFiles.length === 0 ? (
        <p className="text-gray-500 text-3xl sm:text-6xl font-bold text-center">
          No Files Uploaded
        </p>
      ) : (
        <div className="w-full max-w-xl space-y-3 mb-6">
          {uploadedFiles.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-row items-center justify-between bg-black hover:bg-gray-700 transition p-3 rounded-lg border border-gray-700 shadow-sm gap-3"
            >
              <div className="flex-1 flex items-center gap-3 break-words">
                <FileText className="h-5 w-5 text-orange-400 flex-shrink-0" />
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white underline break-words hover:text-orange-400 transition"
                >
                  {doc.file_name}
                </a>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/documents/${doc.id}/flashcards`}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-1 px-3 rounded flex items-center gap-1 text-sm"
                >
                  <BookOpen className="h-4 w-4" /> View Document
                </Link>
                <button
                  onClick={() => setDeleteFile(doc)}
                  className="text-red-500 hover:text-red-400 transition flex-shrink-0 p-1 rounded-md hover:bg-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

  

      {/* Delete modal */}
      {deleteFile && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
          <div className="bg-black rounded-md p-6 w-full max-w-sm flex flex-col gap-4 border border-gray-700">
            <p className="text-white font-semibold text-sm sm:text-base">
              Are you sure you want to delete{" "}
              <span className="text-orange-400">{deleteFile.file_name}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteFile(null)}
                className="text-gray-400 hover:text-white transition text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition text-sm sm:text-base"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
