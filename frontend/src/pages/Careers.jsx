import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import TopBar from "../components/site/TopBar";
import Header from "../components/site/Header";
import Footer from "../components/site/Footer";
import { Toaster, toast } from "sonner";
import { careersPage } from "../data/mock";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Info, Send, Users } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Careers = () => {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", country: "", region: "", profession: "", mode: "", availability: "", message: ""
  });
  const [loading, setLoading] = useState(false);
  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.country || !form.profession || !form.mode) {
      toast.error("Please complete name, email, country, profession and volunteer mode.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/volunteer-application`, form);
      toast.success("Application received. Our volunteer team will reach out shortly.");
      if (data?.mailto) window.open(data.mailto, "_blank");
      setForm({ name: "", email: "", phone: "", country: "", region: "", profession: "", mode: "", availability: "", message: "" });
    } catch (err) {
      toast.error(err?.response?.data?.detail?.[0]?.msg || "Could not submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <TopBar />
      <Header />

      <div className="bg-[#f4f7fa] border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-6 py-4 text-[12px] tracking-[0.18em] uppercase text-slate-500">
          <Link to="/" className="hover:text-[#009EDB]">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-[#0b2c4a]">Careers</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative bg-[#0b2c4a] text-white">
        <div className="absolute inset-0">
          <img src={careersPage.heroImage} alt="Volunteers collaborating" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b2c4a]/95 via-[#0b2c4a]/70 to-[#0b2c4a]/30" />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-6 py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#009EDB] text-[11px] tracking-[0.22em] uppercase font-semibold">
              {careersPage.eyebrow}
            </div>
            <h1 className="font-serif mt-6 text-[40px] md:text-[60px] leading-[1.05] font-semibold">{careersPage.title}</h1>
            <p className="mt-6 text-[17px] md:text-[19px] text-white/85 max-w-2xl leading-relaxed">
              Volunteer with AGRF and contribute your time, skills and passion to programs that strengthen communities across the United States, Europe and Africa.
            </p>
          </div>
        </div>
      </section>

      {/* Hiring notice */}
      <section className="bg-white py-16">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="flex items-start gap-5 bg-[#f4f7fa] border-l-4 border-[#009EDB] p-7 md:p-8">
            <div className="w-12 h-12 bg-[#009EDB] text-white flex items-center justify-center shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] tracking-[0.22em] uppercase text-[#009EDB] font-semibold">Important Notice</div>
              <h2 className="font-serif text-2xl md:text-3xl text-[#0b2c4a] mt-2 leading-tight">We are not currently hiring — but volunteers are always welcome.</h2>
              <p className="mt-4 text-slate-700 leading-[1.8]">{careersPage.notHiringNotice}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Application form */}
      <section id="apply" className="bg-[#f4f7fa] py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-[#009EDB] font-semibold">
                <Users className="w-4 h-4" /> Volunteer Application
              </div>
              <h2 className="font-serif text-3xl md:text-4xl text-[#0b2c4a] mt-3">Apply to volunteer with AGRF</h2>
            </div>
            <p className="max-w-md text-slate-600">Tell us a bit about yourself and how you'd like to contribute. Our team typically responds within a week.</p>
          </div>

          <form onSubmit={submit} className="bg-white border border-slate-200 p-7 md:p-10 grid grid-cols-1 sm:grid-cols-2 gap-5">
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
              <label className="text-[12px] tracking-wide uppercase text-slate-500">Country *</label>
              <Input value={form.country} onChange={(e) => update("country", e.target.value)} placeholder="Country of residence" className="rounded-none border-slate-300 focus-visible:ring-[#009EDB] mt-1" />
            </div>
            <div>
              <label className="text-[12px] tracking-wide uppercase text-slate-500">Region / State / City</label>
              <Input value={form.region} onChange={(e) => update("region", e.target.value)} placeholder="e.g. New York, NY" className="rounded-none border-slate-300 focus-visible:ring-[#009EDB] mt-1" />
            </div>
            <div>
              <label className="text-[12px] tracking-wide uppercase text-slate-500">Profession *</label>
              <Input value={form.profession} onChange={(e) => update("profession", e.target.value)} placeholder="e.g. Educator, Designer, Nurse" className="rounded-none border-slate-300 focus-visible:ring-[#009EDB] mt-1" />
            </div>
            <div>
              <label className="text-[12px] tracking-wide uppercase text-slate-500">Volunteer Mode *</label>
              <Select value={form.mode} onValueChange={(v) => update("mode", v)}>
                <SelectTrigger className="rounded-none border-slate-300 focus:ring-[#009EDB] mt-1">
                  <SelectValue placeholder="Select volunteer mode" />
                </SelectTrigger>
                <SelectContent>
                  {careersPage.volunteerModes.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[12px] tracking-wide uppercase text-slate-500">Availability</label>
              <Input value={form.availability} onChange={(e) => update("availability", e.target.value)} placeholder="e.g. Weekends, 5–10 hrs/week" className="rounded-none border-slate-300 focus-visible:ring-[#009EDB] mt-1" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[12px] tracking-wide uppercase text-slate-500">Why you'd like to volunteer</label>
              <Textarea value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="Share your motivation, skills or areas of interest..." className="rounded-none border-slate-300 focus-visible:ring-[#009EDB] mt-1 min-h-[120px]" />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={loading} className="rounded-none bg-[#009EDB] hover:bg-[#0086b8] text-white h-12 px-6 font-semibold">
                <Send className="w-4 h-4 mr-2" /> {loading ? "Submitting..." : "Submit Application"}
              </Button>
              <div className="mt-3 text-[12px] text-slate-500">By submitting, you agree to be contacted by the AGRF volunteer team at the email provided.</div>
            </div>
          </form>
        </div>
      </section>

      <Footer />
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default Careers;
