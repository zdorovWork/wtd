import { Fredoka, Nunito } from "next/font/google";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getCategories } from "@/data/categories";
import { getSessionData } from "@/data/sessions";
import { DesignPrototype } from "./design-prototype";

const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });

const DesignPrototypePage = async () => {
  const [categories, games, movies] = await Promise.all([
    getCategories(),
    getSessionData("games"),
    getSessionData("movies"),
  ]);

  if (!games || !movies) notFound();

  return (
    <div className={`${fredoka.variable} ${nunito.variable}`}>
      <Suspense>
        <DesignPrototype categories={categories} sessions={{ games, movies }} />
      </Suspense>
    </div>
  );
};

export default DesignPrototypePage;
