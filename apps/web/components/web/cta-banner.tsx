"use client";

import { cn } from "@packtok/ui/lib/utils";
import Link from "next/link";

interface CtaBannerProps {
  href: string;
  title?: React.ReactNode;
  buttonText?: string;
  className?: string;
  bgClassName?: string;
}

export default function CtaBanner({
  href,
  title = (
    <>
      Not sure where to begin? Start <br /> with Filling the form
    </>
  ),
  buttonText = "Click here",
  className,
  bgClassName,
}: CtaBannerProps) {
  return (
    <section className={cn("w-full bg-[#0DB0F3]", bgClassName)}>
      <div
        className={cn(
          "w-[95%] sm:w-[90%] md:w-[85%] mx-auto flex justify-between py-12 items-center",
          className
        )}
      >
        <h2 className={cn("text-4xl font-semibold text-white")}>{title}</h2>
        <Link
          href={href}
          className={cn("uppercase text-black bg-white px-6 py-4 rounded-sm")}
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
}
