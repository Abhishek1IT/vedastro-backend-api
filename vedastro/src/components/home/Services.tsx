import React from 'react';
import {
  Heart,
  Infinity as LoopIcon,
  Briefcase,
  User,
  TrendingUp,
  HeartHandshake,
  ArrowUpRight
} from 'lucide-react';

interface Category {
  id: number;
  title: string;
  count: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  arrowBg: string;
  arrowColor: string;
}

const categories: Category[] = [
  {
    id: 1,
    title: "Love",
    count: "4,280+ astrologers",
    icon: <Heart className="w-4 h-4" />,
    iconBg: "bg-pink-950/60 border-pink-800/40",
    iconColor: "text-pink-400",
    arrowBg: "bg-pink-950/40 group-hover:bg-pink-900/60",
    arrowColor: "text-pink-400"
  },
  {
    id: 2,
    title: "Marriage & Kundli",
    count: "6,120+ astrologers",
    icon: <LoopIcon className="w-4 h-4" />,
    iconBg: "bg-amber-950/60 border-amber-800/40",
    iconColor: "text-amber-400",
    arrowBg: "bg-amber-950/40 group-hover:bg-amber-900/60",
    arrowColor: "text-amber-400"
  },
  {
    id: 3,
    title: "Career",
    count: "5,840+ astrologers",
    icon: <Briefcase className="w-4 h-4" />,
    iconBg: "bg-emerald-950/60 border-emerald-800/40",
    iconColor: "text-emerald-400",
    arrowBg: "bg-emerald-950/40 group-hover:bg-emerald-900/60",
    arrowColor: "text-emerald-400"
  },
  {
    id: 4,
    title: "Women astrologers",
    count: "9,210+ astrologers",
    icon: <User className="w-4 h-4" />,
    iconBg: "bg-purple-950/60 border-purple-800/40",
    iconColor: "text-purple-400",
    arrowBg: "bg-purple-950/40 group-hover:bg-purple-900/60",
    arrowColor: "text-purple-400"
  },
  {
    id: 5,
    title: "Business & Money",
    count: "3,760+ astrologers",
    icon: <TrendingUp className="w-4 h-4" />,
    iconBg: "bg-cyan-950/60 border-cyan-800/40",
    iconColor: "text-cyan-400",
    arrowBg: "bg-cyan-950/40 group-hover:bg-cyan-900/60",
    arrowColor: "text-cyan-400"
  },
  {
    id: 6,
    title: "Health & Family",
    count: "2,480+ astrologers",
    icon: <HeartHandshake className="w-4 h-4" />,
    iconBg: "bg-red-950/60 border-red-800/40",
    iconColor: "text-red-400",
    arrowBg: "bg-red-950/40 group-hover:bg-red-900/60",
    arrowColor: "text-red-400"
  }
];

export const Services: React.FC = () => {
  return (
    <section className="bg-[#0B0805] text-white py-16 px-6 md:px-12 font-sans border-t border-[#1C1610] relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[#B57E43] text-xs font-semibold tracking-[0.2em] uppercase">
              BROWSE BY CATEGORY
            </span>
            <h2 className="text-4xl md:text-6xl font-light tracking-tight leading-tight">
              Find the right <br />
              astrologer, <span className="text-[#C88029] font-normal">for You</span>
            </h2>
          </div>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="group bg-[#130E0A]/80 border border-[#231A12] hover:border-[#3D2C1E] rounded-2xl p-6 flex flex-col justify-between h-40 transition-all duration-300 hover:scale-[1.01] cursor-pointer relative overflow-hidden backdrop-blur-sm"
            >
              {/* Category Icon */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${cat.iconBg} ${cat.iconColor}`}>
                {cat.icon}
              </div>

              {/* Text Info and Action Button */}
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-amber-200 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {cat.count}
                  </p>
                </div>

                {/* Arrow Icon Button */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${cat.arrowBg} ${cat.arrowColor}`}>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Services;