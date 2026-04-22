import React from "react";
import { partners, europeanPartnerships } from "../../data/mock";
import { ExternalLink, GraduationCap, Globe2 } from "lucide-react";

const Partners = () => {
  return (
    <section id="partners" className="bg-[#f4f7fa] py-20">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-[11px] tracking-[0.25em] uppercase text-[#009EDB] font-semibold">Our Partners</div>
            <h2 className="font-serif text-3xl md:text-5xl text-[#0b2c4a] mt-2 max-w-2xl">Institutions, governments and communities we walk with</h2>
          </div>
        </div>

        {/* Academic partner spotlight */}
        <div id="academic" className="bg-white border border-slate-200 mb-10 grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-4 bg-[#0b2c4a] text-white p-8 flex flex-col justify-between">
            <div>
              <GraduationCap className="w-8 h-8 text-[#7cc3ef]" />
              <div className="mt-3 text-[11px] tracking-[0.22em] uppercase font-semibold text-[#7cc3ef]">Academic Department</div>
              <h3 className="font-serif text-2xl mt-2 leading-tight">America Global Citizen College</h3>
            </div>
            <a href="https://www.agccollege.org" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-[#7cc3ef] hover:text-white">
              www.agccollege.org <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <div className="md:col-span-8 p-8">
            <p className="text-[#0b2c4a] font-serif text-2xl leading-snug">Our official academic department delivering AGRF's academic programs — from intercultural studies and diplomacy to sustainable development and community leadership.</p>
            <p className="mt-4 text-slate-600">America Global Citizen College anchors AGRF's pedagogy, research and credentialing for leaders across our four operating regions.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0 border-t border-l border-slate-200">
          {partners.map((p) => (
            <a key={p.name} href={p.url} target={p.url === "#" ? "_self" : "_blank"} rel="noreferrer" className="group bg-white border-r border-b border-slate-200 p-6 flex flex-col justify-between min-h-[160px] hover:bg-[#0b2c4a] hover:text-white transition-colors">
              <div className="text-[11px] tracking-[0.22em] uppercase text-[#009EDB] group-hover:text-[#7cc3ef] font-semibold">{p.note}</div>
              <div className="font-serif text-[17px] leading-tight mt-4">{p.name}</div>
            </a>
          ))}
        </div>

        {/* European Partnerships */}
        <div className="mt-10 bg-white border border-slate-200 p-7 md:p-9 flex flex-col md:flex-row gap-6 md:items-center">
          <div className="flex items-center gap-3 md:min-w-[260px]">
            <div className="w-11 h-11 bg-[#0b2c4a] text-white flex items-center justify-center shrink-0">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] tracking-[0.22em] uppercase text-[#009EDB] font-semibold">Present European Partnerships</div>
              <div className="font-serif text-xl text-[#0b2c4a] mt-0.5">Active in four nations</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 md:ml-auto">
            {europeanPartnerships.map((country) => (
              <span key={country} className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-[#0b2c4a] text-sm font-semibold hover:bg-[#0b2c4a] hover:text-white hover:border-[#0b2c4a] transition-colors cursor-default">
                {country}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
