import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowRight, Star, Crown, Brain } from 'lucide-react';

type Package = { id: string; name: string; description: string; price: number; original_price: number; contents: string[]; is_featured: boolean };
type Skin = { id: string; name: string; hero_name: string; description: string; price: number; rarity: string };
type Consultation = { id: string; service_name: string; description: string; price: number; category: string; duration_minutes: number };

export default function FeaturedItems() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [skins, setSkins] = useState<Skin[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  useEffect(() => {
    (async () => {
      const [{ data: pkgs }, { data: sks }, { data: cons }] = await Promise.all([
        supabase.from('packages').select('*').eq('is_featured', true).order('sort_order').limit(2),
        supabase.from('skins').select('*').eq('is_featured', true).order('sort_order').limit(3),
        supabase.from('consultations').select('*').eq('is_featured', true).order('sort_order').limit(1),
      ]);
      if (pkgs) setPackages(pkgs);
      if (sks) setSkins(sks);
      if (cons) setConsultations(cons);
    })();
  }, []);

  return (
    <section className="py-24 relative">
      <div className="container-game">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-crimson-400 tracking-wider uppercase">Featured Items</span>
          <h2 className="heading-display text-3xl md:text-5xl font-bold text-white mt-2">Top Picks This Week</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="card-game p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-crimson-900/20 border border-crimson-700/30 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-gold-400" />
                </div>
                <span className="text-xs font-semibold text-crimson-400 uppercase tracking-wider">Package</span>
              </div>
              <h3 className="heading-display text-lg font-bold text-white mb-2">{pkg.name}</h3>
              <p className="text-sm text-gray-400 mb-4 flex-1">{pkg.description}</p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="heading-display text-2xl font-bold text-gold-300">${pkg.price}</span>
                {pkg.original_price && pkg.original_price > pkg.price && (
                  <span className="text-sm text-gray-600 line-through">${pkg.original_price}</span>
                )}
              </div>
              <Link to="/packages" className="btn-primary text-sm py-2.5">View Package <ArrowRight className="w-4 h-4" /></Link>
            </div>
          ))}

          {skins.map((skin) => (
            <div key={skin.id} className="card-game p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-crimson-900/20 border border-crimson-700/30 flex items-center justify-center">
                  <Star className="w-5 h-5 text-gold-400" />
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${rarityClass(skin.rarity)}`}>{skin.rarity}</span>
              </div>
              <h3 className="heading-display text-lg font-bold text-white mb-1">{skin.name}</h3>
              <p className="text-sm text-crimson-400 mb-3">{skin.hero_name}</p>
              <p className="text-sm text-gray-400 mb-4 flex-1">{skin.description}</p>
              <div className="flex items-center justify-between">
                <span className="heading-display text-xl font-bold text-gold-300">${skin.price}</span>
                <Link to="/skins" className="btn-outline text-sm py-2 px-4">View Skins</Link>
              </div>
            </div>
          ))}

          {consultations.map((con) => (
            <div key={con.id} className="card-game p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-crimson-900/20 border border-crimson-700/30 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-gold-400" />
                </div>
                <span className="text-xs font-semibold text-crimson-400 uppercase tracking-wider">{con.category}</span>
              </div>
              <h3 className="heading-display text-lg font-bold text-white mb-2">{con.service_name}</h3>
              <p className="text-sm text-gray-400 mb-4 flex-1">{con.description}</p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="heading-display text-xl font-bold text-gold-300">${con.price}</span>
                  <span className="text-xs text-gray-500 ml-2">{con.duration_minutes} min</span>
                </div>
                <Link to="/guides" className="btn-outline text-sm py-2 px-4">Learn More</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function rarityClass(rarity: string) {
  const map: Record<string, string> = {
    Common: 'badge-rarity-Common',
    Rare: 'badge-rarity-Rare',
    Epic: 'badge-rarity-Epic',
    Legendary: 'badge-rarity-Legendary',
  };
  return map[rarity] || map.Common;
}
