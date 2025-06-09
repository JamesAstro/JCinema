"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { BsArrowLeft } from "react-icons/bs";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleBack = () => {
    if (!isClient || pathname === "/") {
      router.push("/");
      return;
    }
    router.back();
  };

  if (!isClient) {
    return (
      <button
        disabled
        className="px-4 py-2 hover:bg-[rgba(0,0,0,0.35)] rounded absolute cursor-not-allowed opacity-50 left-0 z-50 bg-[rgba(0,0,0,0.2)] top-[10px] flex gap-x-1 items-center "
      >
        <BsArrowLeft /> Go Back
      </button>
    );
  }

  return (
    <button
      onClick={handleBack}
      className="px-4 py-2 hover:bg-[rgba(0,0,0,0.35)] rounded absolute left-0 z-50 bg-[rgba(0,0,0,0.2)] top-[10px] flex gap-x-1 items-center "
      disabled={!router}
    >
      <BsArrowLeft /> Go Back
    </button>
  );
}
