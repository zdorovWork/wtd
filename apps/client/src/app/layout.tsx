import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "wtd",
  description:
    "Pick something to do: answer a few questions and get a recommendation.",
};

const RootLayout = ({ children }: LayoutProps<"/">) => (
  <html lang="en" className="h-full antialiased">
    <body className="flex min-h-full flex-col">{children}</body>
  </html>
);

export default RootLayout;
