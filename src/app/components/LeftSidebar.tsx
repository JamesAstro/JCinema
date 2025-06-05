"use client";
import { TfiSearch } from "react-icons/tfi";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { TbSettings2 } from "react-icons/tb";
import { IoGridOutline } from "react-icons/io5";
import { LuTv } from "react-icons/lu";
import { LuHeart } from "react-icons/lu";
import { MdOutlineSubscriptions } from "react-icons/md";
interface LeftSidebarProps {
  className?: string;
}

const LeftSidebar = (props: LeftSidebarProps) => {
  const { className } = props;
  return (
    <div className={cn("flex-none  px-4 w-[6%] py-8", className)}>
      <div className="fixed h-full flex flex-col justify-between items-center">
        <div className="w-[50px] rounded-full overflow-hidden">
          <Image
            src="/images/profile.jpg"
            alt="User Avatar"
            width={1000}
            height={1000}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-y-6 text-[25px] text-gray-300">
          <TfiSearch />
          <IoGridOutline />
          <LuTv />
          <LuHeart />
          <MdOutlineSubscriptions />
        </div>
        <div className="relative top-[-50px] text-[25px] text-gray-300">
          <TbSettings2 />
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
