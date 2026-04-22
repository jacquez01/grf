import React from "react";
import { featuredPillars } from "../../data/mock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { HeartHandshake, Briefcase, Home, Users, Check } from "lucide-react";

const iconMap = { HeartHandshake, Briefcase, Home, Users };

const FeaturedPrograms = () => {
  return (
    <section id="programs" className="bg-white py-20">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-[11px] tracking-[0.25em] uppercase text-[#009EDB] font-semibold">Featured Programs</div>
            <h2 className="font-serif text-3xl md:text-5xl text-[#0b2c4a] mt-2 max-w-3xl">Four pillars powering our work in the United States</h2>
          </div>
        </div>

        <Tabs defaultValue={featuredPillars[0].id} className="w-full">
          <TabsList className="w-full h-auto flex flex-col md:flex-row gap-0 p-0 bg-transparent border-b border-slate-200">
            {featuredPillars.map((p) => {
              const Icon = iconMap[p.icon];
              return (
                <TabsTrigger
                  key={p.id}
                  value={p.id}
                  className="flex-1 justify-start gap-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[#009EDB] data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:text-[#009EDB] py-5 px-5 text-left whitespace-normal"
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="font-serif text-[15px] md:text-[17px] font-semibold leading-tight">{p.title}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {featuredPillars.map((p) => (
            <TabsContent key={p.id} value={p.id} className="mt-10">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                <div className="md:col-span-5">
                  <div className="relative">
                    <img src={p.image} alt={p.title} className="w-full aspect-[4/3] object-cover" />
                    <div className="absolute -bottom-3 left-0 h-1.5 w-28" style={{ background: p.color }} />
                  </div>
                </div>
                <div className="md:col-span-7">
                  <div className="text-[11px] tracking-[0.22em] uppercase font-semibold" style={{ color: p.color }}>Pillar</div>
                  <h3 className="font-serif text-3xl md:text-4xl text-[#0b2c4a] mt-2">{p.title}</h3>
                  <p className="mt-4 text-[17px] leading-[1.75] text-slate-700">{p.summary}</p>
                  <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {p.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-slate-700">
                        <span className="mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: p.color }}>
                          <Check className="w-3 h-3 text-white" />
                        </span>
                        <span className="text-[15px]">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default FeaturedPrograms;
