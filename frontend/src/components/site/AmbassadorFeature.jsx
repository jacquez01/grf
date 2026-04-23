import React, { useState } from "react";
import axios from "axios";
import { ambassadorFeature } from "../../data/mock";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";
import { Award, Send, Check, Mail } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const tracks = ["Public Diplomat", "Global Youth Voice Ambassador", "Nomination"];

const AmbassadorFeature = () => {
  const f = ambassadorFeature;
  const [form, setForm] = useState({ name: "", email: "", phone: "", country: "", track: "", nominee_name: "", message: "" });
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.track) {
      toast.error("Please provide your name, email and track.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/ambassador-application`, form);
      toast.success("Thank you. Our Public Diplomacy team will be in touch.");
      if (data?.mailto) window.open(data.mailto, "_blank");
      setForm({ name: "", email: "", phone: "", country: "", track: "", nominee_name: "", message: "" });
    } catch (err) {
      toast.error(err?.response?.data?.detail?.[0]?.msg || "Could not submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ambassador" className="relative bg-[#0b2c4a] text-white overflow-hidden">
      <div className="absolute inset-0">
        <img src={f.image} alt="Global ambassador" className="w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b2c4a] via-[#0b2c4a]/90 to-[#0b2c4a]/70" />
      </div>
      <div className="relative max-w-[1400px] mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-6">
          <div className="flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-[#7cc3ef] font-semibold">
            <Award className="w-4 h-4" /> {f.eyebrow}
          </div>
          <h2 className="font-serif text-3xl md:text-5xl mt-4 leading-[1.1]">{f.title}</h2>
          <p className="mt-6 text-[17px] leading-[1.8] text-white/85 max-w-xl">{f.body}</p>
          <ul className="mt-6 space-y-3">
            {f.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-white/90">
                <span className="mt-1 w-5 h-5 rounded-full bg-[#009EDB] flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </span>
                <span className="text-[15px]">{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            {f.emails.map((em) => (
              <a key={em} href={`mailto:${em}?subject=Public%20Diplomat`} className="inline-flex items-center gap-2 border border-white/40 text-white px-5 py-2.5 text-sm font-semibold hover:bg-white hover:text-[#0b2c4a] transition-colors">
                <Mail className="w-4 h-4" /> {em}
              </a>
            ))}
          </div>
          <div className="mt-6 font-serif text-xl text-[#7cc3ef]">{f.tagline}</div>
        </div>

        <div className="lg:col-span-6">
          <form onSubmit={submit} className="bg-white text-[#0b2c4a] p-7 md:p-9 shadow-xl">
            <div className="text-[11px] tracking-[0.25em] uppercase text-[#009EDB] font-semibold">Apply or Nominate</div>
            <div className="font-serif text-2xl mt-1">Step into public diplomacy</div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[12px] tracking-wide uppercase text-slate-500">Full Name *</label>
                <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" className="rounded-none border-slate-300 focus-visible:ring-[#009EDB] mt-1" />
              </div>
              <div>
                <label className="text-[12px] tracking-wide uppercase text-slate-500">Email *</label>
                <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="name@email.com" className="rounded-none border-slate-300 focus-visible:ring-[#009EDB] mt-1" />
              </div>
              <div>
                <label className="text-[12px] tracking-wide uppercase text-slate-500">Phone</label>
                <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Optional" className="rounded-none border-slate-300 focus-visible:ring-[#009EDB] mt-1" />
              </div>
              <div>
                <label className="text-[12px] tracking-wide uppercase text-slate-500">Country</label>
                <Input value={form.country} onChange={(e) => update("country", e.target.value)} placeholder="Country of residence" className="rounded-none border-slate-300 focus-visible:ring-[#009EDB] mt-1" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[12px] tracking-wide uppercase text-slate-500">Track *</label>
                <Select value={form.track} onValueChange={(v) => update("track", v)}>
                  <SelectTrigger className="rounded-none border-slate-300 focus:ring-[#009EDB] mt-1">
                    <SelectValue placeholder="Apply as... or Nominate" />
                  </SelectTrigger>
                  <SelectContent>
                    {tracks.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {form.track === "Nomination" && (
                <div className="sm:col-span-2">
                  <label className="text-[12px] tracking-wide uppercase text-slate-500">Nominee's Name</label>
                  <Input value={form.nominee_name} onChange={(e) => update("nominee_name", e.target.value)} placeholder="Who are you nominating?" className="rounded-none border-slate-300 focus-visible:ring-[#009EDB] mt-1" />
                </div>
              )}
              <div className="sm:col-span-2">
                <label className="text-[12px] tracking-wide uppercase text-slate-500">Message</label>
                <Textarea value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="Share your motivation, advocacy focus, or the work of the nominee..." className="rounded-none border-slate-300 focus-visible:ring-[#009EDB] mt-1 min-h-[110px]" />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="mt-6 rounded-none bg-[#009EDB] hover:bg-[#0086b8] text-white h-12 px-6 font-semibold">
              <Send className="w-4 h-4 mr-2" /> {loading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AmbassadorFeature;
