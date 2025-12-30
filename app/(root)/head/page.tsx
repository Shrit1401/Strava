"use client";

import Image from "next/image";
import { getRandomIcon } from "@/utils/astrology";

const MasterHeadPage = () => {
  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      <div className="relative z-10">
        <section className="container mx-auto px-6 md:px-8 pt-32 pb-20 md:pt-40 md:pb-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="cormorant text-4xl md:text-5xl lg:text-6xl font-light mb-6 text-black leading-tight">
              There is no team. But Shrit alone.
            </h1>
            <p className="text-sm md:text-base text-[#575657] leading-relaxed max-w-2xl mx-auto">
              Every pixel, every line of code, every bug, you're looking at one
              person: developer, artist, tester, all of it.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-6 md:px-8 pb-32">
          <div className="max-w-3xl mx-auto">
            <div className="border-t border-black/10 pt-16">
              <div className="max-w-2xl mx-auto">
                <p className="text-xs tracking-[0.2em] uppercase text-[#575657] mb-8">
                  A Note
                </p>
                <div className="cormorant text-base md:text-lg text-black leading-relaxed space-y-4">
                  <p>
                    I don&apos;t really believe in astrology. But math was very
                    cool, and with this theme it&apos;s a cool project I worked
                    on.
                  </p>
                  <p>
                    There&apos;s something beautiful about taking NASA data
                    real, precise orbital calculations and mapping them to human
                    experience. The mathematics of planetary motion, the
                    algorithms that calculate positions across time, the
                    relationships between celestial bodies expressed in numbers.
                    That&apos;s what drew me in.
                  </p>
                  <p>
                    Astrology becomes a lens, a framework. Whether or not the
                    stars actually influence our lives, the patterns we find
                    there help us make sense of ourselves and each other. And
                    building something that bridges the gap between hard science
                    and human meaning? That&apos;s the kind of project worth
                    working on.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="container mx-auto px-6 md:px-8 pb-20">
          <div className="max-w-5xl mx-auto">
            <div className="bg-[#fafafa] p-8 md:p-12 lg:p-16 border border-black/5">
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
                  <p className="text-xs tracking-[0.15em] uppercase text-[#575657]">
                    Shrit Shrivastava | 2025
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-10">
        <div className="absolute top-20 left-12 w-32 h-32  hidden lg:block">
          <Image src={getRandomIcon()} alt="" fill className="object-contain" />
        </div>
        <div className="absolute top-32 right-16 w-28 h-28 hidden lg:block">
          <Image src={getRandomIcon()} alt="" fill className="object-contain" />
        </div>
        <div className="absolute top-1/2 left-8 w-24 h-24 hidden lg:block">
          <Image src={getRandomIcon()} alt="" fill className="object-contain" />
        </div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 opacity-[0.025] hidden lg:block">
          <Image src={getRandomIcon()} alt="" fill className="object-contain" />
        </div>
        <div className="absolute bottom-32 right-20 w-16 h-16  hidden lg:block">
          <Image src={getRandomIcon()} alt="" fill className="object-contain" />
        </div>
        <div className="absolute top-24 right-1/3 w-20 h-20  hidden lg:block">
          <Image src={getRandomIcon()} alt="" fill className="object-contain" />
        </div>
        <div className="absolute bottom-1/4 left-1/5 w-16 h-16 hidden lg:block">
          <Image src={getRandomIcon()} alt="" fill className="object-contain" />
        </div>
        <div className="absolute bottom-1/3 left-16 w-20 h-20  hidden lg:block">
          <Image src={getRandomIcon()} alt="" fill className="object-contain" />
        </div>
        <div className="absolute top-2/3 left-1/4 w-16 h-16  hidden lg:block">
          <Image src={getRandomIcon()} alt="" fill className="object-contain" />
        </div>
        <div className="absolute bottom-40 left-1/3 w-24 h-24 hidden lg:block">
          <Image src={getRandomIcon()} alt="" fill className="object-contain" />
        </div>
        <div className="absolute top-1/4 left-1/3 w-14 h-14  hidden lg:block">
          <Image src={getRandomIcon()} alt="" fill className="object-contain" />
        </div>
        <div className="absolute bottom-24 right-12 w-26 h-26 hidden lg:block">
          <Image src={getRandomIcon()} alt="" fill className="object-contain" />
        </div>
      </div>
    </main>
  );
};

export default MasterHeadPage;
