"use client";

import React from "react";

type CollapsibleLayerProps = {
  title: string;
  summary?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

export default function CollapsibleLayer({
  title,
  summary,
  isOpen,
  onToggle,
  children,
  className = "",
  contentClassName = "",
}: CollapsibleLayerProps) {
  return (
    <div
      className={[
        "rounded-2xl border border-stone-200/80 bg-white",
        "transition-[border-color,background-color,box-shadow] duration-200",
        "shadow-[0_1px_2px_rgba(0,0,0,0.02)]",
        isOpen ? "border-stone-300/80" : "hover:border-stone-300/70",
        className,
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={[
          "w-full rounded-2xl bg-transparent text-left",
          "flex items-start justify-between gap-4",
          "px-4 py-3.5 sm:px-5 sm:py-4",
          "transition-colors duration-200",
          "hover:bg-stone-50/70",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10",
        ].join(" ")}
      >
        <div className="min-w-0 flex-1">
          <div className="text-[0.95rem] font-semibold leading-6 text-neutral-900">
            {title}
          </div>

          {summary ? (
            <div className="mt-1.5 text-[0.84rem] leading-5.5 text-stone-500">
              {summary}
            </div>
          ) : null}
        </div>

        <span
          aria-hidden="true"
          className={[
            "mt-[1px] inline-flex h-5 w-5 shrink-0 items-center justify-center",
            "text-stone-400 transition-transform duration-200 ease-out",
            isOpen ? "rotate-90" : "rotate-0",
          ].join(" ")}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.5 5.5L12 10L7.5 14.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <div
        className={[
          "grid overflow-hidden transition-all duration-200 ease-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        ].join(" ")}
      >
        <div className="overflow-hidden">
          <div
            className={[
              "px-4 pb-4 sm:px-5 sm:pb-5",
              "text-[0.95rem] leading-7 text-neutral-700",
              contentClassName,
            ].join(" ")}
          >
            <div className="border-t border-stone-200/70 pt-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
