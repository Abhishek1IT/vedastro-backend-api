import React, { useState } from "react";
import { Plus, X } from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "Why Is Astrology So Accurate?",
    answer:
      "Astrology accuracy comes from thousands of years of careful observation linking planetary movements to human experiences. Experienced astrologers study birth charts that map cosmic influences at your exact birth moment, providing personalized insights rather than generic predictions for everyone.",
  },
  {
    id: 2,
    question: "Why Should You Choose Astrotalk For An Astrology Horoscope?",
    answer:
      "Astrotalk connects you with verified, experienced astrologers available 24/7. Get accurate predictions, private consultations, and instant solutions for love, career, and life questions with complete privacy.",
  },
  {
    id: 3,
    question: "Is Astrology Prediction True?",
    answer:
      "Astrology provides guidance based on planetary positions and cosmic movements. While it doesn't dictate fate with 100% certainty, it gives deep insights and probability models to help you make informed decisions.",
  },
  {
    id: 4,
    question: "How Can Online Astrology Help Me In Predicting The Future?",
    answer:
      "Online astrology offers real-time access to top astrologers without location barriers. You can analyze birth charts, transit movements, and dasha cycles instantly to get clarity on future timeline events.",
  },
  {
    id: 5,
    question: "How reliable is the Astrotalk app?",
    answer:
      "Astrotalk uses end-to-end encryption for all personal details and chat history. With millions of satisfied users and strict astrologer verification processes, it ensures total reliability and privacy.",
  },
  {
    id: 6,
    question: "How much does Astrotalk cost?",
    answer:
      "Pricing varies per astrologer, starting as low as ₹5 to ₹15 per minute. New users often get special promotional offers, free first recharge bonuses, and introductory discounts.",
  },
];

const FAQ: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleAccordion = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="bg-[#0D0905] text-white py-20 px-6 md:px-16 font-sans border-t border-[#1C1610]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Side: Heading */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-[#B57E43] text-xs font-semibold tracking-[0.2em] uppercase">
            QUESTIONS, ANSWERED
          </span>
          <h2 className="text-4xl md:text-6xl font-light leading-[1.1] tracking-tight">
            First time? <br />
            <span className="text-[#C88029] font-normal">Read</span> these{" "}
            <br />
            first.
          </h2>
        </div>

        {/* Right Side: Accordion List */}
        <div className="lg:col-span-7 divide-y divide-[#261E17]">
          {faqData.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="py-6 transition-all duration-300">
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full flex justify-between items-center text-left gap-4 group focus:outline-none"
                >
                  <span className="text-base md:text-lg font-medium text-gray-200 group-hover:text-white transition-colors">
                    {item.question}
                  </span>

                  {/* Action Icon Toggle */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen
                        ? "bg-[#D9851B] text-black"
                        : "bg-[#1C150E] border border-[#2E241B] text-gray-400 group-hover:border-gray-500 group-hover:text-white"
                    }`}
                  >
                    {isOpen ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {/* Collapsible Answer */}
                {isOpen && (
                  <p className="mt-4 text-gray-400 text-sm md:text-base leading-relaxed pr-8 animate-fadeIn">
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
