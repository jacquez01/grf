import React from "react";
import { filmMedia } from "../../data/mock";
import { Film, PlayCircle, Check } from "lucide-react";

const FilmMedia = () => {
  const f = filmMedia;
  return (
    <section id="film-media" className="bg-[#0b2c4a] text-white py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{
        backgroundImage:
          "radial-gradient(circle at 20% 20%, #7cc3ef 0, transparent 40%), radial-gradient(circle at 80% 60%, #009EDB 0, transparent 40%)"
      }} />
      <div className="relative max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-[#7cc3ef] font-semibold">
              <Film className="w-4 h-4" /> {f.eyebrow}
            </div>
            <h2 className="font-serif text-3xl md:text-5xl mt-3 max-w-3xl leading-[1.1]">{f.title}</h2>
          </div>
          <p className="max-w-md text-white/80">{f.lead}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7">
            <p className="text-[17px] leading-[1.75] text-white/85">{f.body}</p>
            <div className="mt-8 border-l-2 border-[#009EDB] pl-5">
              <div className="text-[11px] tracking-[0.22em] uppercase text-[#7cc3ef] font-semibold">{f.focusHeading}</div>
              <ul className="mt-4 space-y-3">
                {f.focusItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/90">
                    <span className="mt-1 w-5 h-5 rounded-full bg-[#009EDB] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </span>
                    <span className="text-[15px]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-8 text-[16px] leading-[1.75] text-white/80">{f.closing}</p>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white text-[#0b2c4a] border border-white/10 overflow-hidden">
              <div className="relative aspect-[4/3] overflow-hidden group">
                <img src={f.featured.image} alt={f.featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b2c4a]/80 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#009EDB]/90 text-white flex items-center justify-center ring-4 ring-white/20 group-hover:bg-[#009EDB] transition-colors">
                    <PlayCircle className="w-8 h-8" />
                  </div>
                </div>
                <div className="absolute top-3 left-3 bg-[#009EDB] text-white text-[10px] tracking-[0.22em] uppercase px-2 py-1 font-semibold">
                  {f.featured.label}
                </div>
              </div>
              <div className="p-6">
                <div className="text-[11px] tracking-[0.22em] uppercase text-[#009EDB] font-semibold">First Production</div>
                <h3 className="font-serif text-2xl mt-2 leading-tight">{f.featured.title}</h3>
                <div className="mt-1 text-sm text-slate-500">{f.featured.meta}</div>
                <p className="mt-3 text-slate-700 text-[15px] leading-relaxed">{f.featured.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FilmMedia;
