"use client";
import Button from "@/components/ui/Button";

const LandingPage = () => {
  return (
    <main className="">
      <section className="container mx-auto px-6 pt-16 text-center">
        <h1 className="cormorant text-3xl md:text-4xl lg:text-5xl mb-4">
          <span className="block">Strava</span>
        </h1>
        <p className="text-sm text-[#575657]">
          The astrology app that deciphers the mystery of human relations
          through NASA data and biting truth.
        </p>

        <Button text="Start" className="my-8" onClick={() => {}} />

        <div className="flex justify-center">
          <img
            src="https://www.costarastrology.com/85d1b4b7448fe25656ef0cfb4a7c90b2.webp"
            alt="Co–Star app preview"
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
                href="#"
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
                href="#"
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
    </main>
  );
};

export default LandingPage;
