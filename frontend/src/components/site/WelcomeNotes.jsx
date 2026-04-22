import React, { useState } from "react";
import { welcomeNotes } from "../../data/mock";
import { Quote } from "lucide-react";

const WelcomeNotes = () => {
  const [active, setActive] = useState(welcomeNotes[0].id);
  const note = welcomeNotes.find((n) => n.id === active);

  return (
    <section id="about" className="bg-white py-20">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-[11px] tracking-[0.25em] uppercase text-[#009EDB] font-semibold">Welcome</div>
            <h2 className="font-serif text-3xl md:text-5xl text-[#0b2c4a] mt-2 max-w-2xl">Messages from our leadership</h2>
          </div>
          <div className="flex gap-1">
            {welcomeNotes.map((n) => (
              <button
                key={n.id}
                onClick={() => setActive(n.id)}
                className={`px-5 py-3 text-[13px] font-semibold tracking-wide uppercase border ${active === n.id ? "bg-[#0b2c4a] text-white border-[#0b2c4a]" : "bg-white text-[#0b2c4a] border-slate-300 hover:border-[#0b2c4a]"}`}
              >
                {n.role}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <div className="relative">
              <img src={note.image} alt={note.name} className="w-full aspect-[4/5] object-cover" />
              <div className="absolute -bottom-4 left-4 right-4 bg-[#009EDB] text-white p-5">
                <div className="text-[11px] tracking-[0.22em] uppercase font-semibold opacity-90">{note.role}</div>
                <div className="font-serif text-2xl mt-1">{note.name}</div>
                <div className="text-[12px] mt-1 opacity-90">{note.org}</div>
              </div>
            </div>
          </div>
          <div className="md:col-span-8">
            <Quote className="w-10 h-10 text-[#009EDB]" />
            <div className="mt-4 space-y-5 text-[16px] leading-[1.75] text-slate-700">
              {note.message.map((p, i) => (
                <p key={i} className={i === 0 ? "text-[18px] text-[#0b2c4a] font-medium leading-[1.7]" : ""}>{p}</p>
              ))}
            </div>
            <div className="mt-8 border-t border-slate-200 pt-5 text-sm text-slate-500">
              Signed, <span className="text-[#0b2c4a] font-semibold">{note.name}</span> — {note.role}, {note.org}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeNotes;
