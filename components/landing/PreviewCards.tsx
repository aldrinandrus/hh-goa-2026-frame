"use client";

import { memo } from "react";

/** Mini preview cards — no remounting Motion keys. */
export const PreviewCards = memo(function PreviewCards() {
  return (
    <div className="mt-10 flex flex-wrap items-end justify-center gap-6 sm:gap-10">
      <div className="relative transition-transform duration-200 ease-out hover:-translate-y-2 hover:rotate-[-2deg] rotate-[-4deg]">
        <div className="relative">
          <div className="absolute inset-0 translate-x-1 translate-y-1 rounded-full border-[5px] border-[#ff0080]" />
          <div
            className="relative flex h-40 w-40 items-center justify-center rounded-full border-[5px] border-[#fee101] bg-[#0b6839] shadow-[0_0_18px_4px_#fee1014d] sm:h-48 sm:w-48"
            style={{
              backgroundImage:
                "conic-gradient(from 200deg, #fee101, #0b6839, #fee101, #ff0080, #fee101)",
              padding: 6,
            }}
          >
            <div className="flex h-full w-full items-end justify-center rounded-full border-2 border-black bg-[#fffbe8]/25 pb-5 font-[family-name:var(--font-imbue)] text-sm font-extrabold text-[#fee101]">
              HH GOA
            </div>
          </div>
        </div>
        <p className="mt-3 text-center font-mono text-xs font-semibold uppercase tracking-widest text-black/70">
          Profile Frame
        </p>
      </div>

      <div className="relative transition-transform duration-200 ease-out hover:-translate-y-2 hover:rotate-[1deg] rotate-[3deg]">
        <div className="relative h-52 w-40 sm:h-60 sm:w-44">
          <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-[#ff0080]" />
          <div className="absolute inset-0 translate-x-3 translate-y-3 bg-[#fee101]/50" />
          <div className="relative flex h-full flex-col overflow-hidden border-2 border-black bg-[#fffbe8]">
            <div className="flex items-start justify-between p-2">
              <span className="font-[family-name:var(--font-imbue)] text-2xl font-extrabold leading-none text-[#0b6839]">
                HH
              </span>
              <span className="border border-black bg-[#fee101] px-1 font-mono text-[7px] font-bold">
                OFFICIAL
              </span>
            </div>
            <div className="mx-auto h-20 w-[55%] rounded-[12px_4px_14px_6px] border-2 border-black bg-[#0b6839]/20 shadow-[3px_3px_#fee101]" />
            <div className="mt-2 px-2 text-center">
              <div className="mx-auto h-2 w-3/4 bg-black/80" />
              <div className="mx-auto mt-1 h-1.5 w-1/2 bg-[#0b6839]/50" />
              <div className="mx-auto mt-2 h-1.5 w-2/3 bg-[#ff0080]/70" />
            </div>
            <div className="mt-auto bg-[#0b6839] py-1 text-center font-[family-name:var(--font-imbue)] text-[9px] font-bold tracking-widest text-[#fee101]">
              HACKER HOUSE
            </div>
          </div>
        </div>
        <p className="mt-3 text-center font-mono text-xs font-semibold uppercase tracking-widest text-black/70">
          Builder Passport
        </p>
      </div>
    </div>
  );
});
