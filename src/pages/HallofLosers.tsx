import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {  Skull, Frown, Siren, Quote, Flag, Phone , Crown, Trash2, ChevronDown } from 'lucide-react';
import type { HallOfLoser } from '../lib/types';
import { Loader } from '../components/LoadingSpinner';
const shameLabel = (score: number) => {
  if (score >= 90) return 'Legendary Disaster';
  if (score >= 70) return 'Certified Menace';
  if (score >= 40) return 'Amateur Hour';
  return 'Minor Embarrassment';
};

export default function HallOfLosers() {
  const [entries, setEntries] = useState<HallOfLoser[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('hall_of_losers')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('sort_order');
      if (data) setEntries(data as HallOfLoser[]);
      setLoading(false);
    })();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Loader className="w-8 h-8 text-fuchsia-400 animate-spin" />
      </div>
    );

  return (
    <div className="pt-20 pb-24 min-h-screen relative overflow-hidden">
      {/* Ambient background flair */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-fuchsia-900/10 blur-3xl" />

      <div className="container-game relative">
        <div className="text-center mb-12 mt-8">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-fuchsia-400 tracking-wider uppercase">
            <Siren className="w-4 h-4" /> Wall of Shame
          </span>
          <h1 className="heading-display text-4xl md:text-6xl font-bold text-white mt-2 mb-4">
            Hall of Losers
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A permanent, lovingly-maintained shrine to the rage-quitters, farm-hoarders, and F2P
            "whales" who embarrassed themselves on the battlefield. Nominations accepted. Mercy is not.
          </p>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Frown className="w-10 h-10 mx-auto mb-3 text-fuchsia-500/40" />
            No losers on record yet. Give it time.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
            {entries.map((entry, index) => {
              const isOpen = expandedId === entry.id;
              return (
                <div key={entry.id} className="relative pt-8">
                  {entry.shame_score > 90 && (
                    <img
                      src="/crown.png"
                      alt="Rusty crown"
                      className="absolute -top-8 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-58 h-48 object-contain pointer-events-none drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]"
                    />
                  )}

                  <div
                    className={`relative rounded-2xl overflow-hidden group backdrop-blur-xl bg-gradient-to-br from-black/70 via-slate-900/60 to-fuchsia-950/50 border transition-all duration-300 shadow-lg hover:-translate-y-1 ${
                      entry.is_featured
                        ? 'border-fuchsia-400/60 shadow-fuchsia-900/30'
                        : 'border-fuchsia-500/20 hover:border-fuchsia-400/50'
                    }`}
                  >
                  {/* Photo + booking-style overlays */}
                  <div className="relative h-52 bg-black/40 flex items-center justify-center overflow-hidden">
                    {entry.photo_url ? (
                      <img
                        src={entry.photo_url}
                        alt={entry.ign}
                        className="absolute inset-0 w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-fuchsia-500/40">
                        <Skull className="w-10 h-10" />
                        <span className="text-xs">No mugshot on file</span>
                      </div>
                    )}

                    {/* Loser number badge */}
                    <div
                      className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-md bg-black/70 border border-fuchsia-400/40 text-fuchsia-200 text-xs font-bold tracking-wider"
                      style={{ fontFamily: '"Cinzel", Georgia, serif' }}
                    >
                      LOSER #{String(index + 1).padStart(3, '0')}
                    </div>

                    {entry.is_featured && (
                      <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-fuchsia-400/50 bg-fuchsia-500/20 text-fuchsia-200 flex items-center gap-1">
                        <Crown className="w-3 h-3" /> Hall of Infamy
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent" />
                  </div>

                  {/* Name / Kingdom header — clearly separated from the rest */}
                  <div className="px-5 pt-4 pb-3 border-b border-white/10 flex items-center justify-between gap-3">
                    <h3 className="heading-display text-xl font-bold text-white truncate min-w-0">{entry.ign}</h3>
                    {entry.kingdom && (
                      <span className="flex-shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-crimson-950/40 border-2 border-crimson-500/70 text-sm font-bold text-crimson-200">
                        <Flag className="w-4 h-4 text-crimson-400" /> {entry.kingdom}
                      </span>
                    )}
                  </div>

                  <div className="p-5 pt-4">
                    <div className="inline-flex items-center gap-1.5 mb-4 px-3.5 py-3.5 rounded-full text-xs font-semibold border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300">
                      <Trash2 className="w-3 h-3" /> {entry.title}
                      
                    </div>
                       {entry.quote && (
                      <div className="flex items-start gap-2 mb-4 rounded-lg bg-black/30 border border-white/5 px-3 py-2">
                        <Phone className="w-3.5 h-3.5 text-fuchsia-500/60 flex-shrink-0 mt-0.5" />
                        <p className="text-x text-green-400 bold leading-relaxed">{entry.number}</p>
                      </div>
                    )}
                    {entry.quote && (
                      <div className="flex items-start gap-2 mb-4 rounded-lg bg-black/30 border border-white/5 px-3 py-2">
                        <Quote className="w-3.5 h-3.5 text-fuchsia-500/60 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-400 bold leading-relaxed">{entry.quote}</p>
                      </div>
                    )}

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] uppercase tracking-wider text-gray-500">Shame Meter</span>
                        <span className="text-[11px] font-semibold text-fuchsia-300">{shameLabel(entry.shame_score)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-crimson-500"
                          style={{ width: `${Math.min(100, Math.max(0, entry.shame_score))}%` }}
                        />
                      </div>
                    </div>

                    {/* Crime — moved to bottom as a collapsible evidence dropdown */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setExpandedId(isOpen ? null : entry.id)}
                        aria-expanded={isOpen}
                        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-full bg-crimson-600 hover:bg-crimson-500 border border-crimson-400/50 transition-colors shadow-md shadow-crimson-900/40"
                      >
                        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white font-bold">
                          <Skull className="w-4 h-4" /> View Crime
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {isOpen && (
                        <div className="mt-2 rounded-lg bg-black/30 border border-crimson-600/30 px-3 py-3 space-y-3">
                          <div>
                            <span className="block text-[10px] uppercase tracking-widest text-crimson-400 font-semibold mb-1">
                              Charge / Crime
                            </span>
                            <p className="text-sm text-gray-300 leading-relaxed">{entry.crime}</p>
                          </div>

                         {entry.evidence_photos && (
  <img
    src={entry.evidence_photos}
    alt={`${entry.ign} crime evidence`}
    className="max-w-full h-auto w-auto rounded-md border border-white/10 mx-auto"
  />
)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-center text-xs text-gray-600 mt-14 max-w-xl mx-auto">
          All entries are satire, submitted for entertainment purposes by the community. Think you don't
          belong here? Prove it on the battlefield.
        </p>
      </div>
    </div>
  );
}