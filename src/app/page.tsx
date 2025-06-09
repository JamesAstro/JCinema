"use client";

import { genres, MOVIE_GENRE } from "@/constants";
import BannerCarousel from "./components/BannerCarousel";
import LayoutContainer from "./components/LayoutContainer";
import { TfiSearch } from "react-icons/tfi";
import Rows from "./components/Rows";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { GoCalendar } from "react-icons/go";
import { FaRegStar } from "react-icons/fa6";
import { HiLanguage } from "react-icons/hi2";
import { MdOutlineStarPurple500 } from "react-icons/md";
import { FaFire } from "react-icons/fa";
import { MdOutlineMovie } from "react-icons/md";
import { cn } from "@/lib/utils";
import {
  fetchPopular,
  fetchTopRated,
  fetchUpcoming,
  fetchSearchMovies,
} from "./actions/actions";
import CustomRow from "./components/CustomRow";
import InputSelect from "./components/InputSelect";
import { useRouter } from "next/navigation";
import LoadingLight from "./components/Loading/LoadingLight";
import MovieListSkeleton from "./components/Loader/MovieListSkeleton";

export default function Home() {
  const [currentItem, setCurrentItem] = useState<Movie | null>(null);
  const [aciveTab, setActiveTab] = useState(0);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isPopularLoading, setIsPopularLoading] = useState(true);
  const [isTopRateLoading, setIsTopRateLoading] = useState(true);
  const [isUpcomingLoading, setIsUpcomingLoading] = useState(true);
  const [isMovieDetailLoading, setIsMovieDetailLoading] = useState(true);

  // Fetch movies on mount
  useEffect(() => {
    fetchPopular()
      .then((res) => {
        setPopularMovies(res?.results);
        setIsPopularLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch popular movies:", err);
        setIsPopularLoading(false);
      });
    // const loadPopularMovies = async () => {
    //   try {
    //     const res = await fetchPopular();
    //     setPopularMovies(res?.results);
    //   } catch (err) {
    //     console.error("Failed to fetch popular movies:", err);
    //   } finally {
    //     setIsPopularLoading(false);
    //   }
    // };

    // loadPopularMovies();
    fetchTopRated()
      .then((res) => {
        setTopRatedMovies(res?.results);
        setIsTopRateLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch top rated movies:", err);
        setIsTopRateLoading(false);
      });

    fetchUpcoming()
      .then((res) => {
        setUpcomingMovies(res?.results);
        setIsUpcomingLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch upcoming movies:", err);
        setIsUpcomingLoading(false);
      });
  }, []);

  useEffect(() => {
    if (genre) {
      setLoading(true);
      router.push(`/genre/${genre}`);
    }
  }, [genre, router]);

  // Handle search query
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 2) {
        fetchSearchMovies(searchQuery).then((res) => {
          setSearchResults(res?.results.slice(0, 5) || []); // Limit to 5 results
          setIsSearchOpen(true);
        });
      } else {
        setSearchResults([]);
        setIsSearchOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // useEffect(() => {
  //   fetchPopular().then((res) => {
  //     setPopularMovies(res?.results);
  //   });
  //   fetchTopRated().then((res) => {
  //     setTopRatedMovies(res?.results);
  //   });
  //   fetchUpcoming().then((res) => {
  //     setUpcomingMovies(res?.results);
  //   });
  // }, []);

  const onTabChange = (index: number) => {
    setActiveTab(index);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLoading(true);
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  };

  const handleResultClick = (movieId: number) => {
    setLoading(true);
    router.push(`/movie/${movieId}`);
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchOpen(false);
  };

  return (
    <LayoutContainer>
      <div className="w-full flex gap-x-5 justify-between">
        <div className="w-[76%] h-full rounded-[25px] px-10 py-10  bg-[#171a21]">
          <div className="w-full mb-5 flex justify-between gap-x-1 ">
            <div className="w-full">
              <h1 className="bg-gradient-to-r text-[25px] from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent text-4xl font-bold">
                JCinema
              </h1>
              <p className="font-[300] text-[14px]">
                Endless Entertainment, Anytime, Anywhere!
              </p>
            </div>
            <div
              className="flex flex-none gap-y-2 flex-col w-[35%] relative "
              ref={searchRef}
            >
              <form onSubmit={handleSearchSubmit}>
                <div className="relative  w-full">
                  <input
                    type="text"
                    placeholder="Search Movies..."
                    className="w-full px-4 py-[6px] text-[13px] rounded-[8px] border-[1px] border-solid border-[#727272]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() =>
                      searchResults.length > 0 && setIsSearchOpen(true)
                    }
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#c9c9c9]"
                  >
                    <TfiSearch />
                  </button>
                </div>
              </form>
              {isSearchOpen && searchResults.length > 0 && (
                <div className="absolute top-[40px] w-full bg-[#1e2129] rounded-[8px] shadow-lg z-10 cScrollBar max-h-[300px] overflow-y-auto">
                  {searchResults.map((movie) => (
                    <div
                      key={movie.id}
                      className="flex items-center gap-x-2 p-2 hover:bg-[#353942] cursor-pointer"
                      onClick={() => handleResultClick(movie.id)}
                    >
                      <Image
                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                        alt={movie.title}
                        width={50}
                        height={75}
                        className="rounded-[4px]"
                      />
                      <div>
                        <p className="text-white text-[13px]">{movie.title}</p>
                        <p className="text-[#b8b8b8] text-[12px]">
                          {movie.release_date.split("-")[0]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="w-full  text-[13px]">
                <InputSelect
                  options={MOVIE_GENRE}
                  placeholder="Choose Genre"
                  onChange={(v) => setGenre(v as string)}
                  value={genre ?? ""}
                  buttonClassName="text-[#a0a0a0]"
                />
              </div>
            </div>
          </div>

          <BannerCarousel
            setCurrentItem={setCurrentItem}
            setIsMovieDetailLoading={setIsMovieDetailLoading}
          />

          <div className="mt-8 flex justify-end">
            <div className="flex items-center gap-x-1 text-[13px] ">
              <button
                onClick={() => {
                  onTabChange(0);
                }}
                className={cn(
                  "px-4 py-1 rounded-[50px] hover:bg-[#3d3d3d] hover:shadow-[0px_0px_4px_rgba(255,255,255,0.6)] hover:text-[#ffffff] font-[500] text-[#fff] border-[1px] border-solid border-[#3d3d3d] ",
                  aciveTab === 0 &&
                    "bg-[#3d3d3d] shadow-[0px_0px_4px_rgba(255,255,255,0.6)]  text-[#ffffff]"
                )}
              >
                Popular Now
              </button>
              <button
                onClick={() => {
                  onTabChange(1);
                }}
                className={cn(
                  "px-4 py-1 rounded-[50px] hover:bg-[#3d3d3d] hover:shadow-[0px_0px_4px_rgba(255,255,255,0.6)] hover:text-[#ffffff] text-[#fff] border-[1px] border-solid border-[#3d3d3d] ",
                  aciveTab === 1 &&
                    "bg-[#3d3d3d]  shadow-[0px_0px_4px_rgba(255,255,255,0.6)]  text-[#ffffff]"
                )}
              >
                Top Rated
              </button>
              <button
                onClick={() => {
                  onTabChange(2);
                }}
                className={cn(
                  "px-4 py-1 rounded-[50px] text-[#fff] border-[1px] hover:bg-[#3d3d3d] hover:shadow-[0px_0px_4px_rgba(255,255,255,0.6)] hover:text-[#ffffff] border-solid border-[#3d3d3d] ",
                  aciveTab === 2 &&
                    "bg-[#3d3d3d] shadow-[0px_0px_4px_rgba(255,255,255,0.6)]  text-[#ffffff]"
                )}
              >
                Coming Soon
              </button>
            </div>
          </div>
          <div className="mt-3  flex flex-col gap-y-20  w-full">
            {aciveTab === 0 && (
              <>
                {isPopularLoading ? (
                  <MovieListSkeleton listClassName="overflow-y-auto max-h-[480px]" />
                ) : (
                  <CustomRow
                    title="Popular Now"
                    data={popularMovies}
                    listClassName="overflow-y-auto max-h-[480px]"
                  />
                )}
              </>
            )}
            {aciveTab === 1 && (
              <>
                {isTopRateLoading ? (
                  <MovieListSkeleton listClassName="overflow-y-auto max-h-[480px]" />
                ) : (
                  <CustomRow
                    title="Top Rated"
                    data={topRatedMovies}
                    listClassName="overflow-y-auto max-h-[480px]"
                  />
                )}
              </>
            )}
            {aciveTab === 2 && (
              <>
                {isUpcomingLoading ? (
                  <MovieListSkeleton listClassName="overflow-y-auto max-h-[480px]" />
                ) : (
                  <CustomRow
                    title="Coming Soon"
                    data={upcomingMovies}
                    listClassName="overflow-y-auto max-h-[480px]"
                  />
                )}
              </>
            )}
          </div>
        </div>
        <div className="w-[24%] pl-3 text-[14px] ">
          <div className="fixed top-0  w-[280px] py-8 h-full   space-y-5">
            <div className="w-full relative h-[280px] rounded-[25px] overflow-hidden">
              {isMovieDetailLoading ? (
                <div className="animate-pulse w-full h-full bg-gray-300">
                  &nbsp;
                </div>
              ) : (
                <Image
                  src={`https://image.tmdb.org/t/p/original${currentItem?.poster_path!}`}
                  alt={`${currentItem?.title!} Banner`}
                  width={1000}
                  height={1000}
                  className="w-full h-full object-cover object-top"
                />
              )}
            </div>
            <div>
              <h2 className="text-[#b8b8b8] flex items-center gap-x-1">
                <GoCalendar />
                Released Year
              </h2>
              {isMovieDetailLoading ? (
                <p className="animate-pulse rounded w-1/4 bg-gray-500">
                  &nbsp;
                </p>
              ) : (
                <p className="text-[#ebebeb] ">
                  {currentItem?.release_date.split("-")[0]}
                </p>
              )}
            </div>
            <div>
              <h2 className="text-[#b8b8b8] flex items-center gap-x-1">
                {" "}
                <HiLanguage />
                Available Languages
              </h2>
              {isMovieDetailLoading ? (
                <p className="animate-pulse mt-[2px] w-1/4 py-[2px] inline-block rounded-[50px] bg-gray-500 ">
                  &nbsp;
                </p>
              ) : (
                <p className=" px-4 mt-[2px] py-[2px] text-[#fff] inline-block rounded-[50px] bg-[#353942] ">
                  {currentItem?.original_language}
                </p>
              )}
            </div>
            <div>
              <h2 className="text-[#b8b8b8] flex items-center gap-x-1">
                <FaRegStar />
                Ratings
              </h2>
              <div className="flex w-full mt-2 gap-x-1 justify-between items-center">
                <div className="bg-[#171a21] w-[48%] text-[12px] px-4 py-1 rounded-[4px] text-[#dfdfdf]">
                  <h3>IMDB</h3>
                  {isMovieDetailLoading ? (
                    <p className="text-[15px] animate-pulse w-2/4 rounded bg-gray-500">
                      &nbsp;
                    </p>
                  ) : (
                    <p className="flex gap-x-1 items-center">
                      <MdOutlineStarPurple500 className="text-[#e6c962] text-[15px]" />
                      {currentItem?.vote_average.toFixed(1)}/10 (
                      {currentItem?.vote_count})
                    </p>
                  )}
                </div>

                <div className="bg-[#171a21] w-[48%] text-[12px] px-4 py-1 rounded-[4px] text-[#dfdfdf]">
                  <h3>Popularity</h3>
                  {isMovieDetailLoading ? (
                    <p className="text-[15px] animate-pulse w-2/4 rounded bg-gray-500">
                      &nbsp;
                    </p>
                  ) : (
                    <p className="flex gap-x-1 items-center">
                      <FaFire className="text-[#d87c4f] text-[14px]" />
                      {currentItem?.popularity.toFixed()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-[#b8b8b8] flex items-center gap-x-1">
                <MdOutlineMovie />
                Genres
              </h2>
              {isMovieDetailLoading ? (
                <div className="mt-[3px] w-full bg-gray-400 animate-pulse py-[2px] rounded-[50px]">
                  &nbsp;
                </div>
              ) : (
                <div className="flex items-center mt-[3px] flex-wrap gap-1 ">
                  {currentItem?.genre_ids?.map((genreId: number) => (
                    <div
                      key={genreId}
                      className="text-[#fff] text-[12px] px-2 py-[2px] inline-block rounded-[50px] bg-[#353942]"
                    >
                      {genres.find((genre) => genre.id === genreId)?.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {loading && <LoadingLight />}
    </LayoutContainer>
  );
}
