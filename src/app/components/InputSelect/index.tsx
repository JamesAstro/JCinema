import useOutsideClickHandler from "@/hooks/useOutSideClickHandler";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { useState, useRef } from "react";

import { MdKeyboardArrowDown } from "react-icons/md";

export type Option =
  | {
      label: string;
      value: string;
    }
  | { label: string; value: number };

export interface InputSelectProps {
  label?: string;
  wrapperClassName?: string;
  inputWrapperClassName?: string;
  className?: string;
  labelClassName?: string;
  leftIcon?: ReactNode;
  placeholder?: string;
  options: Option[];
  onChange?: (value: string | number) => void;
  value?: string | number;
  disabled?: boolean;
  isDark?: boolean;
  buttonClassName?: string;
  isDarkClassName?: string;
}

const InputSelect = (props: InputSelectProps) => {
  const {
    label,
    wrapperClassName,
    labelClassName,
    inputWrapperClassName,
    buttonClassName,
    className,
    placeholder,
    leftIcon,
    options,
    onChange,
    value,
    disabled,
    isDark = false,
    isDarkClassName,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | number | null>(
    value ?? null
  );
  const dropDownRef = useRef<HTMLDivElement | null>(null);

  const handleOptionClick = (optionValue: string | number) => {
    setSelectedValue(optionValue);
    setIsOpen(false);
    if (onChange) {
      onChange(optionValue);
    }
  };

  useOutsideClickHandler(dropDownRef, () => {
    setIsOpen(false);
  });

  const selectedOption = options.find((o) => o.value === selectedValue);

  return (
    <div className={cn(" flex flex-col", wrapperClassName)} ref={dropDownRef}>
      {!!label && (
        <label className={cn("px-4 text-left font-medium", labelClassName)}>
          {label}
        </label>
      )}

      <div
        className={cn(
          "relative py-2  rounded-lg border border-[#727272] focus-within:ring-1 focus-within:ring-black",
          inputWrapperClassName,
          disabled && "opacity-75",
          isDark && "bg-black text-white"
        )}
      >
        {!!leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
            {leftIcon}
          </div>
        )}

        <button
          type="button"
          className={cn(
            "flex h-full w-full flex-1 items-center gap-4 px-4  pr-2 text-left outline-none disabled:pointer-events-none disabled:cursor-not-allowed",
            className,
            !!leftIcon && "pl-12",
            isDark && "bg-black text-white",
            buttonClassName
          )}
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <span className="flex-1">{selectedOption?.label ?? placeholder}</span>

          <MdKeyboardArrowDown className="text-lg" />
        </button>

        {isOpen && (
          <div
            className={cn(
              "absolute !top-auto z-10 mt-2 cScrollBar flex max-h-[200px] min-h-[60px] w-full flex-col overflow-hidden overflow-y-auto rounded-lg  bg-[#1f232d] shadow-[0px_0px_3px_rgba(255,255,255,0.5)]",
              isDark && "bg-black text-white",
              isDarkClassName
            )}
          >
            {options.length <= 0 && (
              <div className="mx-0 my-auto flex w-full items-center justify-center px-2 py-2">
                <span className="loading loading-spinner text-primary loading-md text-center"></span>
              </div>
            )}

            {options.map((o) => {
              const isDisabled = false;
              //o.value === "business" || o.value === "themepage"; // adjust as needed
              const isSelected = o.value === selectedValue;

              return (
                <button
                  key={o.value}
                  className={cn(
                    "hover:text-[#000] w-full px-4 py-2 text-left hover:bg-[#ccc]",
                    isSelected && !isDark && "bg-black text-white",
                    isSelected && isDark && "bg-white text-black",
                    isDisabled &&
                      "pointer-events-none cursor-not-allowed bg-black text-[#5c5c5c]"
                  )}
                  onClick={() => !isDisabled && handleOptionClick(o.value)}
                  disabled={isDisabled}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputSelect;
