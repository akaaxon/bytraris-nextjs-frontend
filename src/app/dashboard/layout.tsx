// app/dashboard/layout.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth-config"; 
import SideNav from "@/components/SideNav"; 
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex">
      <SideNav />
      <main className="flex-1 min-h-screen bg-black text-white px-4 py-12 md:ml-64">{children}</main>
    </div>
  );
}
