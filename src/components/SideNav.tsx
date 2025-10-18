"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Menu,
  X,
  Home,
  FileText,
  CreditCard,
  ClipboardList,
  BarChart2,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: BarChart2 },
  { label: "Manage plan", href: "/dashboard/plan", icon: CreditCard },
  { label: "Invoices", href: "/dashboard/invoices", icon: ClipboardList },
  { label: "Upload Documents", href: "/dashboard/upload", icon: FileText },
  { label: "Home", href: "/", icon: Home },
];

export default function SideNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-black text-orange-500 rounded-lg shadow-lg"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 w-64 bg-black text-white flex flex-col
          transform transition-transform duration-300 ease-in-out z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-orange-700">
          <h2 className="text-lg font-semibold">
            Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="p-1 rounded hover:bg-orange-800"
          >
            <X className="h-5 w-5 text-orange-500" />
          </button>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map(({ label, href, icon: Icon }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center p-2 rounded-md transition
                      ${active
                        ? "bg-orange-600 text-white"
                        : "text-gray-300 hover:bg-orange-500 hover:text-white"}
                    `}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="ml-3 text-sm font-medium">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
        />
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 bg-black text-white">
        <div className="p-6 border-b border-orange-700">
          <h2 className="text-xl font-semibold">
            Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}
          </h2>
        </div>
        <nav className="flex-1 p-6">
          <ul className="space-y-2">
            {navItems.map(({ label, href, icon: Icon }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`
                      flex items-center p-2 rounded-md transition
                      ${active
                        ? "bg-orange-600 text-white"
                        : "text-gray-300 hover:bg-orange-500 hover:text-white"}
                    `}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="ml-3 text-sm font-medium">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
