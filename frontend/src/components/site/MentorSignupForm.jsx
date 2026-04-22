import React, { useState } from "react";
import axios from "axios";
import { youthCenter } from "../../data/mock";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";
import { Send, HeartHandshake } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const roles = ["Mentor", "Volunteer", "Center Lead", "Partner Organization"];

const MentorSignupForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    center: "",
    experience: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.role) {
      toast.error("Please provide your name, email and role.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/mentor-signup`, form);
      toast.success("Thank you. Our Youth Succeed team will reach out shortly.");
      if (data?.mailto) window.open(data.mailto, "_blank");
      setForm({ name: "", email: "", phone: "", role: "", center: "", experience: "", message: "" });
    } catch (err) {
      toast.error(err?.response?.data?.detail?.[0]?.msg || "Could not submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="mentor-signup" className="bg-white py-20">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-[#009EDB] font-semibold">
              <HeartHandshake className="w-4 h-4" /> Join the Movement
            </div>
            <h2 className="font-serif text-3xl md:text-5xl text-[#0b2c4a] mt-3 leading-[1.1]">
              Volunteer, mentor or lead a center
            </h2>
            <p className="mt-5 text-[17px] leading-[1.8] text-slate-700">
              Share your time, skills or organizational reach with the Youth Succeed network. Tell us where you'd like to plug in — at a specific center or across the global network.
            </p>
            <ul className="mt-6 space-y-2 text-slate-700 text-[15px]">
              <li className="flex items-start gap-2"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#009EDB]" /> Mentor young people 1:1 or in group sessions</li>
              <li className="flex items-start gap-2"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#009EDB]" /> Volunteer for workshops, events and outreach</li>
              <li className="flex items-start gap-2"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#009EDB]" /> Lead or co-found a Youth Succeed Center in your city</li>
              <li className="flex items-start gap-2"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#009EDB]" /> Partner your organization with the network</li>
            </ul>
          </div>
          <div className="md:col-span-7">
            <form onSubmit={submit} className="bg-[#f4f7fa] border border-slate-200 p-7 md:p-9">
              <div className="text-[11px] tracking-[0.25em] uppercase text-[#009EDB] font-semibold">Signup</div>
              <div className="font-serif text-2xl text-[#0b2c4a] mt-1">Tell us how you'd like to contribute</div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] tracking-wide uppercase text-slate-500">Full Name *</label>
                  <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" className="rounded-none border-slate-300 focus-visible:ring-[#009EDB] mt-1 bg-white" />
                </div>
                <div>
                  <label className="text-[12px] tracking-wide uppercase text-slate-500">Email *</label>
                  <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="name@email.com" className="rounded-none border-slate-300 focus-visible:ring-[#009EDB] mt-1 bg-white" />
                </div>
                <div>
                  <label className="text-[12px] tracking-wide uppercase text-slate-500">Phone</label>
                  <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Optional" className="rounded-none border-slate-300 focus-visible:ring-[#009EDB] mt-1 bg-white" />
                </div>
                <div>
                  <label className="text-[12px] tracking-wide uppercase text-slate-500">Role *</label>
                  <Select value={form.role} onValueChange={(v) => update("role", v)}>
                    <SelectTrigger className="rounded-none border-slate-300 focus:ring-[#009EDB] mt-1 bg-white">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[12px] tracking-wide uppercase text-slate-500">Preferred Center</label>
                  <Select value={form.center} onValueChange={(v) => update("center", v)}>
                    <SelectTrigger className="rounded-none border-slate-300 focus:ring-[#009EDB] mt-1 bg-white">
                      <SelectValue placeholder="Any center — I'm flexible" />
                    </SelectTrigger>
                    <SelectContent>
                      {youthCenter.regions.map((r) => (
                        <SelectItem key={r.name} value={r.name}>{r.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[12px] tracking-wide uppercase text-slate-500">Relevant Experience</label>
                  <Textarea value={form.experience} onChange={(e) => update("experience", e.target.value)} placeholder="Briefly share your background, languages, or areas of expertise..." className="rounded-none border-slate-300 focus-visible:ring-[#009EDB] mt-1 bg-white min-h-[90px]" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[12px] tracking-wide uppercase text-slate-500">Anything Else?</label>
                  <Textarea value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="Questions, availability, or how you'd like to contribute..." className="rounded-none border-slate-300 focus-visible:ring-[#009EDB] mt-1 bg-white min-h-[90px]" />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="mt-6 rounded-none bg-[#009EDB] hover:bg-[#0086b8] text-white h-12 px-6 font-semibold">
                <Send className="w-4 h-4 mr-2" /> {loading ? "Submitting..." : "Submit Signup"}
              </Button>
              <div className="mt-3 text-[12px] text-slate-500">By submitting, you agree to be contacted by the Youth Succeed team at the email provided.</div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MentorSignupForm;
