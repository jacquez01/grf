import React, { useState } from "react";
import { Send, Building2, Globe2, Landmark } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";

const bullets = [
  { icon: Landmark, title: "Heritage & Museum Practice", text: "State-of-the-art galleries, provenance research labs and rotating exhibits from four continents." },
  { icon: Globe2, title: "Intercultural Dialogue", text: "Artist residencies, fellowships, and public convenings for scholars and diaspora communities." },
  { icon: Building2, title: "Civic & Community Hub", text: "A public square for festivals, youth programs and policy roundtables in the heart of the capital." }
];

const ProposalSection = () => {
  const [form, setForm] = useState({ org: "", name: "", email: "", message: "" });

  const submit = (e) => {
    e.preventDefault();
    if (!form.org || !form.name || !form.email) {
      toast.error("Please complete organization, name and email.");
      return;
    }
    try {
      const saved = JSON.parse(localStorage.getItem("agrf_proposals") || "[]");
      saved.push({ ...form, at: new Date().toISOString() });
      localStorage.setItem("agrf_proposals", JSON.stringify(saved));
    } catch { /* noop */ }
    toast.success("Thank you. Our partnerships team will be in touch.");
    setForm({ org: "", name: "", email: "", message: "" });
  };

  return (
    <section id="proposal" className="relative bg-white">
      <div className="bg-[#0b2c4a] text-white">
        <div className="max-w-[1400px] mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-6">
            <div className="text-[11px] tracking-[0.25em] uppercase text-[#7cc3ef] font-semibold">Partnership Proposal — Open Call</div>
            <h2 className="font-serif text-3xl md:text-5xl mt-3 leading-[1.1]">Build the World Heritage Cultural Center with us</h2>
            <p className="mt-5 text-white/85 text-[17px] leading-[1.75] max-w-xl">
              AGRF is inviting governments, foundations, universities and private partners to co-found a landmark World Heritage Cultural Center — a transatlantic home for cultural diplomacy, provenance research, community practice and intercultural dialogue.
            </p>
            <ul className="mt-8 space-y-5">
              {bullets.map((b) => (
                <li key={b.title} className="flex gap-4">
                  <div className="w-11 h-11 border border-white/30 flex items-center justify-center shrink-0">
                    <b.icon className="w-5 h-5 text-[#7cc3ef]" />
                  </div>
                  <div>
                    <div className="font-serif text-lg">{b.title}</div>
                    <div className="text-white/75 text-sm mt-1">{b.text}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-6">
            <form onSubmit={submit} className="bg-white text-[#0b2c4a] p-8 md:p-10">
              <div className="text-[11px] tracking-[0.25em] uppercase text-[#009EDB] font-semibold">Express Interest</div>
              <div className="font-serif text-2xl mt-2">Submit a partnership inquiry</div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-[12px] tracking-wide uppercase text-slate-500">Organization</label>
                  <Input value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} placeholder="Your organization" className="rounded-none border-slate-300 focus-visible:ring-[#009EDB] mt-1" />
                </div>
                <div>
                  <label className="text-[12px] tracking-wide uppercase text-slate-500">Full Name</label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="rounded-none border-slate-300 focus-visible:ring-[#009EDB] mt-1" />
                </div>
                <div>
                  <label className="text-[12px] tracking-wide uppercase text-slate-500">Email</label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@org.com" className="rounded-none border-slate-300 focus-visible:ring-[#009EDB] mt-1" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[12px] tracking-wide uppercase text-slate-500">How would you like to partner?</label>
                  <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your interest, scope, and any questions..." className="rounded-none border-slate-300 focus-visible:ring-[#009EDB] mt-1 min-h-[120px]" />
                </div>
              </div>
              <Button type="submit" className="mt-6 rounded-none bg-[#009EDB] hover:bg-[#0086b8] text-white h-12 px-6 font-semibold">
                <Send className="w-4 h-4 mr-2" /> Submit Inquiry
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProposalSection;
