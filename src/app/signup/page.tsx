// app/signup/page.tsx
import RegisterForm from "@/components/RegisterForm";
import { getServerSession } from "next-auth/next";
import { authOptions }       from "../../../lib/auth-config";
import { redirect }          from "next/navigation";

export default async function LoginPage() {
  // 1️⃣ small artificial delay so loading.tsx appears
  await new Promise((res) => setTimeout(res, 600));

  // 2️⃣ check session on the server
  const session = await getServerSession(authOptions);
  console.log("checking session");
  if (session) {
    console.log("session exists");
    // already logged in → kick back to dashboard
    redirect("/dashboard");
  }else{
    console.log("session doesn't exist");
  }

  // 3️⃣ no session, render your login form
  return <RegisterForm />;
}
