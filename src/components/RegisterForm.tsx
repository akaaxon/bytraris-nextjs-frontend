/* eslint-disable react/no-unescaped-entities */
"use client";
import Link from "next/link";
import backgroundImg from "../../public/orange-desktop-qsvgwqmi2c12ccmh.jpg";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "./LoadingScreen";
import { useSession } from "next-auth/react";
import { Eye, EyeOff, Loader2 } from "lucide-react"; 

export default function RegisterForm() {
  const [err, setErr] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
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
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setErr("All fields are required.");
      return;
    }

    setLoading(true); //start spinner
    setErr("");

    try {
      const userExistsRes = await fetch("/api/userExists", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const { user } = await userExistsRes.json();
      if (user) {
        setErr("A user with this email already exists");
        setLoading(false); // ✅ stop spinner
        return;
      }

      const registerRes = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (registerRes.ok) {
        const form = e.target as HTMLFormElement;
        form.reset();
        router.push("/login");
      } else {
        setErr("Error occurred while registering.");
      }
    } catch (err) {
      console.log(err);
      setErr("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-screen h-[100dvh] overflow-hidden">
      {/* Left side image section */}
      <div className="relative w-full md:w-1/2 h-[30vh] md:h-full flex-shrink-0">
        <div className="absolute top-[15%] left-4 md:left-[10%] z-10 pr-2">
          <h1 className="text-xl md:text-4xl text-white font-bold mb-1 md:mb-2 leading-tight">
            Let's Get Started With Your Idea
          </h1>
          <p className="text-xs md:text-base text-white font-medium">
            Create an account for easier access
          </p>
        </div>
        <Image
          src={backgroundImg}
          className="w-full h-full object-cover"
          alt="sideimage"
          priority
        />
      </div>

      {/* Right side form */}
      <div className="w-full md:w-1/2 flex flex-col bg-black px-4 md:px-20 py-3 md:py-10 justify-between">
        <h1 className="text-lg md:text-2xl text-white font-semibold">Bytaris</h1>

        <div className="w-full max-w-[500px] mx-auto flex-grow flex flex-col justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-black rounded-md p-4 border border-gray-600"
          >
            <div className="mb-3">
              <h3 className="text-xl md:text-2xl font-semibold">Sign up</h3>
              <p className="text-sm md:text-base">Let's create your account.</p>
            </div>

            <input
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Username"
              className="w-full py-2 text-white border-b border-gray-600 bg-black outline-none mb-3"
            />
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className="w-full py-2 text-white border-b border-gray-600 bg-black outline-none mb-3"
            />

            <div className="relative w-full mb-3">
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
              disabled={loading} //disable when loading
              className="w-full bg-orange-500 text-white font-medium py-2 rounded-md hover:bg-orange-600 transition mt-2 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>

          <p className="text-xs text-gray-300 text-center mt-3">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-orange-500 underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
