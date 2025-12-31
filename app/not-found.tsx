"use client";
import Navbar from "@/components/Navbar";
import Button from "@/components/ui/Button";
import Image from "next/image";
import React, { useState, useEffect } from "react";

const NotFoundPage = () => {
  const [dayImage, setDayImage] = useState<string>("");
  const [icons, setIcons] = useState<string[]>([]);

  useEffect(() => {
    const randomDay = Math.floor(Math.random() * 15) + 1;
    setDayImage(`/day/${randomDay}.png`);

    const iconCount = 6;
    const randomIcons = Array.from({ length: iconCount }, () => {
      const randomIcon = Math.floor(Math.random() * 13) + 1;
      return `/icons/${randomIcon}.png`;
    });
    setIcons(randomIcons);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="grow flex items-center justify-center relative overflow-hidden">
        <div className="container mx-auto px-6 py-24 text-center relative z-10">
          <div className="max-w-2xl mx-auto">
            <div className="mb-12 flex justify-center">
              {dayImage && (
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                  <Image
                    src={dayImage}
                    alt=""
                    fill
                    className="object-contain "
                  />
                </div>
              )}
            </div>

            <h1 className="cormorant text-4xl md:text-5xl lg:text-6xl mb-6 text-black">
              404
            </h1>
            <p className="text-sm md:text-base text-[#575657] mb-8 max-w-md mx-auto leading-relaxed">
              The stars couldn&apos;t align for this page. It seems to have
              drifted into the void.
            </p>

            <Button
              text="Return Home"
              href="/"
              variant="primary"
              size="medium"
            />
          </div>
        </div>

        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-[0.2]">
          {icons[0] && (
            <div className="absolute top-[10%] left-[8%] w-24 h-24 hidden lg:block">
              <Image src={icons[0]} alt="" fill className="object-contain" />
            </div>
          )}
          {icons[1] && (
            <div className="absolute top-[15%] right-[12%] w-20 h-20 hidden lg:block">
              <Image src={icons[1]} alt="" fill className="object-contain" />
            </div>
          )}
          {icons[2] && (
            <div className="absolute top-[50%] left-[5%] w-16 h-16 hidden lg:block">
              <Image src={icons[2]} alt="" fill className="object-contain" />
            </div>
          )}
          {icons[3] && (
            <div className="absolute top-[60%] right-[8%] w-28 h-28 hidden lg:block">
              <Image src={icons[3]} alt="" fill className="object-contain" />
            </div>
          )}
          {icons[4] && (
            <div className="absolute bottom-[20%] left-[10%] w-20 h-20 hidden lg:block">
              <Image src={icons[4]} alt="" fill className="object-contain" />
            </div>
          )}
          {icons[5] && (
            <div className="absolute bottom-[15%] right-[15%] w-24 h-24 hidden lg:block">
              <Image src={icons[5]} alt="" fill className="object-contain" />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NotFoundPage;
