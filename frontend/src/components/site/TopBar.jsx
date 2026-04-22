import React from "react";
import { Globe, Search, ChevronDown } from "lucide-react";
import { contactInfo } from "../../data/mock";

const TopBar = () => {
  return (
    <div className="w-full bg-[#0b2c4a] text-white text-[12px]">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 h-9">
        <div className="hidden md:flex items-center gap-5 tracking-wide">
          <span className="opacity-80">Welcome to AGRF</span>
          <span className="h-3 w-px bg-white/20" />
          <a className="hover:text-[#7cc3ef]" href="#news">Newsroom</a>
          <a className="hover:text-[#7cc3ef]" href="#academic">Academic</a>
          <a className="hover:text-[#7cc3ef]" href="#careers">Careers</a>
          <a className="hover:text-[#7cc3ef]" href="#contact">Contact</a>
        </div>
        <div className="flex items-center gap-5 ml-auto">
          <a href={`tel:${contactInfo.office}`} className="hidden md:inline opacity-80 hover:text-[#7cc3ef]">Office: {contactInfo.office}</a>
          <button className="flex items-center gap-1 opacity-90 hover:text-[#7cc3ef]">
            <Globe className="w-3.5 h-3.5" />
            <span>English</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          <button className="flex items-center gap-1 opacity-90 hover:text-[#7cc3ef]">
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
