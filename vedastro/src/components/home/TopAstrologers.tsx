/* eslint-disable @next/next/no-img-element */

import React from 'react';
import { ArrowRight, Star, ChevronRight } from 'lucide-react';

interface Astrologer {
  id: number;
  name: string;
  image: string;
  badge?: 'TOP CHOICE' | 'CELEBRITY';
  skills: string[];
  languages: string;
  experience: string;
  rating: number;
  orders: string;
  price: number;
  isOnline: boolean;
}

const astrologersData: Astrologer[] = [
  {
    id: 1,
    name: 'AakankshaT',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    badge: 'TOP CHOICE',
    skills: ['Numerology', 'Tarot', 'Life Coach'],
    languages: 'English · Hindi · Punjabi',
    experience: '16 yrs exp',
    rating: 5.0,
    orders: '10k+ orders',
    price: 136,
    isOnline: true,
  },
  {
    id: 2,
    name: 'Viehana',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    badge: 'TOP CHOICE',
    skills: ['Tarot', 'Vedic', 'Numerology'],
    languages: 'English · Hindi',
    experience: '10 yrs exp',
    rating: 5.0,
    orders: '10k+ orders',
    price: 130,
    isOnline: true,
  },
  {
    id: 3,
    name: 'Aaradhya2',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    badge: 'CELEBRITY',
    skills: ['Vedic', 'Numerology', 'Prashana'],
    languages: 'English · Hindi',
    experience: '21 yrs exp',
    rating: 5.0,
    orders: '10k+ orders',
    price: 116,
    isOnline: true,
  },
  {
    id: 4,
    name: 'Ayukti',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    badge: 'CELEBRITY',
    skills: ['Numerology', 'Tarot', 'Life Coach'],
    languages: 'English · Hindi',
    experience: '5 yrs exp',
    rating: 5.0,
    orders: '10k+ orders',
    price: 43,
    isOnline: true,
  },
];

const TopAstrologers: React.FC = () => {
  return (
    <section className="bg-[#0B0805] text-white py-16 px-6 md:px-12 font-sans border-t border-[#1C1610] relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-light tracking-tight leading-tight">
              Talk to India&apos;s <span className="text-[#C88029] font-normal">Top</span> <br />
              <span className="text-[#C88029] font-normal">Rated</span> Astrologers
            </h2>
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
              Every astrologer below has cleared a <strong className="text-gray-200">4-step verification</strong> — qualification, panel interview, live audits, and a <strong className="text-gray-200">30-day probation</strong>.
            </p>
          </div>

          <button className="bg-[#EAD170] text-black font-semibold px-5 py-2.5 rounded-full text-xs flex items-center gap-2 hover:bg-yellow-400 transition-all self-start md:self-auto shrink-0 shadow-lg shadow-yellow-500/10">
            View all astrologers <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Astrologers Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {astrologersData.map((astro) => (
            <div
              key={astro.id}
              className="bg-[#120E0A] border border-[#231A12] hover:border-[#3D2C1E] rounded-2xl p-4 flex flex-col justify-between space-y-4 transition-all duration-300 hover:scale-[1.02] shadow-xl relative"
            >
              {/* Badge (TOP CHOICE / CELEBRITY) */}
              {astro.badge && (
                <span
                  className={`absolute top-4 right-4 text-[9px] font-bold tracking-wider px-2 py-0.5 rounded ${
                    astro.badge === 'TOP CHOICE'
                      ? 'bg-[#FFE2A3] text-[#523800]'
                      : 'bg-[#FFD1D8] text-[#630D1A]'
                  }`}
                >
                  {astro.badge}
                </span>
              )}

              {/* Profile Image & Basic Info */}
              <div className="flex items-center space-x-3">
                <div className="relative shrink-0">
                  <img
                    src={astro.image}
                    alt={astro.name}
                    className="w-12 h-12 rounded-full object-cover border border-green-500/50 p-0.5"
                  />
                  {astro.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#120E0A]"></span>
                  )}
                </div>

                <div className="overflow-hidden">
                  <div className="flex items-center space-x-1">
                    <h3 className="font-semibold text-sm truncate text-white">
                      {astro.name}
                    </h3>
                    <span className="text-blue-400 text-[10px]">✔</span>
                  </div>
                  <p className="text-[11px] text-gray-400 truncate">
                    {astro.experience} · {astro.languages.split(' · ')[0]}
                  </p>
                </div>
              </div>

              {/* Skill Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {astro.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-[#1C1610] text-gray-300 border border-[#2E2319] text-[10px] px-2.5 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Languages & Experience Details */}
              <div className="text-[11px] text-gray-400 space-y-0.5 border-t border-white/5 pt-2">
                <p>{astro.languages}</p>
                <p className="font-medium text-gray-300">{astro.experience}</p>
              </div>

              {/* Rating & Online Status */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center space-x-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                  <span className="font-bold text-white">{astro.rating.toFixed(1)}</span>
                  <span className="text-[10px] text-gray-400">· {astro.orders}</span>
                </div>
                <span className="text-green-500 text-[11px] font-medium">Online</span>
              </div>

              {/* Price & Free Chat Link */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <div className="text-lg font-bold text-white">
                  ₹{astro.price}<span className="text-xs font-normal text-gray-400">/min</span>
                </div>

                <button className="text-[#C88029] hover:text-yellow-400 text-xs font-semibold flex items-center gap-0.5 transition-colors">
                  First Chat Free <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TopAstrologers;