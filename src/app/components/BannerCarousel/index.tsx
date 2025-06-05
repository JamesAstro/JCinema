"use client";
import { genres } from "@/constants";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { fetchNowPlaying } from "@/app/actions/actions";
import { Badge } from "../Badge";
import { FaPlay } from "react-icons/fa";

interface BannerCarouselProps {
  setCurrentItem: React.Dispatch<React.SetStateAction<Movie | null>>;
}

const BannerCarousel = (props: BannerCarouselProps) => {
  const { setCurrentItem } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState<Movie[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNowPlaying().then((res) => {
      setData(res?.results || []);
    });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      setCurrentItem(data[currentIndex]);
    }
  }, [currentIndex, data]);

  const totalItems = data.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  useEffect(() => {
    if (!carouselRef.current || !containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const offset = currentIndex * containerWidth;

    carouselRef.current.style.transition = "transform 0.5s ease-in-out";
    carouselRef.current.style.transform = `translateX(-${offset}px)`;
  }, [currentIndex]);

  return (
    <div className="relative w-full overflow-hidden rounded-[25px]">
      <div
        ref={containerRef}
        className="w-full max-w-7xl mx-auto overflow-hidden"
      >
        <div
          ref={carouselRef}
          className="flex relative"
          style={{ width: `${totalItems * 100}%` }}
        >
          {data.map((item: any) => (
            <div key={item.id} className="w-full relative">
              <div className="h-[400px] w-full relative">
                {" "}
                {/* Fixed height */}
                <Image
                  src={`https://image.tmdb.org/t/p/original${item?.backdrop_path}`}
                  alt={`${item.title} Banner`}
                  width={2000}
                  height={2000}
                  className="object-cover object-center  w-full h-full"
                  priority={item.id === 1}
                />
              </div>

              <div className="absolute z-10 flex flex-col pl-8 bottom-6 text-white">
                <h1 className="text-[27px] font-bold text-gray-300">
                  {item?.original_title}
                </h1>

                <div className="mt-2  flex items-center gap-x-2  text-gray-300 text-xs ">
                  <p>{item?.release_date.split("-")[0]}</p>

                  <span className="text-[20px]">•</span>

                  <div className="flex items-center flex-wrap gap-1 ">
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
                <button className="flex mt-4 gap-x-1 items-center justify-center bg-[#fff] px-4 py-2 rounded-[60px] text-[#000] text-[14px] font-[600] w-[120px]">
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
          className=" bg-[rgba(0,0,0,0.4)] border border-[#fff] cursor-pointer text-[18px]  text-white p-2 rounded-full  transition"
          aria-label="Previous slide"
        >
          <IoIosArrowBack />
        </button>

        <button
          onClick={nextSlide}
          className=" bg-[rgba(0,0,0,0.4)] border border-[#fff] cursor-pointer text-[18px] text-white p-2 rounded-full  transition"
          aria-label="Next slide"
        >
          <IoIosArrowForward />
        </button>
      </div>
    </div>
  );
};

export default BannerCarousel;
