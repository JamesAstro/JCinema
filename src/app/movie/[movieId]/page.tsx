import Image from "next/image";
import { CalendarRangeIcon, StarIcon } from "lucide-react";
import {
  fetchMovieById,
  fetchMovieByIdVideos,
  fetchRecomendations,
} from "@/app/actions/actions";
import Row from "@/app/components/Row";
import Wrapper from "@/app/components/Wrapper";
import BackButton from "@/app/components/BackButton";

type Props = {
  params: Promise<{
    movieId: string;
  }>;
};

export default async function MoviePage({ params }: Props) {
  const { movieId } = await params;
  const movie: Movie = await fetchMovieById(movieId);
  const video = await fetchMovieByIdVideos(movieId);

  // Find the first trailer or official video
  // Find the first trailer, or fall back to clip or teaser
  const trailer =
    video.results?.find(
      (vid: any) => vid.type === "Trailer" && vid.site === "YouTube"
    ) ||
    video.results?.find(
      (vid: any) =>
        (vid.type === "Clip" ||
          vid.type === "Teaser" ||
          vid.type === "Featurette" ||
          vid.type === "Behind the Scenes") &&
        vid.site === "YouTube"
    );
  const recommendations = await fetchRecomendations(movieId);

  return (
    <main className="bg-[#111] min-h-screen">
      <Wrapper>
        <BackButton />
      </Wrapper>
      <div
        className="relative h-96 w-full"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute z-10 top-10 flex flex-col md:flex-row justify-center items-center w-full gap-8 md:gap-16 p-10 md:p-20">
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            width={500}
            height={750}
            className="hidden md:block h-80 w-52 md:h-96 md:w-64"
          />
          <div className="space-y-8 text-gray-300 max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {movie.title}
            </h1>
            <div className="flex items-center gap-x-8">
              <span className="text-lg font-medium flex items-center gap-x-2">
                <CalendarRangeIcon size={20} />
                {movie.release_date.split("-")[0]}
              </span>
              <div className="flex items-center gap-x-2">
                <StarIcon
                  size={20}
                  className="text-yellow-500"
                  fill="currentColor"
                />
                <span className="text-lg font-medium">
                  {movie.vote_average.toFixed(1)}
                </span>
              </div>
            </div>
            <p className="text-xl text-gray-300">{movie.overview}</p>
          </div>
        </div>

        <div className="absolute inset-0 bg-[#111] opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
      </div>
      {trailer && (
        <div className="mt-52">
          <Wrapper>
            <h2 className="text-2xl font-bold text-white mb-6">
              Watch Trailer
            </h2>
            <div className="relative w-full " style={{ paddingBottom: "48%" }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={trailer.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </Wrapper>
        </div>
      )}

      <div className="mt-14 w-full">
        <Wrapper>
          <Row title="Similar Titles" data={recommendations.results} />
        </Wrapper>
      </div>
    </main>
  );
}
