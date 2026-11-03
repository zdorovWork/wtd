type GenreChipsProps = {
  genres: string[];
};

export const GenreChips = ({ genres }: GenreChipsProps) => (
  <ul className="flex flex-wrap gap-1.5">
    {genres.map((genre) => (
      <li
        key={genre}
        className="rounded-full border-2 border-ink bg-duck/60 px-2.5 py-0.5 text-xs font-bold"
      >
        {genre}
      </li>
    ))}
  </ul>
);
