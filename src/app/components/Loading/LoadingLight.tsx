import { cn } from "@/lib/utils";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface LoadingLightProps {
  className?: string;
  loadingText?: string;
}

function LoadingLight(props: LoadingLightProps) {
  const { className } = props;
  return (
    <div
      className={cn(
        "fixed left-0 right-0 top-0 z-[2100] flex min-h-screen w-full flex-col items-center justify-center bg-[rgba(0,0,0,0.8)]",
        className
      )}
    >
      <span>
        <AiOutlineLoading3Quarters className="size-5 animate-spin" />
      </span>
      <p className="text-secondary mt-2 text-[14px] font-[500]">
        Redirecting...
      </p>
    </div>
  );
}

export default LoadingLight;
