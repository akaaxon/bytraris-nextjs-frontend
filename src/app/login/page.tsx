// app/login/page.tsx
import LoginForm from "@/components/LoginForm";
import { getServerSession } from "next-auth/next";
import { authOptions }       from "../../../lib/auth-config";
import { redirect }          from "next/navigation";

export default async function LoginPage() {
  // small artificial delay so loading.tsx appears
  await new Promise((res) => setTimeout(res, 600));

  // check session on the server
  const session = await getServerSession(authOptions);
  console.log("checking session");
  if (session) {
    console.log("session exists");
    // already logged in → kick back to dashboard
    redirect("/dashboard");
  }else{
    console.log("session doesn't exist");
  }

  // no session, render your login form
  return <LoginForm />;
}
