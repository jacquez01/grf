import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import TopBar from "../components/site/TopBar";
import Header from "../components/site/Header";
import Footer from "../components/site/Footer";
import { Toaster, toast } from "sonner";
import { petitionPage } from "../data/mock";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { ArrowRight, Users, Megaphone, PenLine, Check, Share2, Globe2 } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const categories = petitionPage.issues;

const Petitions = () => {
  const [list, setList] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [form, setForm] = useState({ title: "", creator_name: "", creator_email: "", category: "", target: "", summary: "", full_text: "", country: "" });
  const [creating, setCreating] = useState(false);

  const fetchList = async () => {
    setLoadingList(true);
    try {
      const { data } = await axios.get(`${API}/petitions`);
      setList(data || []);
    } catch {
      setList([]);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.creator_name || !form.creator_email || !form.category || !form.target || !form.summary) {
      toast.error("Please complete all required fields.");
      return;
    }
    setCreating(true);
    try {
      const { data } = await axios.post(`${API}/petitions`, form);
      toast.success("Petition created. Share the link to gather signatures.");
      setForm({ title: "", creator_name: "", creator_email: "", category: "", target: "", summary: "", full_text: "", country: "" });
      fetchList();
      window.setTimeout(() => {
        window.location.href = `/petitions/${data.slug}`;
      }, 600);
    } catch (err) {
      toast.error(err?.response?.data?.detail?.[0]?.msg || "Could not create petition.");
    } finally {
      setCreating(false);
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
          <span className="text-[#009EDB]">Programs</span>
          <span className="mx-2">/</span>
          <span className="text-[#0b2c4a]">Global Petition Platform</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative bg-[#0b2c4a] text-white">
        <div className="absolute inset-0">
          <img src={petitionPage.heroImage} alt="Community advocates" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b2c4a]/95 via-[#0b2c4a]/70 to-[#0b2c4a]/30" />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-6 py-24 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#009EDB] text-[11px] tracking-[0.22em] uppercase font-semibold">{petitionPage.eyebrow}</div>
            <h1 className="font-serif mt-6 text-[40px] md:text-[60px] leading-[1.05] font-semibold">{petitionPage.title}</h1>
            <p className="mt-6 text-[17px] md:text-[19px] text-white/85 max-w-2xl leading-relaxed">{petitionPage.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#sign" className="inline-flex items-center gap-2 bg-white text-[#0b2c4a] px-6 py-3 font-semibold hover:bg-[#009EDB] hover:text-white transition-colors">Sign a Petition <ArrowRight className="w-4 h-4" /></a>
              <a href="#create" className="inline-flex items-center gap-2 border border-white text-white px-6 py-3 font-semibold hover:bg-white hover:text-[#0b2c4a] transition-colors"><PenLine className="w-4 h-4" /> Create a Petition</a>
            </div>
          </div>
        </div>
      </section>

      {/* What / Issues */}
      <section className="bg-white py-20">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-6">
            <div className="text-[11px] tracking-[0.25em] uppercase text-[#009EDB] font-semibold">What This Platform Does</div>
            <h2 className="font-serif text-3xl md:text-4xl text-[#0b2c4a] mt-3 leading-[1.15]">Make your voice count</h2>
            <ul className="mt-6 space-y-3">
              {petitionPage.doesWhat.map((t) => (
                <li key={t} className="flex items-start gap-3 text-slate-700">
                  <span className="mt-1 w-5 h-5 rounded-full bg-[#009EDB] flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-white" /></span>
                  <span className="text-[15px] leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-6">
            <div className="bg-[#f4f7fa] border-l-4 border-[#009EDB] p-7">
              <div className="text-[11px] tracking-[0.25em] uppercase text-[#009EDB] font-semibold">Issues You Can Support</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {petitionPage.issues.map((i) => (
                  <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 text-[13px] text-[#0b2c4a]">{i}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sign list */}
      <section id="sign" className="bg-[#f4f7fa] py-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-[11px] tracking-[0.25em] uppercase text-[#009EDB] font-semibold">Sign a Petition</div>
              <h2 className="font-serif text-3xl md:text-4xl text-[#0b2c4a] mt-3">Active petitions</h2>
            </div>
            <p className="max-w-md text-slate-600">Add your voice to ongoing campaigns. Petitions with 5,000+ signatures are automatically featured in the AGRF Newsroom.</p>
          </div>

          {loadingList ? (
            <div className="text-slate-500 py-8">Loading petitions…</div>
          ) : list.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 p-10 text-center">
              <Megaphone className="w-8 h-8 text-[#009EDB] mx-auto" />
              <div className="mt-4 font-serif text-2xl text-[#0b2c4a]">Be the first to start a petition</div>
              <p className="mt-2 text-slate-600">No active petitions yet. Create one below and start rallying signatures from around the world.</p>
              <a href="#create" className="mt-5 inline-flex items-center gap-2 bg-[#009EDB] hover:bg-[#0086b8] text-white px-5 py-2.5 text-sm font-semibold"><PenLine className="w-4 h-4" /> Create a Petition</a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.map((p) => (
                <article key={p.id} className="bg-white border border-slate-200 hover:shadow-lg transition-shadow flex flex-col">
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-[#009EDB] font-semibold">
                      <Globe2 className="w-3.5 h-3.5" /> {p.category}
                    </div>
                    <h3 className="font-serif text-xl text-[#0b2c4a] mt-3 leading-tight">{p.title}</h3>
                    <div className="mt-2 text-[13px] text-slate-500">Addressed to: <span className="text-[#0b2c4a] font-semibold">{p.target}</span></div>
                    <p className="mt-3 text-slate-700 text-[14px] leading-relaxed line-clamp-4 flex-1">{p.summary}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                      <div className="inline-flex items-center gap-2 text-sm text-[#0b2c4a]">
                        <Users className="w-4 h-4 text-[#009EDB]" /> <span className="font-semibold">{p.signature_count.toLocaleString()}</span> signed
                        {p.featured_in_newsroom && <span className="ml-1 inline-block px-1.5 py-0.5 text-[10px] bg-[#009EDB] text-white">NEWSROOM</span>}
                      </div>
                      <Link to={`/petitions/${p.slug}`} className="inline-flex items-center gap-1 text-[#009EDB] font-semibold text-sm hover:gap-2 transition-all">Sign <ArrowRight className="w-4 h-4" /></Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Create a petition */}
      <section id="create" className="bg-white py-20">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-[#009EDB] font-semibold">
              <PenLine className="w-4 h-4" /> Create a Petition
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-[#0b2c4a] mt-3 leading-[1.15]">Start your own petition</h2>
            <p className="mt-5 text-[17px] leading-[1.8] text-slate-700">Have an issue you want leaders to hear about? Create a petition, get a shareable link, and mobilize support from around the world.</p>
            <div className="mt-6 bg-[#f4f7fa] border-l-4 border-[#009EDB] p-5 text-sm text-slate-700">
              <div className="flex items-center gap-2 text-[#009EDB] font-semibold"><Share2 className="w-4 h-4" /> Shareable link</div>
              <p className="mt-2">Every petition gets its own public page and link you can share anywhere. Once your petition hits 5,000 signatures, it is automatically featured in the AGRF Newsroom.</p>
            </div>
          </div>
          <form onSubmit={submit} className="md:col-span-7 bg-[#f4f7fa] border border-slate-200 p-7 md:p-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-[12px] tracking-wide uppercase text-slate-500">Petition Title *</label>
              <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. End child labour in global supply chains" className="rounded-none border-slate-300 focus-visible:ring-[#009EDB] mt-1 bg-white" />
            </div>
            <div>
              <label className="text-[12px] tracking-wide uppercase text-slate-500">Your Name *</label>
              <Input value={form.creator_name} onChange={(e) => update("creator_name", e.target.value)} placeholder="Full name" className="rounded-none border-slate-300 focus-visible:ring-[#009EDB] mt-1 bg-white" />
            </div>
            <div>
              <label className="text-[12px] tracking-wide uppercase text-slate-500">Your Email *</label>
              <Input type="email" value={form.creator_email} onChange={(e) => update("creator_email", e.target.value)} placeholder="name@email.com" className="rounded-none border-slate-300 focus-visible:ring-[#009EDB] mt-1 bg-white" />
            </div>
            <div>
              <label className="text-[12px] tracking-wide uppercase text-slate-500">Category *</label>
              <Select value={form.category} onValueChange={(v) => update("category", v)}>
                <SelectTrigger className="rounded-none border-slate-300 focus:ring-[#009EDB] mt-1 bg-white"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[12px] tracking-wide uppercase text-slate-500">Country</label>
              <Input value={form.country} onChange={(e) => update("country", e.target.value)} placeholder="Country of focus" className="rounded-none border-slate-300 focus-visible:ring-[#009EDB] mt-1 bg-white" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[12px] tracking-wide uppercase text-slate-500">Addressed To *</label>
              <Input value={form.target} onChange={(e) => update("target", e.target.value)} placeholder="e.g. United Nations, U.S. Congress, Government of ..." className="rounded-none border-slate-300 focus-visible:ring-[#009EDB] mt-1 bg-white" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[12px] tracking-wide uppercase text-slate-500">Summary *</label>
              <Textarea value={form.summary} onChange={(e) => update("summary", e.target.value)} placeholder="A concise description supporters will see first." className="rounded-none border-slate-300 focus-visible:ring-[#009EDB] mt-1 bg-white min-h-[100px]" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[12px] tracking-wide uppercase text-slate-500">Full Text (optional)</label>
              <Textarea value={form.full_text} onChange={(e) => update("full_text", e.target.value)} placeholder="Optional longer context, data, personal story, proposed action..." className="rounded-none border-slate-300 focus-visible:ring-[#009EDB] mt-1 bg-white min-h-[120px]" />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={creating} className="rounded-none bg-[#009EDB] hover:bg-[#0086b8] text-white h-12 px-6 font-semibold"><PenLine className="w-4 h-4 mr-2" />{creating ? "Creating…" : "Create Petition"}</Button>
            </div>
          </form>
        </div>
      </section>

      <section className="bg-[#0b2c4a] text-white py-16">
        <div className="max-w-[1000px] mx-auto px-6 text-center">
          <div className="text-[11px] tracking-[0.25em] uppercase text-[#7cc3ef] font-semibold">Together, We Speak. Together, We Act.</div>
          <p className="mt-5 font-serif text-2xl md:text-3xl leading-snug">Through collective voices and unified action, AGRF is building a platform where global concerns are heard — and addressed.</p>
        </div>
      </section>

      <Footer />
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default Petitions;
