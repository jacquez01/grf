import React from "react";
import { Link } from "react-router-dom";
import { youthCenter, contactInfo } from "../data/mock";
import TopBar from "../components/site/TopBar";
import Header from "../components/site/Header";
import Footer from "../components/site/Footer";
import MentorSignupForm from "../components/site/MentorSignupForm";
import { Toaster } from "sonner";
import { Check, ArrowRight, Heart, Sparkles, Shield, BookOpen, Users, Globe2, Mail, MapPin } from "lucide-react";

const iconFor = (id) => ({
  1: Heart,
  2: Sparkles,
  3: Shield,
  4: BookOpen,
  5: Users,
  6: Globe2,
}[id] || Heart);

const YouthSucceedCenter = () => {
  return (
    <div className="bg-white">
      <TopBar />
      <Header />

      {/* Breadcrumb */}
      <div className="bg-[#f4f7fa] border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-6 py-4 text-[12px] tracking-[0.18em] uppercase text-slate-500">
          <Link to="/" className="hover:text-[#009EDB]">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-[#009EDB]">Programs</span>
          <span className="mx-2">/</span>
          <span className="text-[#0b2c4a]">Youth Succeed Center</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative bg-[#0b2c4a] text-white">
        <div className="absolute inset-0">
          <img src={youthCenter.heroImage} alt="Diverse youth united" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b2c4a]/95 via-[#0b2c4a]/70 to-[#0b2c4a]/30" />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-6 py-24 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#009EDB] text-[11px] tracking-[0.22em] uppercase font-semibold">
              A Global Initiative by AGRF
            </div>
            <h1 className="font-serif mt-6 text-[40px] md:text-[60px] leading-[1.05] font-semibold">
              Youth Succeed Center
            </h1>
            <div className="mt-3 font-serif text-2xl md:text-3xl text-[#7cc3ef]">Youth Open House Project</div>
            <p className="mt-6 text-[17px] md:text-[19px] text-white/85 max-w-2xl leading-relaxed">
              A flagship initiative of the America Global Relations Foundation, creating safe, inclusive and empowering spaces for young people across the world — through Open Youth House Centers, also known as the Youth Succeed Center, functioning as the America Youth Council House and its international branches.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#pillars" className="inline-flex items-center gap-2 bg-white text-[#0b2c4a] px-6 py-3 font-semibold hover:bg-[#009EDB] hover:text-white transition-colors">
                What We Do <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#mentor-signup" className="inline-flex items-center gap-2 border border-white text-white px-6 py-3 font-semibold hover:bg-white hover:text-[#0b2c4a] transition-colors">
                Volunteer or Mentor
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="bg-white py-20">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-5">
            <img src={youthCenter.unityImage} alt="Diverse young people united" className="w-full aspect-[4/5] object-cover" />
          </div>
          <div className="md:col-span-7">
            <div className="text-[11px] tracking-[0.25em] uppercase text-[#009EDB] font-semibold">The Vision</div>
            <h2 className="font-serif text-3xl md:text-5xl text-[#0b2c4a] mt-3 leading-[1.1]">
              A global network of youth-centered hubs
            </h2>
            <p className="mt-6 text-[18px] leading-[1.8] text-slate-700">
              To empower young people with the tools, mentorship and community they need to grow, lead and succeed — through dedicated centers in the United States, Europe (Germany, Netherlands, Italy), Africa and beyond.
            </p>
            <p className="mt-4 text-[16px] leading-[1.8] text-slate-600">
              Each center is tailored to meet the unique needs of its local community while maintaining a shared global mission of direct support, guidance and opportunity.
            </p>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section id="pillars" className="bg-[#f4f7fa] py-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-[11px] tracking-[0.25em] uppercase text-[#009EDB] font-semibold">What Each Center Offers</div>
              <h2 className="font-serif text-3xl md:text-5xl text-[#0b2c4a] mt-3 max-w-2xl">Six pillars of youth success</h2>
            </div>
            <p className="max-w-md text-slate-600">At every Youth Open House Center, we deliver integrated services that meet young people where they are.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {youthCenter.pillars.map((p) => {
              const Icon = iconFor(p.id);
              return (
                <article key={p.id} className="group bg-white border border-slate-200 hover:shadow-xl transition-shadow flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-3 left-3 bg-[#009EDB] text-white w-10 h-10 flex items-center justify-center font-serif text-lg">
                      {p.id}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-[#009EDB]" />
                      <h3 className="font-serif text-xl text-[#0b2c4a] leading-tight">{p.title}</h3>
                    </div>
                    <ul className="mt-4 space-y-2.5 flex-1">
                      {p.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-3 text-slate-700">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#009EDB] shrink-0" />
                          <span className="text-[14px] leading-relaxed">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="bg-white py-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-5">
              <div className="text-[11px] tracking-[0.25em] uppercase text-[#009EDB] font-semibold">Why It Matters</div>
              <h2 className="font-serif text-3xl md:text-5xl text-[#0b2c4a] mt-3 leading-[1.1]">
                Bridging the gap for young people
              </h2>
              <p className="mt-6 text-[17px] leading-[1.8] text-slate-700">
                Across the world, millions of young people face barriers to opportunity, guidance and safe environments. The Youth Succeed Project is committed to bridging these gaps by creating accessible, supportive spaces where youth can thrive.
              </p>
            </div>
            <div className="md:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {youthCenter.whyItMatters.map((w, i) => (
                  <div key={w} className="group bg-[#f4f7fa] border-l-4 border-[#009EDB] p-6 hover:bg-[#0b2c4a] hover:text-white transition-colors">
                    <div className="font-serif text-3xl text-[#009EDB] group-hover:text-[#7cc3ef]">0{i + 1}</div>
                    <div className="font-serif text-xl text-[#0b2c4a] group-hover:text-white mt-2">{w}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Reach */}
      <section className="bg-[#0b2c4a] text-white py-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-[11px] tracking-[0.25em] uppercase text-[#7cc3ef] font-semibold">Global Reach</div>
              <h2 className="font-serif text-3xl md:text-5xl mt-3 max-w-2xl">A worldwide network, one shared mission</h2>
            </div>
            <p className="max-w-md text-white/80">Centers planned and expanding across four regions — locally tailored, globally connected.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-white/10">
            {youthCenter.regions.map((r) => (
              <div key={r.name} className="border-r border-b border-white/10 p-7 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#7cc3ef]" />
                  <div className="text-[11px] tracking-[0.22em] uppercase text-[#7cc3ef] font-semibold">{r.country}</div>
                </div>
                <div className="font-serif text-xl mt-3 leading-tight">{r.name}</div>
                <div className="text-white/75 mt-2 text-sm">{r.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved */}
      <section id="get-involved" className="bg-[#f4f7fa] py-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="bg-white border border-slate-200 p-8 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-7">
              <div className="text-[11px] tracking-[0.25em] uppercase text-[#009EDB] font-semibold">Get Involved</div>
              <h2 className="font-serif text-3xl md:text-5xl text-[#0b2c4a] mt-3 leading-[1.1]">
                Partner with us to empower youth globally
              </h2>
              <p className="mt-5 text-[17px] leading-[1.8] text-slate-700">
                We welcome partnerships with organizations, mentors, volunteers and stakeholders who share our vision of empowering youth globally. Email us to learn more, partner, or support the Youth Open House Project.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={`mailto:${contactInfo.email}?subject=Youth%20Open%20House%20Project%20Partnership`} className="inline-flex items-center gap-2 bg-[#009EDB] hover:bg-[#0086b8] text-white px-6 py-3 font-semibold">
                  <Mail className="w-4 h-4" /> {contactInfo.email}
                </a>
                <Link to="/#contact" className="inline-flex items-center gap-2 border border-[#0b2c4a] text-[#0b2c4a] px-6 py-3 font-semibold hover:bg-[#0b2c4a] hover:text-white transition-colors">
                  Contact AGRF
                </Link>
              </div>
            </div>
            <div className="md:col-span-5">
              <img src={youthCenter.closingImage} alt="Together we build the future" className="w-full aspect-[4/3] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="bg-white py-20">
        <div className="max-w-[1000px] mx-auto px-6 text-center">
          <div className="text-[11px] tracking-[0.25em] uppercase text-[#009EDB] font-semibold">Together, We Build the Future</div>
          <h2 className="font-serif text-3xl md:text-5xl text-[#0b2c4a] mt-4 leading-[1.15]">
            More than a program — a movement
          </h2>
          <p className="mt-6 text-[18px] leading-[1.8] text-slate-700">
            The Youth Open House Project is a movement to create a world where every young person has access to mentors, support, opportunity and a community that believes in them.
          </p>
          <div className="mt-10 inline-flex items-center gap-3 text-[#009EDB] font-semibold">
            <Check className="w-5 h-5" />
            <span>Join the movement — reach out today.</span>
          </div>
        </div>
      </section>

      <MentorSignupForm />

      <Footer />
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default YouthSucceedCenter;
