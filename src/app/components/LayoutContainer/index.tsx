"use client";
import type { ReactNode } from "react";
import LeftSidebar from "../LeftSidebar";

interface LayoutContainerProps {
  children: ReactNode;
  className?: string;
}

const LayoutContainer = (props: LayoutContainerProps) => {
  const { children } = props;
  return (
    <div className="min-h-screemn w-full bg-[#1f232d]">
      <div className="max-w-[1500px] mx-auto relative w-full bg-[#1f232d]">
        <div className="flex min-h-screen justify-between bg-[#1f232d] w-full">
          <LeftSidebar className="" />
          <div className=" py-8 px-5 flex-1">
            <main className="w-full">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutContainer;
