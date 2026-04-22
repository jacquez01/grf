import React from "react";
import { stats } from "../../data/mock";

const StatsBand = () => {
  return (
    <section className="bg-[#f4f7fa] border-y border-slate-200">
      <div className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="text-center md:text-left">
            <div className="font-serif text-4xl md:text-5xl text-[#0b2c4a] font-semibold">{s.value}</div>
            <div className="mt-1 text-[12px] tracking-[0.22em] uppercase text-[#009EDB] font-semibold">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsBand;
