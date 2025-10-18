"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Import useParams
interface Flashcard {
  id: string;
  question: string;
  answer: string;
  page_number: number;
}

export default function FlashcardsSection() {
  const {id} = useParams(); // Get document ID from URL
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [current, setCurrent] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/flashcards/get?id=${id}`); // Pass document_id as query param
        const data = await res.json();
        setFlashcards(data.flashcards || []);
        setCurrent(0); // Reset to first card on reload
        setShowAnswer(false);
      } catch (err) {
        console.error("Failed to fetch flashcards:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlashcards();
  }, []);
  console.log(flashcards);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-orange-500">
        <p className="text-2xl sm:text-4xl font-bold text-center">
          Loading flashcards...
        </p>
      </div>
    );
  }

  if (!flashcards.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-orange-500 px-4">
        <p className="text-2xl sm:text-4xl font-bold text-center">
          No flashcards yet. Upload documents and generate them!
        </p>
      </div>
    );
  }

  const card = flashcards[current];

  const nextCard = () => {
    setCurrent((prev) => (prev + 1) % flashcards.length);
    setShowAnswer(false);
  };

  const prevCard = () => {
    setCurrent((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setShowAnswer(false);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-10">
      <div className="relative w-full max-w-3xl bg-gray-900 border border-orange-500 rounded-2xl shadow-xl p-8 sm:p-12 text-center">
        {/* Question */}
        <h2 className="text-2xl sm:text-4xl font-extrabold text-orange-400 mb-6">
          {card.question}
        </h2>

        {/* Answer */}
        {showAnswer && (
          <div className="mt-6 p-6 bg-black border border-orange-500 rounded-xl text-left text-white transition-all duration-300 ease-in-out">
            <p className="text-lg sm:text-xl">{card.answer}</p>
            <p className="text-sm text-orange-400 mt-2">
              Page {card.page_number}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-8 flex-wrap">
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-full transition"
          >
            {showAnswer ? "Hide" : "Show"} Answer
          </button>

          <button
            onClick={prevCard}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-orange-400 font-bold rounded-full transition"
          >
            Previous
          </button>

          <button
            onClick={nextCard}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-orange-400 font-bold rounded-full transition"
          >
            Next
          </button>
        </div>

        {/* Counter */}
        <p className="text-sm sm:text-base text-gray-400 mt-6">
          {current + 1} / {flashcards.length}
        </p>
      </div>
    </div>
  );
}
