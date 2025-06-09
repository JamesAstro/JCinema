"use client";
import { genres } from "@/constants";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { fetchNowPlaying } from "@/app/actions/actions";
import { Badge } from "../Badge";
import { FaPlay } from "react-icons/fa";
import { useRouter } from "next/navigation";
import LoadingLight from "../Loading/LoadingLight";
import BannerCarouselSkeleton from "../Loader/BannerCarouselSkeleton";

interface BannerCarouselProps {
  setCurrentItem: React.Dispatch<React.SetStateAction<Movie | null>>;
  setIsMovieDetailLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const BannerCarousel = (props: BannerCarouselProps) => {
  const { setCurrentItem, setIsMovieDetailLoading } = props;
  const [currentIndex, setCurrentIndex] = useState(1); // Start at index 1 (first real item)
  const [data, setData] = useState<Movie[]>([]);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isPaused, setIsPaused] = useState(false); // Track hover state
  const [loading, setLoading] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayInterval = 5000;
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchNowPlaying()
      .then((res) => {
        setData(res?.results);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch  movies:", err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      setCurrentItem(data[(currentIndex - 1 + data.length) % data.length]);
    }
  }, [currentIndex, data]);

  useEffect(() => {
    setIsMovieDetailLoading(isLoading);
  }, [isLoading]);

  // Create extended data array with cloned items for infinite loop
  const extendedData =
    data.length > 0 ? [data[data.length - 1], ...data, data[0]] : [];

  // Autoplay effect
  useEffect(() => {
    if (data.length <= 1 || isPaused) return; // Skip if only one item or paused

    const interval = setInterval(() => {
      nextSlide();
    }, autoplayInterval);

    return () => clearInterval(interval); // Cleanup on unmount or state change
  }, [data.length, isPaused]); // Depend on isPaused to pause/resume

  const totalItems = data.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  useEffect(() => {
    if (!carouselRef.current || !containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const offset = currentIndex * containerWidth;

    carouselRef.current.style.transition = transitionEnabled
      ? "transform 0.5s ease-in-out"
      : "none";
    carouselRef.current.style.transform = `translateX(-${offset}px)`;

    // Handle seamless loop
    if (currentIndex === extendedData.length - 1) {
      // At cloned first item (end), reset to real first item
      setTimeout(() => {
        setTransitionEnabled(false);
        setCurrentIndex(1);
      }, 500); // Match transition duration
    } else if (currentIndex === 0) {
      // At cloned last item (start), reset to real last item
      setTimeout(() => {
        setTransitionEnabled(false);
        setCurrentIndex(totalItems);
      }, 500); // Match transition duration
    } else {
      setTransitionEnabled(true);
    }
  }, [currentIndex, extendedData.length, totalItems]);

  // Handle hover events
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const handlePlay = (id: string) => {
    setLoading(true);
    router.push(`/movie/${id}`);
  };

  // if (data.length === 0) return null;

  return (
    <>
      {isLoading && <BannerCarouselSkeleton />}
      {!isLoading && (
        <div
          className="relative w-full overflow-hidden rounded-[25px]"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            ref={containerRef}
            className="w-full max-w-7xl mx-auto overflow-hidden"
          >
            <div
              ref={carouselRef}
              className="flex relative"
              style={{ width: `${extendedData.length * 100.03}%` }}
            >
              {extendedData.map((item: any, index) => (
                <div key={`${item.id}-${index}`} className="w-full relative">
                  <div className="h-[400px] w-full relative">
                    <Image
                      src={`https://image.tmdb.org/t/p/original${item?.backdrop_path}`}
                      alt={`${item.title} Banner`}
                      width={2000}
                      height={2000}
                      className="object-cover object-center w-full h-full"
                      priority={index === 1}
                    />
                  </div>

                  <div className="absolute z-10 flex flex-col pl-8 bottom-6 text-white">
                    <h1 className="text-[27px] font-bold text-gray-300">
                      {item?.original_title}
                    </h1>

                    <div className="mt-2 flex items-center gap-x-2 text-gray-300 text-xs">
                      <p>{item?.release_date.split("-")[0]}</p>
                      <span className="text-[20px]">•</span>
                      <div className="flex items-center flex-wrap gap-1">
                        {item?.genre_ids?.map((genreId: number) => (
                          <Badge
                            key={genreId}
                            variant="outline"
                            className="text-gray-300"
                          >
                            {genres.find((genre) => genre.id === genreId)?.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <p className="mt-4 font-[300] text-[13px] pr-16">
                      {item?.overview}
                    </p>
                    <button
                      onClick={() => handlePlay(item?.id)}
                      className="flex mt-4 gap-x-1 items-center justify-center bg-[#fff] px-4 py-2 rounded-[60px] text-[#000] text-[14px] font-[600] w-[120px]"
                    >
                      <FaPlay className="text-[12px]" /> Watch
                    </button>
                  </div>
                </div>
              ))}

              <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
            </div>
          </div>
          <div className="absolute right-[50px] bottom-6 flex gap-x-4 z-[20] items-center">
            <button
              onClick={prevSlide}
              className="bg-[rgba(0,0,0,0.4)] border border-[#fff] cursor-pointer text-[18px] text-white p-2 rounded-full transition"
              aria-label="Previous slide"
            >
              <IoIosArrowBack />
            </button>

            <button
              onClick={nextSlide}
              className="bg-[rgba(0,0,0,0.4)] border border-[#fff] cursor-pointer text-[18px] text-white p-2 rounded-full transition"
              aria-label="Next slide"
            >
              <IoIosArrowForward />
            </button>
          </div>
        </div>
      )}
      {loading && <LoadingLight />}
    </>
  );
};

export default BannerCarousel;
