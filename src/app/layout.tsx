import type { Metadata } from "next";
import "./styles/globals.css";
import { AuthProvider } from "./providers";

export const metadata: Metadata = {
  title: "Bytaris",
  description: "All you need for your software and AI ideas.",
 icons:'/bytarislogo.png',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/bytarislogo.ico" sizes="any" />
      </head>
      <body>
        <AuthProvider>
        {children}
        </AuthProvider>
      </body>
    </html>
  );
}
