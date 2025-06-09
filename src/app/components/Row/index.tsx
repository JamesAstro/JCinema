"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  data?: Movie[];
  title: string;
};

const ITEMS_PER_SLIDE = 5;
const ITEM_WIDTH = 250;

export default function Row({ data = [], title }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(ITEMS_PER_SLIDE);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalItems = data.length;
  const clonesBefore = data.slice(-ITEMS_PER_SLIDE);
  const clonesAfter = data.slice(0, ITEMS_PER_SLIDE);
  const loopedData = [...clonesBefore, ...data, ...clonesAfter];

  const totalVisibleItems = loopedData.length;

  const goToIndex = (index: number) => {
    const container = containerRef.current;
    if (!container) return;

    setIsTransitioning(true);
    container.scrollTo({
      left: index * ITEM_WIDTH,
      behavior: "smooth",
    });

    setTimeout(() => {
      setIsTransitioning(false);
      if (index >= totalItems + ITEMS_PER_SLIDE) {
        // Jump back to the real first slide
        container.scrollLeft = ITEMS_PER_SLIDE * ITEM_WIDTH;
        setCurrentIndex(ITEMS_PER_SLIDE);
      } else if (index < ITEMS_PER_SLIDE) {
        // Jump to the real last slide
        container.scrollLeft =
          (totalItems + ITEMS_PER_SLIDE - ITEMS_PER_SLIDE) * ITEM_WIDTH;
        setCurrentIndex(totalItems);
      } else {
        setCurrentIndex(index);
      }
    }, 350); // match smooth scroll timing
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    goToIndex(currentIndex - ITEMS_PER_SLIDE);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    goToIndex(currentIndex + ITEMS_PER_SLIDE);
  };

  useEffect(() => {
    // On initial load, center on the actual first item
    const container = containerRef.current;
    if (container) {
      container.scrollLeft = ITEMS_PER_SLIDE * ITEM_WIDTH;
    }
  }, []);

  return (
    <section className=" py-6 pb-12 space-y-4 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-5xl font-semibold text-[#E50914] uppercase">
          {title}
        </h2>
        <p className="text-xs md:text-sm text-gray-300 uppercase hidden md:block">
          Use arrows to navigate
        </p>
      </div>

      {/* Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 "
      >
        <ChevronLeft className="text-white" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 "
      >
        <ChevronRight className="text-white" />
      </button>

      {/* Carousel Container */}
      <div
        ref={containerRef}
        className="flex overflow-hidden select-none  w-full"
      >
        {loopedData.map((movie, idx) => (
          <Link
            href={`/movie/${movie.id}`}
            key={`${movie.id}-${idx}`}
            className="flex-shrink-0 w-[20%] px-1 "
            // style={{ width: `${ITEM_WIDTH}px` }}
          >
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={ITEM_WIDTH}
              height={360}
              className="rounded-md object-cover cursor-pointer w-full h-auto"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
