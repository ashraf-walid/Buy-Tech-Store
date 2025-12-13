"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function SaleSection({
  startDate,
  endDate,
  discount,
  leftImage,
  rightImage,
  title,
  buttonText,
  buttonLink
}) {

  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0,
  });

  useEffect(() => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    // If sale has not started yet → hide timer or show “coming soon”
    if (Date.now() < start) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const distance = end - now;

      if (distance <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [startDate, endDate]);

  return (
    <section className="relative w-full py-12 bg-gray-100 my-20 overflow-hidden">

      <div className="mx-auto lg:w-[80%] flex items-center justify-center gap-12">

        {/* Left Image */}
        <Image src={leftImage} alt="Sale" width={380} height={380} className="object-contain" />


        <div className="flex flex-col items-center gap-8 md:items-center">

          {/* Countdown */}
          <div className="flex gap-4 mb-6">
            {["days", "hours", "minutes", "seconds"].map((unit) => (
              <div key={unit} className="bg-red-700 rounded-full w-20 h-20 flex flex-col items-center justify-center text-center">
                <p className="text-xl font-bold text-white">
                  {String(timeLeft[unit]).padStart(2, "0")}
                </p>
                <span className="text-xs text-white">
                  {unit.charAt(0).toUpperCase() + unit.slice(1)}
                </span>
              </div>
            ))}
          </div>

          <h2 className="text-4xl font-bold text-black mb-4">
            {title} <span className="text-red-700">{discount}%</span>
          </h2>

          <Link href={buttonLink || "/"} className="bg-red-700 text-white text-2xl font-semibold px-6 py-3 rounded-full hover:bg-red-600 transition duration-300 cursor-pointer inline-block">
            {buttonText}
          </Link>
        </div>


        {/* Right Image */}
        <Image src={rightImage} alt="Sale" width={480} height={480} className="object-contain" />
      </div>
    </section>
  );
}
