import React, { useState } from "react";
import { whereWeWork } from "../../data/mock";
import { MapPin, ArrowRight } from "lucide-react";

const WhereWeWork = () => {
  const [active, setActive] = useState(0);
  const cur = whereWeWork[active];
  return (
    <section id="where-we-work" className="bg-white py-20">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-[11px] tracking-[0.25em] uppercase text-[#009EDB] font-semibold">Where We Work</div>
            <h2 className="font-serif text-3xl md:text-5xl text-[#0b2c4a] mt-2 max-w-2xl">Four regions, one mission</h2>
          </div>
          <p className="max-w-md text-slate-600">We operate across the United States, Canada, Europe and Africa — with a present focus on the USA, Europe and Africa.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 border border-slate-200">
          <div className="md:col-span-5 bg-[#f4f7fa]">
            <ul>
              {whereWeWork.map((w, i) => (
                <li key={w.region}>
                  <button
                    onClick={() => setActive(i)}
                    className={`w-full flex items-center justify-between px-6 py-5 border-b border-slate-200 text-left ${active === i ? "bg-[#0b2c4a] text-white" : "hover:bg-white text-[#0b2c4a]"}`}
                  >
                    <span className="flex items-center gap-3">
                      <MapPin className={`w-4 h-4 ${active === i ? "text-[#7cc3ef]" : "text-[#009EDB]"}`} />
                      <span className="font-serif text-xl">{w.region}</span>
                    </span>
                    <ArrowRight className="w-4 h-4 opacity-70" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-7 relative">
            <img src={cur.image} alt={cur.region} className="w-full h-full min-h-[360px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b2c4a]/90 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="text-[11px] tracking-[0.22em] uppercase text-[#7cc3ef] font-semibold">Region</div>
              <div className="font-serif text-3xl md:text-4xl mt-1">{cur.region}</div>
              <p className="mt-3 text-white/90 max-w-xl">{cur.blurb}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhereWeWork;
