import React, { useState } from "react";
import { whatWeDo } from "../../data/mock";
import { ArrowRight } from "lucide-react";

const WhatWeDo = () => {
  const [active, setActive] = useState(whatWeDo[0].id);
  const current = whatWeDo.find((w) => w.id === active);

  return (
    <section id="what-we-do" className="bg-[#f4f7fa] py-20">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-[11px] tracking-[0.25em] uppercase text-[#009EDB] font-semibold">What We Do</div>
            <h2 className="font-serif text-3xl md:text-5xl text-[#0b2c4a] mt-2 max-w-2xl">Six pathways to global impact</h2>
          </div>
          <p className="max-w-md text-slate-600">From cultural diplomacy to emergency crisis response, our programs translate values into measurable action across four regions.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-4">
            <ul className="divide-y divide-slate-200 border-t border-b border-slate-200 bg-white">
              {whatWeDo.map((w, i) => (
                <li key={w.id}>
                  <button
                    onClick={() => setActive(w.id)}
                    className={`w-full text-left px-5 py-4 flex items-center justify-between gap-3 group ${active === w.id ? "bg-[#0b2c4a] text-white" : "hover:bg-slate-50 text-[#0b2c4a]"}`}
                  >
                    <span className="flex items-start gap-3">
                      <span className={`text-[11px] font-semibold pt-1 ${active === w.id ? "text-[#7cc3ef]" : "text-[#009EDB]"}`}>{String(i + 1).padStart(2, "0")}</span>
                      <span>
                        <span className="block font-serif text-lg leading-tight">{w.title}</span>
                        <span className={`block text-[12px] mt-1 ${active === w.id ? "text-white/80" : "text-slate-500"}`}>{w.short}</span>
                      </span>
                    </span>
                    <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${active === w.id ? "translate-x-0" : "-translate-x-1 opacity-50 group-hover:translate-x-0 group-hover:opacity-100"}`} />
                  </button>
                </li>
              ))}
            </ul>
          </aside>
          <div className="lg:col-span-8">
            <div className="bg-white border border-slate-200">
              <div className="relative h-[320px] md:h-[380px] overflow-hidden">
                <img src={current.image} alt={current.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-[#009EDB] text-white px-3 py-1 text-[11px] tracking-[0.22em] uppercase font-semibold">Focus Area</div>
              </div>
              <div className="p-7 md:p-10">
                <h3 className="font-serif text-3xl text-[#0b2c4a]">{current.title}</h3>
                <p className="mt-4 text-[17px] leading-[1.75] text-slate-700">{current.body}</p>
                <a href="#programs" className="mt-6 inline-flex items-center gap-2 text-[#009EDB] font-semibold hover:gap-3 transition-all">
                  Explore related programs <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
