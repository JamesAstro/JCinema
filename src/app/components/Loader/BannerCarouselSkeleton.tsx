import React from "react";
interface BannerCarouselSkeleton {
  className?: string;
}

const BannerCarouselSkeleton = (props: BannerCarouselSkeleton) => {
  const { className } = props;
  return (
    <div className="relative w-full overflow-hidden rounded-[25px] h-[400px] bg-gray-600">
      <div className="absolute z-10 flex flex-col pl-8 bottom-6 w-full ">
        <h1 className="text-[27px] font-bold w-1/4 animate-pulse bg-gray-400 rounded-[10px] ">
          &nbsp;
        </h1>

        <div className="mt-2 flex items-center text-[20px] gap-x-2 text-xs w-2/4 animate-pulse bg-gray-400 rounded-[10px]">
          &nbsp;
        </div>

        <p className="mt-4 font-[300] text-[13px] w-3/4 animate-pulse bg-gray-400 rounded-[10px]">
          &nbsp;
        </p>
        <div className="flex mt-4 gap-x-1 items-center animate-pulse justify-center bg-gray-200 px-4 py-2 rounded-[60px] text-[#000] text-[14px] font-[600] w-[120px]">
          &nbsp;
        </div>
      </div>
    </div>
  );
};

export default BannerCarouselSkeleton;
