import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import TopBar from "../components/site/TopBar";
import Header from "../components/site/Header";
import Footer from "../components/site/Footer";
import { Toaster, toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Users, Share2, Copy, Check, ArrowLeft, Globe2, Megaphone } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const PetitionDetail = () => {
  const { slug } = useParams();
  const [petition, setPetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", country: "", comment: "" });
  const [signing, setSigning] = useState(false);
  const [signatures, setSignatures] = useState([]);
  const [copied, setCopied] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [{ data: pet }, { data: sigs }] = await Promise.all([
        axios.get(`${API}/petitions/${slug}`),
        axios.get(`${API}/petitions/${slug}/signatures?limit=12`).catch(() => ({ data: [] }))
      ]);
      setPetition(pet);
      setSignatures(sigs || []);
    } catch {
      setPetition(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [slug]);

  const share = async () => {
    const url = `${window.location.origin}/petitions/${slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: petition?.title || "AGRF Petition", url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Link copied to clipboard.");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch { /* user cancelled */ }
  };

  const sign = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error("Please share your name and email.");
      return;
    }
    setSigning(true);
    try {
      const { data } = await axios.post(`${API}/petitions/${slug}/sign`, form);
      if (data.duplicate) {
        toast.info("You've already signed this petition.");
      } else {
        toast.success("Thank you for signing!");
        if (data.featured_in_newsroom && !petition?.featured_in_newsroom) {
          toast.success("5,000+ signatures reached — this petition will reach policy makers and top global media platforms!");
        }
      }
      setPetition((p) => (p ? { ...p, signature_count: data.signature_count, featured_in_newsroom: data.featured_in_newsroom } : p));
      setForm({ name: "", email: "", country: "", comment: "" });
      load();
    } catch (err) {
      toast.error(err?.response?.data?.detail?.[0]?.msg || "Could not submit signature.");
    } finally {
      setSigning(false);
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
          <Link to="/petitions" className="hover:text-[#009EDB]">Petitions</Link>
          <span className="mx-2">/</span>
          <span className="text-[#0b2c4a]">{petition ? petition.title : slug}</span>
        </div>
      </div>

      {loading ? (
        <div className="max-w-[1400px] mx-auto px-6 py-24 text-slate-500">Loading petition…</div>
      ) : !petition ? (
        <div className="max-w-[1400px] mx-auto px-6 py-24 text-center">
          <Megaphone className="w-10 h-10 text-[#009EDB] mx-auto" />
          <h1 className="font-serif text-3xl text-[#0b2c4a] mt-4">Petition not found</h1>
          <p className="mt-2 text-slate-600">This petition link may have been removed or mistyped.</p>
          <Link to="/petitions" className="mt-6 inline-flex items-center gap-2 text-[#009EDB] font-semibold"><ArrowLeft className="w-4 h-4" /> Back to all petitions</Link>
        </div>
      ) : (
        <>
          <section className="bg-white py-16">
            <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10">
              <div className="md:col-span-7">
                <div className="flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-[#009EDB] font-semibold">
                  <Globe2 className="w-3.5 h-3.5" /> {petition.category}
                </div>
                <h1 className="font-serif text-3xl md:text-5xl text-[#0b2c4a] mt-3 leading-[1.1]">{petition.title}</h1>
                <div className="mt-3 text-slate-600">Addressed to: <span className="text-[#0b2c4a] font-semibold">{petition.target}</span>{petition.country ? ` · ${petition.country}` : ""}</div>
                <p className="mt-6 text-[17px] leading-[1.8] text-slate-700 whitespace-pre-line">{petition.summary}</p>
                {petition.full_text ? (
                  <p className="mt-4 text-[16px] leading-[1.8] text-slate-700 whitespace-pre-line">{petition.full_text}</p>
                ) : null}
                <div className="mt-6 text-[13px] text-slate-500">Started by <span className="text-[#0b2c4a] font-semibold">{petition.creator_name}</span></div>

                {signatures.length > 0 && (
                  <div className="mt-10 border-t border-slate-200 pt-8">
                    <div className="text-[11px] tracking-[0.22em] uppercase text-[#009EDB] font-semibold">Recent Supporters</div>
                    <ul className="mt-4 divide-y divide-slate-100">
                      {signatures.map((s) => (
                        <li key={s.id} className="py-3 flex items-center justify-between text-sm">
                          <div>
                            <span className="text-[#0b2c4a] font-semibold">{s.name}</span>
                            {s.country ? <span className="text-slate-500"> · {s.country}</span> : null}
                          </div>
                          <div className="text-slate-400 text-[12px]">{new Date(s.created_at).toLocaleDateString()}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <aside className="md:col-span-5">
                <div className="bg-[#0b2c4a] text-white p-6">
                  <div className="text-[11px] tracking-[0.22em] uppercase text-[#7cc3ef] font-semibold flex items-center gap-2"><Users className="w-4 h-4" /> Signatures</div>
                  <div className="font-serif text-5xl mt-2">{petition.signature_count.toLocaleString()}</div>
                  <div className="text-white/75 text-sm mt-1">{petition.featured_in_newsroom ? "Reaching policy makers and featured on top media platforms worldwide" : "Goal: 5,000 — to reach policy makers and top global media"}</div>
                  <div className="mt-4 h-2 bg-white/10">
                    <div className="h-full bg-[#009EDB]" style={{ width: `${Math.min(100, (petition.signature_count / 5000) * 100)}%` }} />
                  </div>
                  <button onClick={share} className="mt-5 w-full inline-flex items-center justify-center gap-2 border border-white/30 text-white hover:bg-white hover:text-[#0b2c4a] px-5 py-3 text-sm font-semibold">
                    {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />} {copied ? "Link copied" : "Share petition"}
                  </button>
                  <div className="mt-3 flex items-center gap-2 text-[12px] text-white/70 break-all">
                    <Copy className="w-3 h-3 shrink-0" /> {typeof window !== "undefined" ? `${window.location.origin}/petitions/${petition.slug}` : `/petitions/${petition.slug}`}
                  </div>
                </div>

                <form onSubmit={sign} className="mt-4 bg-white border border-slate-200 p-6">
                  <div className="text-[11px] tracking-[0.22em] uppercase text-[#009EDB] font-semibold">Sign this petition</div>
                  <div className="mt-4 grid grid-cols-1 gap-3">
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name *" className="rounded-none border-slate-300 focus-visible:ring-[#009EDB]" />
                    <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Your email *" className="rounded-none border-slate-300 focus-visible:ring-[#009EDB]" />
                    <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="Country" className="rounded-none border-slate-300 focus-visible:ring-[#009EDB]" />
                    <Textarea value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="Optional note to leaders" className="rounded-none border-slate-300 focus-visible:ring-[#009EDB] min-h-[80px]" />
                  </div>
                  <Button type="submit" disabled={signing} className="mt-4 w-full rounded-none bg-[#009EDB] hover:bg-[#0086b8] text-white h-11 font-semibold">{signing ? "Signing…" : "Sign Petition"}</Button>
                  <div className="mt-3 text-[11px] text-slate-500">Your email is kept private and used only to verify unique signatures.</div>
                </form>
              </aside>
            </div>
          </section>
        </>
      )}

      <Footer />
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default PetitionDetail;
