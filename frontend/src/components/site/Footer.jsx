import React from "react";
import { Link } from "react-router-dom";
import { contactInfo, siteInfo, navItems, LOGO_URL, CHARITY_ID, socialLinks } from "../../data/mock";
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#081f35] text-white">
      <div className="max-w-[1400px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="America Global Relations Foundation" className="w-12 h-12 object-contain rounded-full bg-white" />
            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-[#7cc3ef]">America</div>
              <div className="font-serif text-lg">Global Relations Foundation</div>
            </div>
          </div>
          <p className="mt-5 text-sm text-white/70 leading-relaxed">{siteInfo.tagline}</p>
          <div className="mt-6 flex items-center gap-2">
            {[
              { Icon: Facebook, href: socialLinks.facebook, label: "Facebook" },
              { Icon: Twitter, href: socialLinks.twitter, label: "Twitter" },
              { Icon: Instagram, href: socialLinks.instagram, label: "Instagram" },
              { Icon: Youtube, href: socialLinks.youtube, label: "YouTube" },
              { Icon: Linkedin, href: socialLinks.linkedin, label: "LinkedIn" }
            ].map(({ Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" className="w-9 h-9 border border-white/25 hover:bg-[#009EDB] hover:border-[#009EDB] flex items-center justify-center" aria-label={label}>
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
        <div className="md:col-span-5 grid grid-cols-2 gap-6">
          {navItems.slice(0, 6).map((n) => (
            <div key={n.label}>
              <div className="text-[11px] tracking-[0.22em] uppercase text-[#7cc3ef] font-semibold">{n.label}</div>
              <ul className="mt-3 space-y-2 text-sm text-white/75">
                {n.children.slice(0, 4).map((c) => {
                  const href = typeof c === "string" ? n.anchor : c.href;
                  const label = typeof c === "string" ? c : c.label;
                  return <li key={label}><a href={href} className="hover:text-white">{label}</a></li>;
                })}
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
      <div className="border-t border-white/10 bg-[#061a2c]">
        <div className="max-w-[1400px] mx-auto px-6 py-3 text-center">
          <div className="text-[10px] tracking-[0.22em] uppercase text-[#7cc3ef]/80 font-semibold">Registered Charity</div>
          <div className="mt-1 text-[11px] md:text-[12px] text-white/70 leading-relaxed">
            {CHARITY_ID}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <div>&copy; {new Date().getFullYear()} America Global Relations Foundation. A chapter of Global Relations Foundation.</div>
          <div className="flex items-center gap-5">
            <Link to="/youth-succeed-center" className="hover:text-white">Youth Succeed Center</Link>
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
