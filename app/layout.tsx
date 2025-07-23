import type { Metadata } from "next";
import "./globals.css";
import Providers from "./Providers";


export const metadata: Metadata = {
  title: "Ict Bangla | Dashboard",
  description: "Ict Bangla",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={``}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
