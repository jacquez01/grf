import React from "react";
import { Link } from "react-router-dom";
import TopBar from "../components/site/TopBar";
import Header from "../components/site/Header";
import Footer from "../components/site/Footer";
import { Toaster } from "sonner";
import { anyc, contactInfo } from "../data/mock";
import { ArrowRight, Check, Users, Megaphone, GraduationCap, Handshake, Lightbulb, Mail } from "lucide-react";

const pillarIcons = [Handshake, Users, Megaphone, GraduationCap, Lightbulb];

const AmericaNationalYouthCouncil = () => {
  const a = anyc;
  return (
    <div className="bg-white">
      <TopBar />
      <Header />

      <div className="bg-[#f4f7fa] border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-6 py-4 text-[12px] tracking-[0.18em] uppercase text-slate-500">
          <Link to="/" className="hover:text-[#009EDB]">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-[#009EDB]">Programs</span>
          <span className="mx-2">/</span>
          <span className="text-[#0b2c4a]">America National Youth Council</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative bg-[#0b2c4a] text-white">
        <div className="absolute inset-0">
          <img src={a.heroImage} alt="American youth civic engagement" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b2c4a]/95 via-[#0b2c4a]/70 to-[#0b2c4a]/30" />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-6 py-24 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#009EDB] text-[11px] tracking-[0.22em] uppercase font-semibold">{a.eyebrow}</div>
            <h1 className="font-serif mt-6 text-[40px] md:text-[60px] leading-[1.05] font-semibold">{a.title}</h1>
            <p className="mt-6 text-[17px] md:text-[19px] text-white/85 max-w-2xl leading-relaxed">{a.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#overview" className="inline-flex items-center gap-2 bg-white text-[#0b2c4a] px-6 py-3 font-semibold hover:bg-[#009EDB] hover:text-white transition-colors">Learn More <ArrowRight className="w-4 h-4" /></a>
              <a href="#get-involved" className="inline-flex items-center gap-2 border border-white text-white px-6 py-3 font-semibold hover:bg-white hover:text-[#0b2c4a] transition-colors">Get Involved</a>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section id="overview" className="bg-white py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-[11px] tracking-[0.25em] uppercase text-[#009EDB] font-semibold">Overview</div>
          <h2 className="font-serif text-3xl md:text-5xl text-[#0b2c4a] mt-3 leading-[1.1] max-w-3xl">A platform for youth voices in national conversations</h2>
          <p className="mt-6 text-[17px] leading-[1.8] text-slate-700 max-w-3xl">{a.overview}</p>
        </div>
      </section>

      {/* Mission + Vision */}
      <section className="bg-[#f4f7fa] py-20">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border-l-4 border-[#009EDB] p-8 md:p-10">
            <div className="text-[11px] tracking-[0.25em] uppercase text-[#009EDB] font-semibold">Our Mission</div>
            <p className="mt-4 font-serif text-xl md:text-2xl text-[#0b2c4a] leading-snug">{a.mission}</p>
          </div>
          <div className="bg-[#0b2c4a] text-white p-8 md:p-10">
            <div className="text-[11px] tracking-[0.25em] uppercase text-[#7cc3ef] font-semibold">Our Vision</div>
            <p className="mt-4 font-serif text-xl md:text-2xl leading-snug">{a.vision}</p>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="bg-white py-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-[11px] tracking-[0.25em] uppercase text-[#009EDB] font-semibold">What We Do</div>
              <h2 className="font-serif text-3xl md:text-5xl text-[#0b2c4a] mt-3 max-w-2xl">Five areas of action</h2>
            </div>
            <p className="max-w-md text-slate-600">From grassroots community initiatives to national policy dialogue, ANYC creates pathways for young Americans to lead.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {a.pillars.map((p, i) => {
              const Icon = pillarIcons[i] || Users;
              return (
                <article key={p.title} className="bg-[#f4f7fa] border border-slate-200 p-7 md:p-8 hover:bg-white hover:shadow-lg transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#009EDB] text-white flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-xl text-[#0b2c4a] leading-tight">{p.title}</h3>
                  </div>
                  <p className="mt-4 text-slate-700 leading-[1.75] text-[15px]">{p.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="bg-[#0b2c4a] text-white py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-5">
              <div className="text-[11px] tracking-[0.25em] uppercase text-[#7cc3ef] font-semibold">Why It Matters</div>
              <h2 className="font-serif text-3xl md:text-5xl mt-3 leading-[1.1]">Young people are essential partners in building a stronger America</h2>
              <p className="mt-6 text-[17px] leading-[1.8] text-white/85">The America National Youth Council creates opportunities for youth to participate, contribute and lead.</p>
            </div>
            <div className="md:col-span-7">
              <ul className="space-y-0 border-t border-white/10">
                {a.whyItMatters.map((w, i) => (
                  <li key={w} className="flex items-center gap-5 border-b border-white/10 py-5 group hover:bg-white/5 px-4 -mx-4 transition-colors">
                    <div className="font-serif text-2xl text-[#7cc3ef] w-10 shrink-0">0{i + 1}</div>
                    <div className="font-serif text-xl md:text-2xl leading-tight">{w}</div>
                    <Check className="w-5 h-5 ml-auto text-[#7cc3ef]" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Get Involved */}
      <section id="get-involved" className="bg-[#f4f7fa] py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="bg-white border border-slate-200 p-8 md:p-12 text-center">
            <div className="text-[11px] tracking-[0.25em] uppercase text-[#009EDB] font-semibold">Get Involved</div>
            <h2 className="font-serif text-3xl md:text-5xl text-[#0b2c4a] mt-3 leading-[1.1] max-w-3xl mx-auto">Be part of a movement committed to building a better society for all</h2>
            <p className="mt-5 text-[17px] leading-[1.8] text-slate-700 max-w-2xl mx-auto">To join, partner, or learn more — reach our team.</p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <a href={`mailto:${contactInfo.email}?subject=America%20National%20Youth%20Council`} className="inline-flex items-center gap-2 bg-[#009EDB] hover:bg-[#0086b8] text-white px-6 py-3 font-semibold"><Mail className="w-4 h-4" /> {contactInfo.email}</a>
              <Link to="/careers" className="inline-flex items-center gap-2 border border-[#0b2c4a] text-[#0b2c4a] px-6 py-3 font-semibold hover:bg-[#0b2c4a] hover:text-white transition-colors">Volunteer with AGRF</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="bg-[#0b2c4a] text-white py-16">
        <div className="max-w-[1000px] mx-auto px-6 text-center">
          <div className="text-[11px] tracking-[0.25em] uppercase text-[#7cc3ef] font-semibold">Together, We Build a Better America</div>
          <p className="mt-5 font-serif text-2xl md:text-3xl leading-snug">{a.closing}</p>
        </div>
      </section>

      <Footer />
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default AmericaNationalYouthCouncil;
