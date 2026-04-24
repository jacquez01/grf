import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ArrowRight, Users } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const FeaturedPetitions = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get(`${API}/petitions?featured=true`).then(({ data }) => setItems(data || [])).catch(() => setItems([]));
  }, []);

  if (!items.length) return null;
  return (
    <div className="max-w-[1400px] mx-auto px-6 mt-8">
      <div className="border-l-4 border-[#009EDB] bg-[#f4f7fa] p-6 md:p-7">
        <div className="text-[11px] tracking-[0.22em] uppercase text-[#009EDB] font-semibold">Trending Petitions · 5,000+ Signatures reaching policy makers & global media</div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.slice(0, 6).map((p) => (
            <Link to={`/petitions/${p.slug}`} key={p.id} className="group block bg-white border border-slate-200 p-5 hover:border-[#009EDB] transition-colors">
              <div className="text-[11px] tracking-[0.18em] uppercase text-[#0b2c4a]/60 font-semibold">{p.category}</div>
              <div className="font-serif text-lg text-[#0b2c4a] mt-2 leading-tight group-hover:text-[#009EDB] line-clamp-2">{p.title}</div>
              <div className="mt-3 flex items-center justify-between text-[12px] text-slate-500">
                <span className="inline-flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-[#009EDB]" /> {p.signature_count.toLocaleString()}+ signed</span>
                <span className="inline-flex items-center gap-1 text-[#009EDB] font-semibold">Sign <ArrowRight className="w-3.5 h-3.5" /></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedPetitions;
