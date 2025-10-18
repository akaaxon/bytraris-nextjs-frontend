"use client";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setMsg(data.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-black border border-orange-500 rounded-xl p-6 shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-orange-500 text-center mb-6">
          Forgot Password
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-orange-400 text-sm mb-2" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-orange-400 placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-black font-semibold py-3 rounded-lg transition duration-300"
          >
            Send Reset Link
          </button>
        </form>
        <p className="text-sm text-orange-400 text-center mt-4 min-h-[1.5rem] break-words">{msg}</p>
      </div>
    </div>
  );
}
