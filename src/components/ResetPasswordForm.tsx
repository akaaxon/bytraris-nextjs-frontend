"use client";

import { useState } from "react";
import { useRouter} from "next/navigation";
import { Eye, EyeOff } from "lucide-react";


export default function ResetPasswordForm({token}: {token: string}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword: password }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setMsg(data.message);

    if (res.ok) {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-black border border-orange-500 rounded-xl p-6 shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-orange-500 text-center mb-6">
          Reset Password
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="block text-orange-400 text-sm mb-2">New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="New password"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-orange-400 placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[42px] text-orange-400"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-black font-semibold py-3 rounded-lg transition duration-300"
          >
            Reset Password
          </button>
        </form>
        <p className="text-sm text-orange-400 text-center mt-4 min-h-[1.5rem] break-words">
          {msg}
        </p>
      </div>
    </div>
  );
}
