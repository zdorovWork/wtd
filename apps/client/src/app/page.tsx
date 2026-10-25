import Link from "next/link";
import { getCategories } from "@/data/categories";

const HomePage = async () => {
  const categories = await getCategories();

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 p-6">
      <h1 className="text-2xl font-semibold">What do you want to do?</h1>
      <nav aria-label="Categories">
        <ul className="flex flex-col gap-3">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/quiz/${category.slug}`}
                className="block rounded border p-4 hover:bg-neutral-100 focus-visible:outline-2"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
};

export default HomePage;
