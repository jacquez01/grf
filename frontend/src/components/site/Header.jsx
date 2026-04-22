import React, { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { navItems, LOGO_URL, DONATION_URL } from "../../data/mock";
import { Button } from "../ui/button";

const Logo = () => (
  <Link to="/" className="flex items-center gap-3 group">
    <img src={LOGO_URL} alt="America Global Relations Foundation" className="w-12 h-12 object-contain rounded-full bg-white ring-1 ring-slate-200" />
    <div className="leading-tight">
      <div className="text-[11px] tracking-[0.22em] uppercase text-[#0b2c4a]/70 font-semibold">America</div>
      <div className="text-[17px] md:text-[19px] font-serif font-semibold text-[#0b2c4a]">Global Relations Foundation</div>
    </div>
  </Link>
);

// Build an href that works from any page: hash links resolve back to home
const useResolvedHref = () => {
  const { pathname } = useLocation();
  return (anchor) => {
    if (!anchor) return "/";
    if (anchor.startsWith("/")) return anchor;
    if (anchor.startsWith("#")) return pathname === "/" ? anchor : "/" + anchor;
    return anchor;
  };
};

const NavLink = ({ anchor, children, className }) => {
  const resolve = useResolvedHref();
  const href = resolve(anchor);
  if (anchor?.startsWith("/")) {
    return <Link to={href} className={className}>{children}</Link>;
  }
  return <a href={href} className={className}>{children}</a>;
};

const Header = () => {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-[0_1px_0_0_rgba(0,0,0,0.02)]">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-3">
        <Logo />
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setHovered(item.label)}
              onMouseLeave={() => setHovered(null)}
            >
              <NavLink
                anchor={item.anchor}
                className="flex items-center gap-1 px-3 py-2 text-[14px] font-medium text-[#0b2c4a] hover:text-[#009EDB] transition-colors"
              >
                {item.label}
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </NavLink>
              {hovered === item.label && (
                <div className="absolute top-full left-0 mt-0 min-w-[220px] bg-white border border-slate-200 shadow-lg py-2 z-50">
                  {item.children.map((c) => (
                    <NavLink
                      key={c}
                      anchor={item.anchor}
                      className="block px-4 py-2 text-[13px] text-slate-700 hover:bg-[#009EDB]/10 hover:text-[#009EDB] border-l-2 border-transparent hover:border-[#009EDB]"
                    >
                      {c}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <Button variant="outline" className="border-[#009EDB] text-[#009EDB] hover:bg-[#009EDB] hover:text-white rounded-none h-10" asChild>
            <NavLink anchor="#get-involved">Volunteer</NavLink>
          </Button>
          <Button className="bg-[#009EDB] hover:bg-[#0086b8] text-white rounded-none h-10 font-semibold" asChild>
            <a href={DONATION_URL} target="_blank" rel="noreferrer">Partner</a>
          </Button>
        </div>
        <button className="lg:hidden text-[#0b2c4a]" onClick={() => setOpen(!open)} aria-label="menu">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden bg-white border-t border-slate-200">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <NavLink key={item.label} anchor={item.anchor} className="block py-2 px-2 text-[#0b2c4a] font-medium border-b border-slate-100">
                {item.label}
              </NavLink>
            ))}
            <div className="flex gap-2 pt-3">
              <Button variant="outline" className="flex-1 rounded-none border-[#009EDB] text-[#009EDB]" asChild><NavLink anchor="#get-involved">Volunteer</NavLink></Button>
              <Button className="flex-1 rounded-none bg-[#009EDB] text-white" asChild><a href={DONATION_URL} target="_blank" rel="noreferrer">Partner</a></Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
