import React from "react";
import { newsroomAds } from "../../data/mock";
import { Link } from "react-router-dom";
import { ArrowRight, Megaphone } from "lucide-react";

const toneClass = {
  navy: "bg-[#0b2c4a] text-white",
  blue: "bg-[#009EDB] text-white",
  light: "bg-[#f4f7fa] text-[#0b2c4a]"
};
const toneEyebrow = {
  navy: "text-[#7cc3ef]",
  blue: "text-white/80",
  light: "text-[#009EDB]"
};
const toneCta = {
  navy: "bg-[#009EDB] hover:bg-[#0086b8] text-white",
  blue: "bg-white hover:bg-[#0b2c4a] hover:text-white text-[#0b2c4a]",
  light: "bg-[#0b2c4a] hover:bg-[#061a2c] text-white"
};

const Card = ({ ad }) => {
  const Inner = (
    <article className={`group relative h-full flex flex-col ${toneClass[ad.tone] || toneClass.navy} overflow-hidden`}>
      <div className="relative h-40 overflow-hidden">
        <img src={ad.image} alt={ad.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-current/30 to-transparent mix-blend-multiply" />
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className={`flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase font-semibold ${toneEyebrow[ad.tone] || toneEyebrow.navy}`}>
          <Megaphone className="w-3.5 h-3.5" /> {ad.eyebrow}
        </div>
        <h3 className="font-serif text-[22px] mt-3 leading-tight">{ad.title}</h3>
        <p className={`mt-3 text-[14px] leading-relaxed flex-1 ${ad.tone === "light" ? "text-slate-700" : "text-white/85"}`}>{ad.body}</p>
        <span className={`mt-5 inline-flex items-center gap-2 self-start px-4 py-2 text-[13px] font-semibold ${toneCta[ad.tone] || toneCta.navy}`}>
          {ad.cta} <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </article>
  );
  return ad.href.startsWith("/") && !ad.href.startsWith("/#")
    ? <Link to={ad.href} className="block h-full">{Inner}</Link>
    : <a href={ad.href} className="block h-full">{Inner}</a>;
};

const NewsroomAds = () => {
  return (
    <section className="bg-white">
      <div className="max-w-[1400px] mx-auto px-6 -mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsroomAds.map((ad) => (
            <Card key={ad.id} ad={ad} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsroomAds;
