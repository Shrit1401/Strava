"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Dialog } from "@/components/ui/Dialog";
import TransitChart from "@/components/TransitChart";

const DashboardPage = () => {
  const [userName, setUserName] = useState("Shrit");
  const [currentDate, setCurrentDate] = useState("");
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const name =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "Shrit";
        setUserName(name);
      }
    };
    getUser();

    const now = new Date();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const dayName = days[now.getDay()];
    const month = months[now.getMonth()];
    const day = now.getDate();
    setCurrentDate(`${dayName} ${month} ${day}`);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-32 pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-16 lg:gap-20">
          <div className="space-y-12 lg:space-y-16">
            <div className="space-y-3">
              <p className="text-sm text-[#575657] tracking-wide">
                {getGreeting()} {userName}, It&apos;s {currentDate}
              </p>
              <p className="text-xs text-[#575657] uppercase tracking-wider">
                Your Day at Glance
              </p>
            </div>

            <div className="pt-4">
              <h1 className="cormorant text-5xl md:text-6xl lg:text-7xl font-light text-black leading-[1.1] tracking-tight">
                Anyone who falls in love with you will remember it for the rest
                of the life
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-black/5">
              <div className="space-y-4">
                <h2 className="text-xs font-normal uppercase tracking-[0.15em] text-black/60 mb-6">
                  Do
                </h2>
                <ul className="space-y-3 text-lg text-black/80 leading-relaxed">
                  <li className="pl-0 cormorant font-bold">
                    Swallow Your Pride
                  </li>
                  <li className="pl-0 cormorant font-bold">Flings</li>
                  <li className="pl-0 cormorant font-bold">Low Stakes</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h2 className="text-xs font-normal uppercase tracking-[0.15em] text-black/60 mb-6">
                  Don&apos;t
                </h2>
                <ul className="space-y-3 text-lg text-black/80 leading-relaxed">
                  <li className="pl-0 cormorant font-bold">Hurt Feeling</li>
                  <li className="pl-0 cormorant font-bold">
                    Dramatic Gestures
                  </li>
                  <li className="pl-0 cormorant font-bold">Regrets</li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-black/5">
              <h2 className="text-xs font-normal uppercase tracking-[0.15em] text-black/60 mb-8">
                Today
              </h2>
              <ul className="space-y-5 text-sm text-black/80 leading-relaxed">
                <li className="flex items-start gap-4">
                  <span className="text-base mt-0.5 opacity-70">💡</span>
                  <span>
                    Anyone who falls in love with you will remember it for the
                    rest of life
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-base mt-0.5 opacity-70">🌱</span>
                  <span>Power in social life</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-base mt-0.5 opacity-70">🔥</span>
                  <span>Pressure in self</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-base mt-0.5 opacity-70">🚫</span>
                  <span>
                    Trouble with{" "}
                    <span className="underline decoration-black/30">
                      routine
                    </span>
                    ,{" "}
                    <span className="underline decoration-black/30">
                      thinking & creativity
                    </span>
                    ,{" "}
                    <span className="underline decoration-black/30">
                      spirituality
                    </span>
                    , and{" "}
                    <span className="underline decoration-black/30">
                      sex & love
                    </span>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <div className="aspect-square w-full overflow-hidden scale-110">
                <Image
                  src="/sky.png"
                  alt="Sky"
                  width={800}
                  height={800}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5 pt-8 border-t border-black/5 text-sm text-black/70 leading-[1.8] w-full">
          <p>
            Today you feel torn between the pressure to let your guard down and
            your love of safety and security. It&apos;s good to draw boundaries
            if that&apos;s what you need.
          </p>
          <p>
            Just make sure you&apos;re not doing that thing where you shut down,
            and then convince yourself that it is self-centered to make requests
            of others. Expand the definition of who you are
          </p>
        </div>

        <div className="space-y-20 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-12 items-start">
            <div className="space-y-3">
              <p className="text-xs font-normal uppercase tracking-[0.15em] text-black/60">
                Power
              </p>
              <div className="border-t border-black/5 pt-4">
                <h3 className="cormorant text-2xl font-light text-black mb-4">
                  Social Life
                </h3>
                <p className="text-sm text-black/70 leading-relaxed mb-4">
                  Strangers will notice you today. Luck currently spotlights
                  your public self, bringing chances to shine through your
                  skills and talents in ways others will remember. The version
                  of you that impresses people isn&apos;t fake—it&apos;s just
                  one facet of your complex personality that happens to work
                  well right now.
                </p>
                <button
                  onClick={() => setOpenDialog("social-life")}
                  className="text-xs font-normal uppercase tracking-[0.15em] text-black/60 hover:text-black/80 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  Details
                  <span className="text-base">→</span>
                </button>
              </div>
            </div>
            <div className="hidden md:block shrink-0">
              <div className="w-full aspect-square relative">
                <Image
                  src="/icons/telephone.png"
                  alt="Social Life"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-10 items-start">
            <div className="hidden md:block shrink-0 order-2 md:order-1">
              <div className="w-full aspect-4/5 relative">
                <Image
                  src="/icons/jug.png"
                  alt="Self"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="space-y-3 order-1 md:order-2">
              <p className="text-xs font-normal uppercase tracking-[0.15em] text-black/60">
                Pressure
              </p>
              <div className="border-t border-black/5 pt-4">
                <h3 className="cormorant text-2xl font-light text-black mb-4">
                  Self
                </h3>
                <p className="text-sm text-black/70 leading-relaxed mb-4">
                  Your skin feels thinner than usual today. Your normal
                  toughness has temporarily given way to a raw sensitivity that
                  makes criticism sting more than it should. This heightened
                  vulnerability isn&apos;t weakness —it&apos;s a chance to learn
                  what your reactions teach about your deepest needs.
                </p>
                <button
                  onClick={() => setOpenDialog("self")}
                  className="text-xs font-normal uppercase tracking-[0.15em] text-black/60 hover:text-black/80 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  Details
                  <span className="text-base">→</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-14 items-center">
            <div className="space-y-3">
              <p className="text-xs font-normal uppercase tracking-[0.15em] text-black/60">
                Trouble
              </p>
              <div className="border-t border-black/5 pt-4">
                <h3 className="cormorant text-2xl font-light text-black mb-4">
                  Spirituality
                </h3>
                <p className="text-sm text-black/70 leading-relaxed mb-4">
                  Your spiritual path may feel unclear or blocked today. Trust
                  that these moments of uncertainty are part of the journey,
                  offering opportunities for deeper reflection and growth.
                </p>
                <button
                  onClick={() => setOpenDialog("spirituality")}
                  className="text-xs font-normal uppercase tracking-[0.15em] text-black/60 hover:text-black/80 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  Details
                  <span className="text-base">→</span>
                </button>
              </div>
            </div>
            <div className="hidden md:block shrink-0">
              <div className="w-full aspect-3/4 relative">
                <Image
                  src="/icons/leaf.png"
                  alt="Spirituality"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 items-end">
            <div className="hidden md:block shrink-0 order-2 md:order-1">
              <div className="w-full aspect-square relative">
                <Image
                  src="/icons/butterfly.png"
                  alt="Sex & Love"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="space-y-3 order-1 md:order-2">
              <p className="text-xs font-normal uppercase tracking-[0.15em] text-black/60">
                Trouble
              </p>
              <div className="border-t border-black/5 pt-4">
                <h3 className="cormorant text-2xl font-light text-black mb-4">
                  Sex & Love
                </h3>
                <p className="text-sm text-black/70 leading-relaxed mb-4">
                  Intimacy and romantic connections may feel complicated today.
                  Take time to understand your own needs and communicate them
                  clearly with those who matter most.
                </p>
                <button
                  onClick={() => setOpenDialog("sex-love")}
                  className="text-xs font-normal uppercase tracking-[0.15em] text-black/60 hover:text-black/80 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  Details
                  <span className="text-base">→</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_150px] gap-16 items-start">
            <div className="space-y-3">
              <p className="text-xs font-normal uppercase tracking-[0.15em] text-black/60">
                Trouble
              </p>
              <div className="border-t border-black/5 pt-4">
                <h3 className="cormorant text-2xl font-light text-black mb-4">
                  Routine
                </h3>
                <p className="text-sm text-black/70 leading-relaxed mb-4">
                  Your usual patterns and habits may feel disrupted or difficult
                  to maintain. This disruption can be an invitation to examine
                  what truly serves you and what might need to change.
                </p>
                <button
                  onClick={() => setOpenDialog("routine")}
                  className="text-xs font-normal uppercase tracking-[0.15em] text-black/60 hover:text-black/80 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  Details
                  <span className="text-base">→</span>
                </button>
              </div>
            </div>
            <div className="hidden md:block shrink-0">
              <div className="w-full aspect-5/4 relative">
                <Image
                  src="/icons/jug.png"
                  alt="Routine"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-12 items-center">
            <div className="hidden md:block shrink-0 order-2 md:order-1">
              <div className="w-full aspect-square relative">
                <Image
                  src="/icons/prisma.png"
                  alt="Thinking & Creativity"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="space-y-3 order-1 md:order-2">
              <p className="text-xs font-normal uppercase tracking-[0.15em] text-black/60">
                Trouble
              </p>
              <div className="border-t border-black/5 pt-4">
                <h3 className="cormorant text-2xl font-light text-black mb-4">
                  Thinking & Creativity
                </h3>
                <p className="text-sm text-black/70 leading-relaxed mb-4">
                  Mental clarity and creative expression may feel blocked or
                  challenging. Sometimes the best ideas come after periods of
                  struggle—trust the process and allow space for new
                  perspectives to emerge.
                </p>
                <button
                  onClick={() => setOpenDialog("thinking-creativity")}
                  className="text-xs font-normal uppercase tracking-[0.15em] text-black/60 hover:text-black/80 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  Details
                  <span className="text-base">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <Dialog
          isOpen={openDialog === "social-life"}
          onClose={() => setOpenDialog(null)}
          title="Social Life"
          category="Power"
        >
          <div className="space-y-6">
            <TransitChart
              planet1={{
                name: "Moon",
                longitude: 30,
                icon: "/planets/moon.svg",
              }}
              planet2={{
                name: "Venus",
                longitude: 150,
                icon: "/planets/venus.svg",
              }}
              aspect={{ type: "Trine", angle: 120 }}
            />
            <div className="space-y-4">
              <p className="text-xs font-normal uppercase tracking-[0.15em] text-black/60 mb-2">
                Moon Facilitating Romance
              </p>
              <p>
                The Moon is currently four signs (120°) away from where Venus
                was when you were born. That angle (trine) brings positivity and
                acceleration. The Moon stands for your emotional world. Venus
                represents pleasure.
              </p>
              <p>
                Strangers will notice you today. Luck currently spotlights your
                public self, bringing chances to shine through your skills and
                talents in ways others will remember. The version of you that
                impresses people isn&apos;t fake—it&apos;s just one facet of
                your complex personality that happens to work well right now.
              </p>
              <p>
                This is a time to embrace your natural charisma and ability to
                connect. The planets are aligning to support your social
                endeavors, making it easier to form new bonds and strengthen
                existing ones. Trust in your ability to navigate social
                situations with grace and authenticity.
              </p>
            </div>
          </div>
        </Dialog>

        <Dialog
          isOpen={openDialog === "self"}
          onClose={() => setOpenDialog(null)}
          title="Self"
          category="Pressure"
        >
          <div className="space-y-6">
            <TransitChart
              planet1={{
                name: "Mars",
                longitude: 180,
                icon: "/planets/mars.svg",
              }}
              planet2={{
                name: "Saturn",
                longitude: 270,
                icon: "/planets/saturn.svg",
              }}
              aspect={{ type: "Square", angle: 90 }}
            />
            <div className="space-y-4">
              <p className="text-xs font-normal uppercase tracking-[0.15em] text-black/60 mb-2">
                Mars Pressuring Self
              </p>
              <p>
                Mars is currently three signs (90°) away from where Saturn was
                when you were born. That angle (square) brings tension and
                challenge. Mars represents action and drive. Saturn represents
                structure and boundaries.
              </p>
              <p>
                Your skin feels thinner than usual today. Your normal toughness
                has temporarily given way to a raw sensitivity that makes
                criticism sting more than it should. This heightened
                vulnerability isn&apos;t weakness —it&apos;s a chance to learn
                what your reactions teach about your deepest needs.
              </p>
              <p>
                The pressure you&apos;re feeling is an invitation to look inward
                and understand what truly matters to you. When you feel
                defensive or hurt, pause and ask yourself: what need is not
                being met? What boundary needs to be set or respected?
              </p>
            </div>
          </div>
        </Dialog>

        <Dialog
          isOpen={openDialog === "spirituality"}
          onClose={() => setOpenDialog(null)}
          title="Spirituality"
          category="Trouble"
        >
          <div className="space-y-6">
            <TransitChart
              planet1={{
                name: "Neptune",
                longitude: 60,
                icon: "/planets/neptune.svg",
              }}
              planet2={{
                name: "Jupiter",
                longitude: 240,
                icon: "/planets/jupiter.svg",
              }}
              aspect={{ type: "Opposition", angle: 180 }}
            />
            <div className="space-y-4">
              <p className="text-xs font-normal uppercase tracking-[0.15em] text-black/60 mb-2">
                Neptune Clouding Spirituality
              </p>
              <p>
                Neptune is currently six signs (180°) away from where Jupiter
                was when you were born. That angle (opposition) brings
                polarization and tension. Neptune represents dreams and
                illusions. Jupiter represents expansion and faith.
              </p>
              <p>
                Your spiritual path may feel unclear or blocked today. Trust
                that these moments of uncertainty are part of the journey,
                offering opportunities for deeper reflection and growth.
              </p>
              <p>
                When the path ahead seems foggy, it often means you&apos;re
                being called to slow down and listen more carefully. The answers
                you seek may not come from external sources, but from within.
                Take time for quiet contemplation, meditation, or simply being
                present with your thoughts.
              </p>
            </div>
          </div>
        </Dialog>

        <Dialog
          isOpen={openDialog === "sex-love"}
          onClose={() => setOpenDialog(null)}
          title="Sex & Love"
          category="Trouble"
        >
          <div className="space-y-6">
            <TransitChart
              planet1={{
                name: "Venus",
                longitude: 240,
                icon: "/planets/venus.svg",
              }}
              planet2={{
                name: "Pluto",
                longitude: 90,
                icon: "/planets/pluto.svg",
              }}
              aspect={{ type: "Square", angle: 90 }}
            />
            <div className="space-y-4">
              <p className="text-xs font-normal uppercase tracking-[0.15em] text-black/60 mb-2">
                Venus Challenging Love
              </p>
              <p>
                Venus is currently three signs (90°) away from where Pluto was
                when you were born. That angle (square) brings tension and
                transformation. Venus represents love and beauty. Pluto
                represents depth and transformation.
              </p>
              <p>
                Intimacy and romantic connections may feel complicated today.
                Take time to understand your own needs and communicate them
                clearly with those who matter most.
              </p>
              <p>
                When relationships feel challenging, it&apos;s often a sign that
                something needs to be addressed—either within yourself or in the
                dynamic between you and your partner. Don&apos;t shy away from
                difficult conversations, but approach them with compassion and
                honesty.
              </p>
            </div>
          </div>
        </Dialog>

        <Dialog
          isOpen={openDialog === "routine"}
          onClose={() => setOpenDialog(null)}
          title="Routine"
          category="Trouble"
        >
          <div className="space-y-6">
            <TransitChart
              planet1={{
                name: "Mercury",
                longitude: 120,
                icon: "/planets/mercury.svg",
              }}
              planet2={{
                name: "Uranus",
                longitude: 300,
                icon: "/planets/uranus.svg",
              }}
              aspect={{ type: "Opposition", angle: 180 }}
            />
            <div className="space-y-4">
              <p className="text-xs font-normal uppercase tracking-[0.15em] text-black/60 mb-2">
                Mercury Disrupting Routine
              </p>
              <p>
                Mercury is currently six signs (180°) away from where Uranus was
                when you were born. That angle (opposition) brings disruption
                and change. Mercury represents communication and routine. Uranus
                represents innovation and sudden change.
              </p>
              <p>
                Your usual patterns and habits may feel disrupted or difficult
                to maintain. This disruption can be an invitation to examine
                what truly serves you and what might need to change.
              </p>
              <p>
                When routines break down, it&apos;s easy to feel frustrated or
                lost. But these moments of disruption are often opportunities in
                disguise. They force you to question whether your current habits
                are still aligned with who you&apos;re becoming.
              </p>
            </div>
          </div>
        </Dialog>

        <Dialog
          isOpen={openDialog === "thinking-creativity"}
          onClose={() => setOpenDialog(null)}
          title="Thinking & Creativity"
          category="Trouble"
        >
          <div className="space-y-6">
            <TransitChart
              planet1={{
                name: "Sun",
                longitude: 210,
                icon: "/planets/sun.svg",
              }}
              planet2={{
                name: "Neptune",
                longitude: 60,
                icon: "/planets/neptune.svg",
              }}
              aspect={{ type: "Square", angle: 90 }}
            />
            <div className="space-y-4">
              <p className="text-xs font-normal uppercase tracking-[0.15em] text-black/60 mb-2">
                Sun Clouding Creativity
              </p>
              <p>
                The Sun is currently three signs (90°) away from where Neptune
                was when you were born. That angle (square) brings confusion and
                challenge. The Sun represents identity and expression. Neptune
                represents dreams and illusions.
              </p>
              <p>
                Mental clarity and creative expression may feel blocked or
                challenging. Sometimes the best ideas come after periods of
                struggle—trust the process and allow space for new perspectives
                to emerge.
              </p>
              <p>
                When your mind feels foggy or your creativity seems stuck,
                it&apos;s often because you&apos;re trying too hard. Creativity
                needs space to breathe. Step away from the problem, take a walk,
                or engage in something completely different. The solution often
                arrives when you&apos;re not actively searching for it.
              </p>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default DashboardPage;
