import React from "react";
import { executiveBoard } from "../../data/mock";
import { Linkedin, Mail } from "lucide-react";

const ExecutiveBoard = () => {
  return (
    <section id="leadership" className="bg-[#0b2c4a] py-20 text-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-[11px] tracking-[0.25em] uppercase text-[#7cc3ef] font-semibold">Leadership</div>
            <h2 className="font-serif text-3xl md:text-5xl mt-2 max-w-2xl">Executive Board</h2>
          </div>
          <p className="max-w-md text-white/80">Our executive board brings together practitioners across policy, cultural diplomacy, community development and international affairs.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-0 border-l border-white/10">
          {executiveBoard.map((m) => (
            <div key={m.id} className="group relative border-r border-b border-t border-white/10 hover:bg-white/5 transition-colors">
              <div className="aspect-[3/4] overflow-hidden">
                <img src={m.image} alt={m.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
              </div>
              <div className="p-5">
                <div className="text-[11px] tracking-[0.22em] uppercase text-[#7cc3ef] font-semibold">{m.region}</div>
                <div className="font-serif text-xl mt-1">{m.name}</div>
                <div className="text-sm text-white/75 mt-1">{m.title}</div>
                <div className="mt-4 flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                  <a href={m.linkedin} target={m.linkedin === "#" ? "_self" : "_blank"} rel="noreferrer" aria-label={`${m.name} on LinkedIn`} className="w-8 h-8 border border-white/30 hover:bg-[#009EDB] hover:border-[#009EDB] flex items-center justify-center"><Linkedin className="w-3.5 h-3.5" /></a>
                  <a href={`mailto:${m.email}`} aria-label={`Email ${m.name}`} className="w-8 h-8 border border-white/30 hover:bg-[#009EDB] hover:border-[#009EDB] flex items-center justify-center"><Mail className="w-3.5 h-3.5" /></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExecutiveBoard;
