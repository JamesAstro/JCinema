import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  data?: Movie[];
  title: string;
  listClassName?: string;
};

export default function CustomRow({ data, title, listClassName }: Props) {
  return (
    <section className="w-full ">
      <h2 className="text-[20px] mb-2 font-[500] text-[#E50914]">{title}</h2>

      <div
        className={cn(
          "cScrollBar w-full gap-x-4 gap-y-4 grid grid-cols-5",
          listClassName
        )}
      >
        {data &&
          data.map((movie) => (
            <Link
              href={`/movie/${movie.id}`}
              key={movie.id}
              className="w-full rounded-[10px] overflow-hidden"
            >
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={500}
                height={500}
                className="object-cover w-full h-full cursor-pointer"
              />
            </Link>
          ))}
      </div>
    </section>
  );
}
