/* eslint-disable @next/next/no-img-element */

import React from 'react';
import { MessageSquare, ShieldCheck, PhoneCall, ChevronLeft, Send } from 'lucide-react';

const DownloadApp = () => {
  return (
    <section className="bg-[#120E0B] text-white py-16 px-4 md:px-12 relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Text Content */}
        <div className="space-y-6 z-10">
          <span className="text-[#E2C388] text-xs font-semibold tracking-widest uppercase">
            THE Vedastro APP
          </span>

          <h2 className="text-3xl md:text-5xl font-light leading-tight">
            Astrology made simpler, <br />
            and available to you <span className="text-[#E2C388] font-semibold">24×7.</span>
          </h2>

          <p className="text-gray-400 text-sm md:text-base max-w-lg leading-relaxed">
            Connect with an astrologer anytime, and find the solutions to all
            your love, marriage, career, and finance related problems instantly.
          </p>

          {/* Features List */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-lg bg-[#241E18] border border-[#3A3026] flex items-center justify-center text-[#E2C388]">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-gray-300 text-sm">
                Instant chats, notifications, and alerts
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-lg bg-[#241E18] border border-[#3A3026] flex items-center justify-center text-[#E2C388]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-gray-300 text-sm">
                Secure payments, UPI, cards & wallet, all encrypted
              </span>
            </div>
          </div>

          {/* App Store Buttons */}
          <div className="flex flex-wrap gap-4 pt-6">
            <a href="#" className="inline-block transition-transform hover:scale-105">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                alt="Download on App Store"
                className="h-12"
              />
            </a>
            <a href="#" className="inline-block transition-transform hover:scale-105">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                className="h-12"
              />
            </a>
          </div>
        </div>

        {/* Right Side: Phone UI Mockup */}
        <div className="flex justify-center z-10">
          <div className="w-[320px] sm:w-90 bg-black border-[6px] border-[#3A3026] rounded-[40px] p-3 shadow-2xl relative">
            {/* Phone Screen */}
            <div className="bg-[#FFFDF6] text-black rounded-4xl overflow-hidden flex flex-col h-150 text-xs">
              
              {/* Header */}
              <div className="p-3 border-b flex items-center justify-between bg-white pt-6">
                <div className="flex items-center space-x-2">
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80"
                      alt="Astro Seema"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold text-sm">Astro Seema</span>
                      <span className="text-blue-500 text-[10px]">✔</span>
                    </div>
                    <span className="text-[10px] text-gray-500">online</span>
                  </div>
                </div>
                <div className="w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center">
                  <PhoneCall className="w-3.5 h-3.5 text-black" />
                </div>
              </div>

              {/* Chat Body */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto bg-[#FBF9F4]">
                <div className="text-center text-[10px] text-gray-400 my-2">
                  Today · 9:38 AM
                </div>

                {/* Sent Message */}
                <div className="flex justify-end">
                  <div className="bg-[#FFF5B8] p-3 rounded-2xl rounded-tr-none max-w-[80%] text-gray-800 shadow-sm">
                    Seema ji, when will I get married? <br />
                    My family is asking.
                  </div>
                </div>

                {/* Received Message */}
                <div className="flex justify-start">
                  <div className="bg-white border p-3 rounded-2xl rounded-tl-none max-w-[80%] text-gray-800 shadow-sm">
                    Hi Priya ji. Share your date of birth & time first.
                  </div>
                </div>

                {/* Sent Message */}
                <div className="flex justify-end">
                  <div className="bg-[#FFF5B8] p-3 rounded-2xl rounded-tr-none max-w-[80%] text-gray-800 shadow-sm font-medium">
                    14 March 1998, 4:25 AM, Lucknow
                  </div>
                </div>

                {/* Typing Indicator */}
                <div className="flex justify-start">
                  <div className="bg-white border px-3 py-2 rounded-full text-gray-400 tracking-widest text-xs shadow-sm">
                    •••
                  </div>
                </div>
              </div>

              {/* Footer Input */}
              <div className="p-3 bg-white border-t flex items-center space-x-2">
                <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-gray-400 text-xs flex justify-between items-center">
                  <span>Type a message...</span>
                </div>
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black">
                  <Send className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default DownloadApp;