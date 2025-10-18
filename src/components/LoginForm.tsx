/* eslint-disable react/no-unescaped-entities */
"use client";
import Link from "next/link";
import Image from "next/image";
import backgroundImg from "../../public/orange-desktop-qsvgwqmi2c12ccmh.jpg";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingScreen from "./LoadingScreen";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [err, setErr] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); 
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return <LoadingScreen />;
  }

  if (status === "authenticated") {
    return null; // Prevents flash
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); 
    setErr("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res && res.error) {
        setErr("Invalid Credentials");
        setLoading(false);
        return;
      }

      router.replace("/dashboard");
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-screen h-[100dvh] md:h-screen overflow-hidden">
      {/* Left side image section */}
      <div className="relative w-full md:w-1/2 h-1/3 md:h-full flex-shrink-0">
        <div className="absolute top-[20%] left-4 md:left-[10%] z-10">
          <h1 className="text-xl md:text-4xl text-white font-bold mb-1 md:mb-2 leading-tight">
            Let's Get You Back to Your Work
          </h1>
          <p className="text-xs md:text-base text-white font-medium">
            Sign in to access your information
          </p>
        </div>
        <Image
          src={backgroundImg}
          className="w-full h-full object-cover"
          alt="sideimage"
          priority
        />
      </div>

      {/* Right side login section */}
      <div className="w-full md:w-1/2 flex flex-col bg-black px-4 md:px-20 py-4 md:py-10 justify-between">
        <h1 className="text-lg md:text-2xl text-white font-semibold">Bytaris</h1>

        <div className="w-full max-w-[500px] mx-auto flex-grow flex flex-col justify-center space-y-4">
          <form
            onSubmit={handleSubmit}
            className="bg-black rounded-lg p-4 border border-gray-800"
          >
            <div className="mb-4">
              <h3 className="text-xl md:text-2xl font-semibold">Log in</h3>
              <p className="text-sm md:text-base">
                Let's get you back to your account.
              </p>
            </div>

            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className="w-full py-2 text-white border-b border-gray-600 bg-black outline-none mb-4"
            />

            <div className="relative w-full mb-4">
              <input
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full py-2 text-white border-b border-gray-600 bg-black outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 px-2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {err && (
              <p className="text-red-500 text-sm font-medium mb-2">{err}</p>
            )}

            <button
              type="submit"
              disabled={loading} // disable when loading
              className="w-full bg-orange-500 text-white font-medium py-2 rounded-md hover:bg-orange-600 transition flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : null}
              {loading ? "Logging in..." : "Login"}
            </button>

            <p
              onClick={() => router.push("/forgotPassword")}
              className="text-xs font-medium text-orange-400 text-center mt-3 underline cursor-pointer"
            >
              Forgot Password?
            </p>
          </form>

          <p className="text-xs text-gray-300 text-center">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-orange-500 underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default LoginForm;
