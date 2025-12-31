"use client";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { getRandomIcon } from "@/utils/astrology";
import { useState, useEffect } from "react";

const LandingPage = () => {
  const [icons, setIcons] = useState<string[]>([]);

  useEffect(() => {
    setIcons(Array.from({ length: 12 }, () => getRandomIcon()));
  }, []);

  return (
    <main className="">
      <section className="container mx-auto px-6 pt-16 text-center">
        <h1 className="cormorant text-3xl md:text-4xl lg:text-5xl mb-4">
          <span className="block coromont">Strava</span>
        </h1>
        <p className="text-sm text-[#575657]">
          The astrology website that deciphers the mystery of human relations
          through real data and biting truth.
        </p>

        <Button text="Start" className="my-8" href="/astrology" />

        <div className="flex justify-center">
          <img
            src="./mockup.png"
            alt="Strava app preview"
            className="max-w-5xl w-full"
          />
        </div>
      </section>

      <section className="bg-[#141414] text-white py-24">
        <div className="container mx-auto px-6 text-center">
          <p className="text-xs tracking-[0.3em] text-center uppercase mb-16">
            What Is This
          </p>

          <div className="grid gap-16 md:grid-cols-3 md:items-start text-sm leading-relaxed max-w-5xl mx-auto">
            <div className="text-center">
              <div className="flex justify-center mb-10">
                <img
                  src="https://www.costarastrology.com/6bee61117bb52afb66ef42f2621be93e.png"
                  alt="Celestial body"
                  className="w-40 h-40 object-cover rounded-full"
                />
              </div>
              <p className="text-[#f5f5f5] max-w-xs mx-auto">
                Access to astrology this accurate has historically been
                restricted to those with access to personal astrologers—now
                these predictions can be anyone&apos;s.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-10">
                <img
                  src="https://www.costarastrology.com/bb58ee878249cbf8484811ebcbb58a0b.png"
                  alt="Hand reaching"
                  className="w-40 h-40 object-cover"
                />
              </div>
              <p className="text-[#f5f5f5] max-w-xs mx-auto">
                Our powerful natural-language engine uses NASA data, coupled
                with the methods of professional astrologers, to algorithmically
                generate insights about who you are and how you relate to
                others.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-10">
                <img
                  src="https://www.costarastrology.com/a8e5bd2b6df39d407ace7e35ef6bc081.png"
                  alt="Skull in profile"
                  className="w-40 h-40 object-cover"
                />
              </div>
              <p className="text-[#f5f5f5] max-w-xs mx-auto">
                Astrology puts our temporary bodies in context with our
                universe&apos;s vastness, allowing irrationality to invade our
                techno-rationalist ways of living.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="text-[#575657] py-24">
        <div className="container mx-auto px-6">
          <div className="grid gap-16 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
            <div className="flex justify-center md:justify-start">
              <img
                src="https://www.costarastrology.com/77d9c8d16ebec0bc21a233ed9e9ad1dd.png"
                alt="Birth chart illustration"
                className="w-full max-w-3xl"
              />
            </div>

            <div className="max-w-xl md:ml-8 md:mt-12">
              <h2 className="cormorant text-2xl md:text-3xl lg:text-4xl mb-6">
                Understand your birth chart
              </h2>
              <p className="text-sm text-[#575657] leading-relaxed mb-8">
                Unlike the broad and vague magazine horoscopes that only use
                your sun sign, we use a complete picture of the sky when and
                where you were born to generate your full birth chart.
              </p>
              <a
                href="/natal-chart"
                className="text-xs tracking-[0.18em] uppercase underline underline-offset-4"
              >
                Get your chart online &gt;
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="text-[#575657] py-24">
        <div className="container mx-auto px-6">
          <div className="grid gap-16 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
            <div className="max-w-xl md:ml-8 md:mt-12">
              <h2 className="cormorant text-2xl md:text-3xl lg:text-4xl mb-6">
                Real-time insights, as the planets move
              </h2>
              <p className="text-sm text-[#575657] leading-relaxed mb-8">
                We use NASA data to know exactly where the stars are, and
                proprietary technology to generate super-accurate horoscopes.
                Know what to look for as the stars move—starting now.
              </p>
              <a
                href="/natal-chart"
                className="text-xs tracking-[0.18em] uppercase underline underline-offset-4"
              >
                Get your chart online &gt;
              </a>
            </div>

            <div className="flex justify-center md:justify-start">
              <img
                src="https://www.costarastrology.com/5ac8531ee33f602dbb1ec50aa0d66a4b.png"
                alt="Birth chart illustration"
                className="w-full max-w-3xl"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-6 md:px-8 pb-20 z-[10]">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white p-8 md:p-12 lg:p-16 border border-black/5">
            <div className="grid md:grid-cols-[180px_1fr] gap-8 md:gap-12 items-start">
              <div className="flex justify-center md:justify-start">
                <div className="relative w-40 h-40 md:w-44 md:h-44 rounded-full overflow-hidden">
                  <Image
                    src="/shrit.png"
                    alt="Portrait"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              <div>
                <p className="text-xs tracking-[0.15em] uppercase text-[#575657]">
                  About Me
                </p>
                <div className="space-y-6">
                  <p className="cormorant text-lg md:text-xl lg:text-2xl text-black leading-relaxed">
                    I’m currently a freshman in college, but I’ve been building
                    websites for over 6 years. Over the years, I’ve developed
                    games, websites, apps, and CLI tools, taken on freelance
                    projects, and gained experience working at companies. I’m
                    always eager to learn and explore new directions in
                    technology. To learn more about my work, please visit
                    <a
                      href="https://www.shrit.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-50 ml-2 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
                    >
                      my website.
                    </a>
                    .
                  </p>
                </div>
                <p className="text-xs tracking-[0.15em] mt-2 uppercase text-[#575657]">
                  Shrit Shrivastava | 2025
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[0] opacity-10">
        <div className="absolute top-20 left-12 w-32 h-32  hidden lg:block">
          {icons[0] && (
            <Image src={icons[0]} alt="" fill className="object-contain" />
          )}
        </div>
        <div className="absolute top-32 right-16 w-28 h-28 hidden lg:block">
          {icons[1] && (
            <Image src={icons[1]} alt="" fill className="object-contain" />
          )}
        </div>
        <div className="absolute top-1/2 left-8 w-24 h-24 hidden lg:block">
          {icons[2] && (
            <Image src={icons[2]} alt="" fill className="object-contain" />
          )}
        </div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 opacity-[0.025] hidden lg:block">
          {icons[3] && (
            <Image src={icons[3]} alt="" fill className="object-contain" />
          )}
        </div>
        <div className="absolute bottom-32 right-20 w-16 h-16  hidden lg:block">
          {icons[4] && (
            <Image src={icons[4]} alt="" fill className="object-contain" />
          )}
        </div>
        <div className="absolute top-24 right-1/3 w-20 h-20  hidden lg:block">
          {icons[5] && (
            <Image src={icons[5]} alt="" fill className="object-contain" />
          )}
        </div>
        <div className="absolute bottom-1/4 left-1/5 w-16 h-16 hidden lg:block">
          {icons[6] && (
            <Image src={icons[6]} alt="" fill className="object-contain" />
          )}
        </div>
        <div className="absolute bottom-1/3 left-16 w-20 h-20  hidden lg:block">
          {icons[7] && (
            <Image src={icons[7]} alt="" fill className="object-contain" />
          )}
        </div>
        <div className="absolute top-2/3 left-1/4 w-16 h-16  hidden lg:block">
          {icons[8] && (
            <Image src={icons[8]} alt="" fill className="object-contain" />
          )}
        </div>
        <div className="absolute bottom-40 left-1/3 w-24 h-24 hidden lg:block">
          {icons[9] && (
            <Image src={icons[9]} alt="" fill className="object-contain" />
          )}
        </div>
        <div className="absolute top-1/4 left-1/3 w-14 h-14  hidden lg:block">
          {icons[10] && (
            <Image src={icons[10]} alt="" fill className="object-contain" />
          )}
        </div>
        <div className="absolute bottom-24 right-12 w-26 h-26 hidden lg:block">
          {icons[11] && (
            <Image src={icons[11]} alt="" fill className="object-contain" />
          )}
        </div>
      </div>
    </main>
  );
};

export default LandingPage;
