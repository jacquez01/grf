import React, { useState, useEffect } from "react";
import { heroSlides } from "../../data/mock";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const Hero = () => {
  const [idx, setIdx] = useState(0);
  const slide = heroSlides[idx];

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % heroSlides.length), 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="top" className="relative w-full bg-[#0b2c4a] overflow-hidden">
      <div className="relative h-[560px] md:h-[640px] w-full">
        {heroSlides.map((s, i) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === idx ? "opacity-100" : "opacity-0"}`}
          >
            <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b2c4a]/90 via-[#0b2c4a]/55 to-transparent" />
          </div>
        ))}

        <div className="relative max-w-[1400px] mx-auto h-full px-6 flex items-center">
          <div className="max-w-2xl text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#009EDB] text-[11px] tracking-[0.2em] uppercase font-semibold">
              {slide.eyebrow}
            </div>
            <h1 className="font-serif mt-6 text-[38px] md:text-[56px] leading-[1.05] font-semibold">
              {slide.title}
            </h1>
            <p className="mt-5 text-[17px] md:text-[19px] text-white/85 max-w-xl">
              {slide.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={slide.link} className="inline-flex items-center gap-2 bg-white text-[#0b2c4a] px-6 py-3 font-semibold hover:bg-[#009EDB] hover:text-white transition-colors">
                {slide.cta} <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#donate" className="inline-flex items-center gap-2 border border-white text-white px-6 py-3 font-semibold hover:bg-white hover:text-[#0b2c4a] transition-colors">
                Donate Now
              </a>
            </div>
          </div>
        </div>

        {/* caption + controls */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-[1400px] mx-auto px-6 pb-6 flex items-end justify-between">
            <div className="text-white/70 text-xs max-w-md hidden md:block">
              {`Photo ${idx + 1} of ${heroSlides.length} — Featured coverage from AGRF programs across the United States, Europe and Africa.`}
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button onClick={() => setIdx((idx - 1 + heroSlides.length) % heroSlides.length)} className="w-10 h-10 border border-white/40 text-white hover:bg-white hover:text-[#0b2c4a] flex items-center justify-center"><ChevronLeft className="w-5 h-5" /></button>
              <div className="text-white/80 text-sm mx-2">{String(idx + 1).padStart(2, "0")} / {String(heroSlides.length).padStart(2, "0")}</div>
              <button onClick={() => setIdx((idx + 1) % heroSlides.length)} className="w-10 h-10 border border-white/40 text-white hover:bg-white hover:text-[#0b2c4a] flex items-center justify-center"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* marquee strip */}
      <div className="bg-[#009EDB] text-white">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center gap-8 overflow-hidden">
          <span className="text-[11px] tracking-[0.25em] uppercase font-semibold whitespace-nowrap bg-white text-[#0b2c4a] px-2 py-1">Now</span>
          <div className="flex items-center gap-10 whitespace-nowrap text-sm animate-[marquee_28s_linear_infinite]">
            <span>Open Call — Partnership to build the World Heritage Cultural Center</span>
            <span className="opacity-50">/</span>
            <span>Biodiversity & Green Energy pilots launching in Africa</span>
            <span className="opacity-50">/</span>
            <span>Clean Water Initiative — Africa now accepting donations</span>
            <span className="opacity-50">/</span>
            <span>Youth Apprenticeship program expanding to Canada</span>
          </div>
        </div>
      </div>

      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </section>
  );
};

export default Hero;
