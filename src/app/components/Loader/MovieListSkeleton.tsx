import { cn } from "@/lib/utils";
import React from "react";

interface MovieListSkeletonProps {
  listClassName?: string;
}

const MovieListSkeleton = (props: MovieListSkeletonProps) => {
  const { listClassName } = props;
  return (
    <div className=" w-full">
      <h2 className="text-[20px] w-1/4 mb-2 animate-pulse bg-gray-600 rounded font-[500] ">
        &nbsp;
      </h2>

      <div
        className={cn("w-full gap-x-4 gap-y-4 grid grid-cols-5", listClassName)}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="w-full rounded-[10px] h-[230px] bg-gray-400 animate-pulse"
          >
            &nbsp;
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieListSkeleton;
