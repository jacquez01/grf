import React from "react";
import { contactInfo, siteInfo, navItems } from "../../data/mock";
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#081f35] text-white">
      <div className="max-w-[1400px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#009EDB] flex items-center justify-center">
              <svg viewBox="0 0 64 64" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="32" cy="32" r="26" />
                <ellipse cx="32" cy="32" rx="13" ry="26" />
                <path d="M6 32h52M10 18h44M10 46h44" />
              </svg>
            </div>
            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-[#7cc3ef]">America</div>
              <div className="font-serif text-lg">Global Relations Foundation</div>
            </div>
          </div>
          <p className="mt-5 text-sm text-white/70 leading-relaxed">{siteInfo.tagline}</p>
          <div className="mt-6 flex items-center gap-2">
            {[Facebook, Twitter, Instagram, Youtube, Linkedin].map((I, i) => (
              <a key={i} href="#" className="w-9 h-9 border border-white/25 hover:bg-[#009EDB] hover:border-[#009EDB] flex items-center justify-center" aria-label="social">
                <I className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
        <div className="md:col-span-5 grid grid-cols-2 gap-6">
          {navItems.slice(0, 6).map((n) => (
            <div key={n.label}>
              <div className="text-[11px] tracking-[0.22em] uppercase text-[#7cc3ef] font-semibold">{n.label}</div>
              <ul className="mt-3 space-y-2 text-sm text-white/75">
                {n.children.slice(0, 4).map((c) => (
                  <li key={c}><a href={n.anchor} className="hover:text-white">{c}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="md:col-span-3">
          <div className="text-[11px] tracking-[0.22em] uppercase text-[#7cc3ef] font-semibold">Contact</div>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li>Secretary General: <a href={`tel:${contactInfo.secretaryGeneral}`} className="hover:text-white">{contactInfo.secretaryGeneral}</a></li>
            <li>Office: <a href={`tel:${contactInfo.office}`} className="hover:text-white">{contactInfo.office}</a></li>
            <li>Africa: <a href={`tel:${contactInfo.africa}`} className="hover:text-white">{contactInfo.africa}</a></li>
            <li>Email: <a href={`mailto:${contactInfo.email}`} className="hover:text-white">{contactInfo.email}</a></li>
            <li className="text-white/60">{contactInfo.address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <div>&copy; {new Date().getFullYear()} America Global Relations Foundation. A chapter of Global Relations Foundation.</div>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Accessibility</a>
            <a href="#" className="hover:text-white">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
