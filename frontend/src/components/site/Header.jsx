import React, { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { navItems, LOGO_URL, DONATION_URL } from "../../data/mock";
import { Button } from "../ui/button";

const Logo = () => (
  <Link to="/" className="flex items-center gap-3 group shrink-0">
    <img src={LOGO_URL} alt="America Global Relations Foundation" className="w-10 h-10 md:w-11 md:h-11 object-contain rounded-full bg-white ring-1 ring-slate-200 shrink-0" />
    <div className="leading-tight hidden sm:block">
      <div className="text-[10px] tracking-[0.22em] uppercase text-[#0b2c4a]/70 font-semibold">America</div>
      <div className="text-[14px] xl:text-[15px] font-serif font-semibold text-[#0b2c4a] whitespace-nowrap">Global Relations Foundation</div>
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
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 md:px-6 gap-4 py-3">
        <Logo />
        <nav className="hidden xl:flex items-center gap-0.5 flex-1 justify-center">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setHovered(item.label)}
              onMouseLeave={() => setHovered(null)}
            >
              <NavLink
                anchor={item.anchor}
                className="flex items-center gap-1 px-2.5 py-2 text-[13px] font-medium text-[#0b2c4a] hover:text-[#009EDB] transition-colors whitespace-nowrap"
              >
                {item.label}
                <ChevronDown className="w-3 h-3 opacity-70" />
              </NavLink>
              {hovered === item.label && (
                <div className="absolute top-full left-0 mt-0 min-w-[240px] bg-white border border-slate-200 shadow-lg py-2 z-50">
                  {item.children.map((c) => {
                    const href = typeof c === "string" ? item.anchor : c.href;
                    const label = typeof c === "string" ? c : c.label;
                    return (
                      <NavLink
                        key={label}
                        anchor={href}
                        className="block px-4 py-2 text-[13px] text-slate-700 hover:bg-[#009EDB]/10 hover:text-[#009EDB] border-l-2 border-transparent hover:border-[#009EDB]"
                      >
                        {label}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <Button variant="outline" className="border-[#009EDB] text-[#009EDB] hover:bg-[#009EDB] hover:text-white rounded-none h-10 text-[13px]" asChild>
            <NavLink anchor="/careers">Volunteer</NavLink>
          </Button>
          <Button className="bg-[#009EDB] hover:bg-[#0086b8] text-white rounded-none h-10 font-semibold text-[13px]" asChild>
            <a href={DONATION_URL} target="_blank" rel="noreferrer">Partner</a>
          </Button>
        </div>
        <button className="xl:hidden text-[#0b2c4a]" onClick={() => setOpen(!open)} aria-label="menu">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {open && (
        <div className="xl:hidden bg-white border-t border-slate-200">
          <div className="px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto">
            {navItems.map((item) => (
              <details key={item.label} className="border-b border-slate-100">
                <summary className="py-2.5 px-2 text-[#0b2c4a] font-medium cursor-pointer flex items-center justify-between">
                  <span>{item.label}</span>
                  <ChevronDown className="w-4 h-4" />
                </summary>
                <div className="pb-2 pl-4">
                  {item.children.map((c) => {
                    const href = typeof c === "string" ? item.anchor : c.href;
                    const label = typeof c === "string" ? c : c.label;
                    return (
                      <NavLink key={label} anchor={href} className="block py-1.5 text-[13px] text-slate-600 hover:text-[#009EDB]">
                        {label}
                      </NavLink>
                    );
                  })}
                </div>
              </details>
            ))}
            <div className="flex gap-2 pt-3">
              <Button variant="outline" className="flex-1 rounded-none border-[#009EDB] text-[#009EDB]" asChild><NavLink anchor="/careers">Volunteer</NavLink></Button>
              <Button className="flex-1 rounded-none bg-[#009EDB] text-white" asChild><a href={DONATION_URL} target="_blank" rel="noreferrer">Partner</a></Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
