import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "@/shared/styles/globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "wtd",
  description:
    "Pick something to do: answer a few questions and get a recommendation.",
};

const RootLayout = ({ children }: LayoutProps<"/">) => (
  <html
    lang="en"
    className={`${fredoka.variable} ${nunito.variable} h-full antialiased`}
  >
    <body className="min-h-dvh bg-sand font-body text-ink">
      <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-cream">
        {children}
      </div>
    </body>
  </html>
);

export default RootLayout;
