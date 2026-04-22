import React, { useState } from "react";
import axios from "axios";
import { contactInfo, siteInfo } from "../../data/mock";
import { Phone, Mail, MapPin, Send, Globe } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill required fields.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/contact`, form);
      toast.success("Message received. We will reply shortly.");
      if (data?.mailto) {
        window.open(data.mailto, "_blank");
      }
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast.error(err?.response?.data?.detail?.[0]?.msg || "Could not send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const lines = [
    { icon: Phone, label: "Secretary General", value: contactInfo.secretaryGeneral, href: `tel:${contactInfo.secretaryGeneral}` },
    { icon: Phone, label: "Office", value: contactInfo.office, href: `tel:${contactInfo.office}` },
    { icon: Phone, label: "Africa", value: contactInfo.africa, href: `tel:${contactInfo.africa}` },
    { icon: Mail, label: "Email", value: contactInfo.email, href: `mailto:${contactInfo.email}` },
    { icon: MapPin, label: "Headquarters", value: contactInfo.address },
    { icon: Globe, label: "Present Regions", value: siteInfo.presentRegion }
  ];

  return (
    <section id="contact" className="bg-[#f4f7fa] py-20">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-[11px] tracking-[0.25em] uppercase text-[#009EDB] font-semibold">Contact</div>
            <h2 className="font-serif text-3xl md:text-5xl text-[#0b2c4a] mt-2 max-w-2xl">Reach our team</h2>
          </div>
          <p className="max-w-md text-slate-600">We welcome partnership inquiries, media requests, donation questions and community ideas from across the United States, Europe and Africa.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 space-y-0 bg-white border border-slate-200">
            {lines.map((l, i) => (
              <div key={l.label} className={`flex items-start gap-4 p-6 ${i !== lines.length - 1 ? "border-b border-slate-200" : ""}`}>
                <div className="w-10 h-10 bg-[#0b2c4a] text-white flex items-center justify-center shrink-0">
                  <l.icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] tracking-[0.22em] uppercase text-[#009EDB] font-semibold">{l.label}</div>
                  {l.href ? (
                    <a href={l.href} className="text-[#0b2c4a] font-serif text-lg hover:text-[#009EDB]">{l.value}</a>
                  ) : (
                    <div className="text-[#0b2c4a] font-serif text-lg">{l.value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={submit} className="md:col-span-7 bg-white border border-slate-200 p-8">
            <div className="font-serif text-2xl text-[#0b2c4a]">Send us a message</div>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="rounded-none border-slate-300 focus-visible:ring-[#009EDB]" />
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email address" className="rounded-none border-slate-300 focus-visible:ring-[#009EDB]" />
              <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject" className="sm:col-span-2 rounded-none border-slate-300 focus-visible:ring-[#009EDB]" />
              <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Your message" className="sm:col-span-2 min-h-[140px] rounded-none border-slate-300 focus-visible:ring-[#009EDB]" />
            </div>
            <Button type="submit" disabled={loading} className="mt-5 rounded-none h-12 bg-[#009EDB] hover:bg-[#0086b8] text-white px-6 font-semibold">
              <Send className="w-4 h-4 mr-2" /> {loading ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
