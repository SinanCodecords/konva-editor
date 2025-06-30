import "@/styles/globals.css";
import { Geist } from "next/font/google";
import { metadataBase } from "./metadata";
import { HocProps } from "@/types/props";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = metadataBase;

const RootLayout = ({ children }: HocProps) => {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} antialiased dark`}
      >
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
