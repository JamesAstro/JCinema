import React from "react";

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper = (props: WrapperProps) => {
  const { children } = props;
  return (
    <div className="w-full max-w-[1250px] relative mx-auto">{children}</div>
  );
};

export default Wrapper;
