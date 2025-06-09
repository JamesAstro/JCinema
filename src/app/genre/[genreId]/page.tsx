import { fetchMovieByGenre } from "@/app/actions/actions";
import BackButton from "@/app/components/BackButton";
import LoadMore from "@/app/components/LoadMore";
import MovieCard from "@/app/components/MovieCard";
import Wrapper from "@/app/components/Wrapper";
import { genres } from "@/constants";

type Props = {
  params: Promise<{
    genreId: string;
  }>;
};

export default async function GenrePage({ params }: Props) {
  const { genreId } = await params;
  const movies = await fetchMovieByGenre(genreId);

  return (
    <>
      <Wrapper>
        <BackButton />
      </Wrapper>
      <div className="p-12 pt-24 ">
        <h2 className="text-2xl md:text-5xl max-w-md font-semibold text-white">
          {genres.find((genre) => genre.id === parseInt(genreId))?.name} Movies
        </h2>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {movies &&
            movies.results.map((movie: Movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>

        <LoadMore id={genreId} />
      </div>
    </>
  );
}
