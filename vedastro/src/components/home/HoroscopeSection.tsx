/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import {
  Grid,
  Sun,
  Sparkles,
  Flame,
  Hash,
  Home,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";

interface ServiceItem {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface Zodiac {
  id: string;
  name: string;
  hindiName: string;
  dates: string;
  icon: string;
}

const servicesData: ServiceItem[] = [
  {
    id: 1,
    title: "Free Kundli",
    description: "Detailed birth chart in 60 sec",
    icon: <Grid className="w-4 h-4" />,
  },
  {
    id: 2,
    title: "Daily Horoscope",
    description: "For all 12 raashis",
    icon: <Sun className="w-4 h-4" />,
  },
  {
    id: 3,
    title: "Tarot Reading",
    description: "3-card, love, career, finance",
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    id: 4,
    title: "Book a Pooja",
    description: "Live pooja, verified pandits",
    icon: <Flame className="w-4 h-4" />,
  },
  {
    id: 5,
    title: "Numerology",
    description: "Name & life-path numbers",
    icon: <Hash className="w-4 h-4" />,
  },
  {
    id: 6,
    title: "Vastu Consultation",
    description: "For home, office, plot",
    icon: <Home className="w-4 h-4" />,
  },
  {
    id: 7,
    title: "Kundali Matching",
    description: "Guna milan score",
    icon: <HeartHandshake className="w-4 h-4" />,
  },
];

const zodiacs: Zodiac[] = [
  {
    id: "aries",
    name: "Aries",
    hindiName: "Mesh",
    dates: "Mar 21 - Apr 19",
    icon: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "taurus",
    name: "Taurus",
    hindiName: "Vrishabh",
    dates: "Apr 20 - May 20",
    icon: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "gemini",
    name: "Gemini",
    hindiName: "Mithun",
    dates: "May 21 - Jun 20",
    icon: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "cancer",
    name: "Cancer",
    hindiName: "Kark",
    dates: "Jun 21 - Jul 22",
    icon: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "leo",
    name: "Leo",
    hindiName: "Singh",
    dates: "Jul 23 - Aug 22",
    icon: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "virgo",
    name: "Virgo",
    hindiName: "Kanya",
    dates: "Aug 23 - Sep 22",
    icon: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "libra",
    name: "Libra",
    hindiName: "Tula",
    dates: "Sep 23 - Oct 22",
    icon: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "scorpio",
    name: "Scorpio",
    hindiName: "Vrishchik",
    dates: "Oct 23 - Nov 21",
    icon: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "sagittarius",
    name: "Sagittarius",
    hindiName: "Dhanu",
    dates: "Nov 22 - Dec 21",
    icon: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "capricorn",
    name: "Capricorn",
    hindiName: "Makar",
    dates: "Dec 22 - Jan 19",
    icon: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "aquarius",
    name: "Aquarius",
    hindiName: "Kumbh",
    dates: "Jan 20 - Feb 18",
    icon: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&auto=format&fit=crop&q=80",
  },
];

export const HoroscopeSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "Today" | "Tomorrow" | "Week" | "Month"
  >("Today");

  return (
    <section className="bg-[#0B0805] text-white py-16 px-6 md:px-12 font-sans border-t border-[#1C1610] relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="space-y-6">
          <div>
            <span className="text-[#B57E43] text-xs font-semibold tracking-[0.2em] uppercase">
              OUR SERVICES
            </span>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mt-1">
              Our <span className="text-[#C88029] font-normal">Services</span>
            </h2>
          </div>

          {/* Horizontal Scrollable Cards */}
          <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {servicesData.map((service) => (
              <div
                key={service.id}
                className="bg-[#140E0A] border border-[#261C14] hover:border-[#422F20] rounded-2xl p-5 min-w-52.5 max-w-52.5 flex flex-col justify-between h-36 shrink-0 transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
              >
                {/* Icon Box */}
                <div className="w-8 h-8 rounded-lg bg-[#211710] border border-[#3A291D] flex items-center justify-center text-[#D6923C] group-hover:text-yellow-400 transition-colors">
                  {service.icon}
                </div>

                {/* Content & Arrow */}
                <div>
                  <h3 className="font-semibold text-sm text-white truncate">
                    {service.title}
                  </h3>
                  <div className="flex items-end justify-between mt-1">
                    <p className="text-[11px] text-gray-400 line-clamp-2 pr-2 leading-tight">
                      {service.description}
                    </p>
                    <div className="w-5 h-5 rounded-full bg-[#211710] flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-[#C88029] transition-all shrink-0">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row md:items-end justify-between gap-6">
          {/* Heading */}
          <div className="space-y-2">
            <span className="text-[#B57E43] text-xs font-semibold tracking-[0.2em] uppercase">
              YOUR DAILY HOROSCOPE
            </span>
            <h2 className="text-4xl md:text-6xl font-light tracking-tight leading-tight">
              Your daily <br />
              <span className="text-[#C88029] font-normal">horoscope</span>{" "}
              reading
            </h2>
            <p className="text-gray-400 text-xs md:text-sm pt-1">
              Pick your raashi to see today&apos;s pillars at a glance.
            </p>
          </div>

          {/* Timeframe Filter Switcher */}
          <div className="bg-[#140E0A] border border-[#261C14] p-1.5 rounded-full flex items-center gap-1 self-start md:self-auto">
            {(["Today", "Tomorrow", "Week", "Month"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-[#D68528] text-black font-semibold shadow-md"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Integrated Zodiac Viewer */}
        <ZodiacHoroscopeView />
      </div>
    </section>
  );
};

export const ZodiacHoroscopeView: React.FC = () => {
  const [selectedZodiac, setSelectedZodiac] = useState<Zodiac>(zodiacs[3]); // Default Cancer

  return (
    <div className="bg-[#0B0805] text-white pt-4 font-sans space-y-8">
      {/* 1. Zodiac Selection Horizontal List */}
      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
        {zodiacs.map((zodiac) => {
          const isSelected = selectedZodiac.id === zodiac.id;
          return (
            <button
              key={zodiac.id}
              onClick={() => setSelectedZodiac(zodiac)}
              className={`flex flex-col items-center justify-center min-w-21.25 py-3.5 px-2 rounded-2xl border transition-all duration-300 shrink-0 ${
                isSelected
                  ? "bg-[#FFEFA3] text-black border-[#FFEFA3] shadow-lg shadow-yellow-500/10 scale-105 font-medium"
                  : "bg-[#140E0A] text-gray-300 border-[#261C14] hover:border-[#422F20]"
              }`}
            >
              <img
                src={zodiac.icon}
                alt={zodiac.name}
                className="w-10 h-10 rounded-full object-cover mb-2 border border-black/10"
              />
              <span className="text-xs font-semibold leading-tight">
                {zodiac.name}
              </span>
              <span
                className={`text-[10px] ${
                  isSelected ? "text-gray-700" : "text-gray-500"
                }`}
              >
                {zodiac.hindiName}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Horoscope Details Card */}
      <div className="bg-[#150F0B] border border-[#2B1F16] rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
        {/* Date Tag */}
        <div className="absolute top-6 right-6">
          <span className="bg-[#241A12] border border-[#3A2C20] text-gray-300 text-[11px] px-3 py-1 rounded-full">
            Today · 27 Jul 2026
          </span>
        </div>

        {/* Selected Zodiac Header */}
        <div className="flex items-center space-x-3 mb-6">
          <img
            src={selectedZodiac.icon}
            alt={selectedZodiac.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-[#EAD170]"
          />
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              {selectedZodiac.name}
              <span className="text-sm font-normal text-gray-400">
                {selectedZodiac.hindiName}
              </span>
            </h3>
            <p className="text-xs text-gray-400">{selectedZodiac.dates}</p>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & Attributes */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              {selectedZodiac.name}, you are a trusted confidant because of your
              compassion, but make sure your voice is heard as well. Your energy
              and perspective are positively impacted by your ability to..
            </p>

            {/* Quick Meta Stats */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center space-x-1">
                <span className="text-gray-400">Mood:</span>
                <span className="text-white font-medium">😍 Romantic</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-gray-400">Lucky #:</span>
                <span className="text-amber-400 font-bold">2</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-gray-400">Color:</span>
                <span className="w-6 h-3 rounded bg-emerald-400 inline-block"></span>
              </div>
            </div>
          </div>

          {/* Right Progress Indicators Box */}
          <div className="lg:col-span-5 bg-[#1C140E] border border-[#2E2016] rounded-2xl p-5 space-y-4">
            {/* Love */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-400">LOVE</span>
                <span className="text-white">Good</span>
              </div>
              <div className="w-full bg-[#2B1F16] h-1.5 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full w-[78%] rounded-full"></div>
              </div>
            </div>

            {/* Career */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-400">CAREER</span>
                <span className="text-white">High</span>
              </div>
              <div className="w-full bg-[#2B1F16] h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full w-[90%] rounded-full"></div>
              </div>
            </div>

            {/* Health */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-400">HEALTH</span>
                <span className="text-white">Slow</span>
              </div>
              <div className="w-full bg-[#2B1F16] h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-[25%] rounded-full"></div>
              </div>
            </div>

            {/* Money */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-400">MONEY</span>
                <span className="text-white">Strong</span>
              </div>
              <div className="w-full bg-[#2B1F16] h-1.5 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full w-[85%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoroscopeSection;
