import React from "react";
import { Link } from "react-router-dom";
import TopBar from "../components/site/TopBar";
import Header from "../components/site/Header";
import Footer from "../components/site/Footer";
import { Toaster } from "sonner";
import { culturalExchange, contactInfo } from "../data/mock";
import { ArrowRight, Check, Globe2, Award, Users, Mail, MapPin } from "lucide-react";

const offerIcons = [Globe2, Award, MapPin, Users];

const CulturalExchange = () => {
  const c = culturalExchange;
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
          <span className="text-[#0b2c4a]">Cultural Exchange & Leadership Mentorship</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative bg-[#0b2c4a] text-white">
        <div className="absolute inset-0">
          <img src={c.heroImage} alt="Cultural exchange" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b2c4a]/95 via-[#0b2c4a]/70 to-[#0b2c4a]/30" />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-6 py-24 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#009EDB] text-[11px] tracking-[0.22em] uppercase font-semibold">{c.eyebrow}</div>
            <h1 className="font-serif mt-6 text-[38px] md:text-[56px] leading-[1.05] font-semibold">{c.title}</h1>
            <p className="mt-6 text-[17px] md:text-[19px] text-white/85 max-w-2xl leading-relaxed">
              Immersive international experiences for high school students, young leaders and young professionals — paired with iconic mentors from around the world.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#offer" className="inline-flex items-center gap-2 bg-white text-[#0b2c4a] px-6 py-3 font-semibold hover:bg-[#009EDB] hover:text-white transition-colors">Explore the Program <ArrowRight className="w-4 h-4" /></a>
              <a href="#get-involved" className="inline-flex items-center gap-2 border border-white text-white px-6 py-3 font-semibold hover:bg-white hover:text-[#0b2c4a] transition-colors">Get Involved</a>
            </div>
          </div>
        </div>
      </section>

      {/* Overview + Mission */}
      <section className="bg-white py-20">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-7">
            <div className="text-[11px] tracking-[0.25em] uppercase text-[#009EDB] font-semibold">Overview</div>
            <h2 className="font-serif text-3xl md:text-4xl text-[#0b2c4a] mt-3 leading-[1.15]">Exposure, experience and connection</h2>
            <p className="mt-5 text-[17px] leading-[1.8] text-slate-700">{c.overview}</p>
          </div>
          <div className="md:col-span-5">
            <div className="bg-[#f4f7fa] border-l-4 border-[#009EDB] p-7 md:p-8">
              <div className="text-[11px] tracking-[0.25em] uppercase text-[#009EDB] font-semibold">The Mission</div>
              <p className="mt-3 font-serif text-xl md:text-2xl text-[#0b2c4a] leading-snug">{c.mission}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Program Offer */}
      <section id="offer" className="bg-[#f4f7fa] py-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-[11px] tracking-[0.25em] uppercase text-[#009EDB] font-semibold">Program Offer</div>
              <h2 className="font-serif text-3xl md:text-5xl text-[#0b2c4a] mt-3 max-w-2xl">Four interconnected experiences</h2>
            </div>
            <p className="max-w-md text-slate-600">Each tour blends culture, mentorship, institutional access and global networking into one transformative journey.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {c.offerings.map((o, i) => {
              const Icon = offerIcons[i] || Globe2;
              return (
                <article key={o.title} className="bg-white border border-slate-200 p-7 md:p-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#009EDB] text-white flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-xl md:text-2xl text-[#0b2c4a] leading-tight">{o.title}</h3>
                  </div>
                  <p className="mt-4 text-slate-700 leading-[1.75]">{o.body}</p>
                  <ul className="mt-4 space-y-2">
                    {o.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-slate-700">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#009EDB] shrink-0" />
                        <span className="text-[15px] leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Highlights + Participants */}
      <section className="bg-white py-20">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-[#0b2c4a] text-white p-8 md:p-10">
            <div className="text-[11px] tracking-[0.25em] uppercase text-[#7cc3ef] font-semibold">Program Highlights</div>
            <h3 className="font-serif text-2xl md:text-3xl mt-3">What's included</h3>
            <ul className="mt-6 space-y-3">
              {c.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3">
                  <span className="mt-1 w-5 h-5 rounded-full bg-[#009EDB] flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-white" /></span>
                  <span className="text-white/90 text-[15px]">{h}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#f4f7fa] p-8 md:p-10 border-l-4 border-[#009EDB]">
            <div className="text-[11px] tracking-[0.25em] uppercase text-[#009EDB] font-semibold">Who Can Participate?</div>
            <h3 className="font-serif text-2xl md:text-3xl text-[#0b2c4a] mt-3">Our programs are open to</h3>
            <ul className="mt-6 space-y-3">
              {c.participants.map((p) => (
                <li key={p} className="flex items-start gap-3 text-slate-700">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#009EDB] shrink-0" />
                  <span className="text-[15px] leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="bg-[#f4f7fa] py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-5">
              <div className="text-[11px] tracking-[0.25em] uppercase text-[#009EDB] font-semibold">Why It Matters</div>
              <h2 className="font-serif text-3xl md:text-4xl text-[#0b2c4a] mt-3 leading-[1.15]">Leadership requires a global perspective</h2>
              <p className="mt-5 text-[17px] leading-[1.8] text-slate-700">In an increasingly interconnected world, our programs equip participants with the knowledge, skills and networks they need to thrive.</p>
            </div>
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {c.whyItMatters.map((w, i) => (
                <div key={w} className="bg-white border-t-4 border-[#009EDB] p-6">
                  <div className="font-serif text-3xl text-[#009EDB]">0{i + 1}</div>
                  <div className="font-serif text-lg text-[#0b2c4a] mt-2 leading-snug">{w}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Global Reach */}
      <section className="bg-[#0b2c4a] text-white py-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-[11px] tracking-[0.25em] uppercase text-[#7cc3ef] font-semibold">Global Reach</div>
          <h2 className="font-serif text-3xl md:text-5xl mt-3 max-w-2xl">Where our tours happen</h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-white/10">
            {c.regions.map((r) => (
              <div key={r} className="border-r border-b border-white/10 p-7 hover:bg-white/5 transition-colors">
                <MapPin className="w-4 h-4 text-[#7cc3ef]" />
                <div className="font-serif text-xl mt-3 leading-tight">{r}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved */}
      <section id="get-involved" className="bg-white py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="bg-[#f4f7fa] border border-slate-200 p-8 md:p-12 text-center">
            <div className="text-[11px] tracking-[0.25em] uppercase text-[#009EDB] font-semibold">Get Involved</div>
            <h2 className="font-serif text-3xl md:text-5xl text-[#0b2c4a] mt-3 leading-[1.1] max-w-3xl mx-auto">Join us in building the next generation of global leaders</h2>
            <p className="mt-5 text-[17px] leading-[1.8] text-slate-700 max-w-2xl mx-auto">For inquiries, partnerships, or participation — our team is ready to welcome you.</p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <a href={`mailto:${contactInfo.email}?subject=Cultural%20Exchange%20Program`} className="inline-flex items-center gap-2 bg-[#009EDB] hover:bg-[#0086b8] text-white px-6 py-3 font-semibold"><Mail className="w-4 h-4" /> info@globerelations.org</a>
              <a href="mailto:info@grfus.org?subject=Cultural%20Exchange%20Program" className="inline-flex items-center gap-2 border border-[#0b2c4a] text-[#0b2c4a] px-6 py-3 font-semibold hover:bg-[#0b2c4a] hover:text-white transition-colors"><Mail className="w-4 h-4" /> info@grfus.org</a>
            </div>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="bg-[#0b2c4a] text-white py-16">
        <div className="max-w-[1000px] mx-auto px-6 text-center">
          <div className="text-[11px] tracking-[0.25em] uppercase text-[#7cc3ef] font-semibold">Experience the World. Lead the Future.</div>
          <p className="mt-5 font-serif text-2xl md:text-3xl leading-snug">Through cultural exchange and mentorship, AGRF is shaping leaders who are prepared to make a difference — locally and globally.</p>
        </div>
      </section>

      <Footer />
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default CulturalExchange;
