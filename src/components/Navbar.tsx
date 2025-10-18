"use client";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { navItems } from "../constants/index.js";
import bytarislogo from "../app/bytarislogo.png";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import LoadingScreen from "./LoadingScreen";

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const toggleNavbar = () => setMobileDrawerOpen(!mobileDrawerOpen);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const { data: userSession, status } = useSession();
  const isAuthenticated = !!userSession?.user;

  if (status == "loading") return <LoadingScreen />;

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80 ">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <Image className="h-10 w-10 mr-2" src={bytarislogo} alt="Logo" />
            <Link href={'/'} className="text-xl tracking-tight">Bytaris</Link>
          </div>

          <ul className="hidden lg:flex ml-14 space-x-12">
            {navItems.map((item, index) => (
              <li key={index}>
                <a 
                  className="hover:underline hover:text-orange-500 transition transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-400" 
                  href={item.href}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center space-x-6">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-500 to-amber-600 font-medium focus:outline-none"
                >
                  Welcome back, {userSession?.user?.name} ▾
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-700 rounded-md shadow-lg z-50 py-2">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 hover:bg-neutral-800"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-2 hover:bg-neutral-800"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="py-2 px-3 border rounded-md hover:text-orange-500 transition transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-400">
                  Sign In
                </Link>
                <Link href="/signup" className="bg-gradient-to-r from-orange-500 to-orange-800 py-2 px-3 rounded-md">
                  Create an account
                </Link>
              </>
            )}
          </div>

          <div className="lg:hidden md:flex flex-col justify-end">
            <button onClick={toggleNavbar}>
              {mobileDrawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {mobileDrawerOpen && (
          <div className="fixed right-0 z-20 bg-black w-full p-12 flex flex-col justify-center items-center text-center lg:hidden">
            {isAuthenticated && (
              <span className="text-orange-400 mb-4">
                Welcome, {userSession?.user?.name}
              </span>
            )}
            <ul className="w-full">
              {navItems.map((item, index) => (
                <li key={index} className="py-4">
                  <a 
                    href={item.href} 
                    className="block w-full hover:text-orange-500"
                    onClick={toggleNavbar}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            {isAuthenticated ? (
              <div className="flex flex-col items-center space-y-4 mt-4 w-full">
                <Link 
                  href="/dashboard" 
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-neutral-800 w-full max-w-xs"
                  onClick={toggleNavbar}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    toggleNavbar();
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-orange-500 text-black w-full max-w-xs"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4 w-full">
                <Link 
                  href="/login" 
                  className="py-2 px-4  rounded-md bg-orange-500 text-black text-center sm:w-auto w-full max-w-xs mx-auto"
                  onClick={toggleNavbar}
                >
                  Sign In
                </Link>
                <Link 
                  href="/signup" 
                  className="py-2 px-4  rounded-md bg-gradient-to-r text-orange-500 bg-black text-center sm:w-auto w-full max-w-xs mx-auto"
                  onClick={toggleNavbar}
                >
                  Create an account
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;