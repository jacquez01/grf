import React from "react";
import { featuredPrograms, newsPosts, DONATION_URL } from "../../data/mock";
import { ArrowRight } from "lucide-react";
import { Progress } from "../ui/progress";

const Campaigns = () => {
  return (
    <section id="get-involved" className="bg-white py-20">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-[11px] tracking-[0.25em] uppercase text-[#009EDB] font-semibold">Campaigns & Projects</div>
            <h2 className="font-serif text-3xl md:text-5xl text-[#0b2c4a] mt-2 max-w-2xl">Support what moves you most</h2>
          </div>
          <a href={DONATION_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[#009EDB] font-semibold hover:gap-3 transition-all">Partner with us <ArrowRight className="w-4 h-4" /></a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPrograms.map((p) => {
            const pct = p.goal > 0 ? Math.round((p.raised / p.goal) * 100) : 0;
            return (
              <article key={p.id} className="group bg-white border border-slate-200 hover:shadow-lg transition-shadow flex flex-col">
                <div className="relative overflow-hidden">
                  <img src={p.image} alt={p.title} className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-3 left-3 bg-[#009EDB] text-white text-[10px] tracking-[0.22em] uppercase px-2 py-1 font-semibold">{p.tag}</div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-serif text-lg text-[#0b2c4a] leading-tight group-hover:text-[#009EDB]">{p.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 flex-1">{p.excerpt}</p>
                  {p.goal > 0 ? (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Raised <span className="text-[#0b2c4a] font-semibold">${p.raised.toLocaleString()}</span></span>
                        <span>Goal ${p.goal.toLocaleString()}</span>
                      </div>
                      <Progress value={pct} className="mt-2 h-1.5 bg-slate-200 [&>div]:bg-[#009EDB]" />
                      <div className="mt-2 text-[11px] tracking-wide uppercase text-slate-400">Ends {p.end} · {pct}% raised</div>
                    </div>
                  ) : (
                    <div className="mt-4 text-[11px] tracking-wide uppercase text-slate-400">Status: {p.end}</div>
                  )}
                  <a href={DONATION_URL} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-[#009EDB] font-semibold text-sm hover:gap-3 transition-all">Partner on this <ArrowRight className="w-4 h-4" /></a>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* News posts */}
      <div id="news" className="max-w-[1400px] mx-auto px-6 mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-[11px] tracking-[0.25em] uppercase text-[#009EDB] font-semibold">News & Stories</div>
            <h2 className="font-serif text-3xl md:text-5xl text-[#0b2c4a] mt-2 max-w-2xl">The work, in context</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsPosts.map((n) => (
            <article key={n.id} className="group">
              <div className="overflow-hidden">
                <img src={n.image} alt={n.title} className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="mt-4 text-[11px] tracking-[0.22em] uppercase text-[#009EDB] font-semibold">{n.category} · {n.date}</div>
              <h3 className="font-serif text-2xl text-[#0b2c4a] mt-2 leading-tight group-hover:text-[#009EDB] transition-colors">{n.title}</h3>
              <p className="mt-2 text-slate-600">{n.excerpt}</p>
              <a href="#" className="mt-3 inline-flex items-center gap-2 text-[#009EDB] font-semibold hover:gap-3 transition-all">Read story <ArrowRight className="w-4 h-4" /></a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Campaigns;
