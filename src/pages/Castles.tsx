import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { Loader, ImageOff, ArrowUpRight, Ticket, Zap, Flag, LayoutGrid, PlayCircle, ShoppingCart, Check } from 'lucide-react';
import VideoModal from '../components/VideoModal';
import { getYouTubeId } from '../lib/youtube';

type CastleListing = {
  id: string;
  title: string;
  kingdom: string | null;
  castle_level: string | null;
  power: number | null;
  price: number;
  description: string | null;
  highlights: string[] | null;
  cover_image_url: string | null;
  video_url: string | null;
  status: string;
  is_featured: boolean;
};

const statusFilters = ['All', 'Available', 'Sold'];

export default function Castles() {
  const { addItem } = useCart();
  const [items, setItems] = useState<CastleListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [videoModal, setVideoModal] = useState<{ url: string; title: string } | null>(null);
  const [added, setAdded] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('castle_listings')
        .select('*')
        .order('sort_order');
      if (data) setItems(data as CastleListing[]);
      setLoading(false);
    })();
  }, []);

  const handleAddToCart = async (listing: CastleListing) => {
    if (listing.status !== 'available') return;
    await addItem({
      item_type: 'castle',
      item_id: listing.id,
      name: listing.title,
      description: listing.description,
      price: Number(listing.price),
      quantity: 1,
      metadata: { kingdom: listing.kingdom, castle_level: listing.castle_level, power: listing.power },
    });
    setAdded(listing.id);
    setTimeout(() => setAdded(null), 2000);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Loader className="w-8 h-8 text-green-400 animate-spin" />
      </div>
    );

  const filtered = items.filter(c => {
    if (filter === 'All') return true;
    if (filter === 'Available') return c.status === 'available' || c.status === 'pending';
    if (filter === 'Sold') return c.status === 'sold';
    return true;
  });

  return (
    <div className="pt-20 pb-24 min-h-screen">
      <div className="container-game">
        <div className="text-center mb-12 mt-8">
          <span className="text-sm font-semibold text-green-400 tracking-wider uppercase">Account Marketplace</span>
          <h1 className="heading-display text-4xl md:text-6xl font-bold text-white mt-2 mb-4">Buy / Sell Castles</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Browse established accounts up for sale, or list your own through a Discord ticket.
          </p>
        </div>

        {/* Sell CTA */}
        <div className="max-w-3xl mx-auto mb-12 rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-black/70 via-slate-900/60 to-green-950/50 border border-green-500/30 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-white/5 border border-green-500/30 backdrop-blur flex items-center justify-center flex-shrink-0">
              <Ticket className="w-5 h-5 text-green-300" />
            </div>
            <div className="flex-1">
              <h3 className="heading-display text-lg font-bold text-white mb-1">Want to Sell Your Account?</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                Accounts are listed manually after we verify them. To list your castle, join our Discord and open a
                ticket — the same process used for buying packages. Follow the steps on our Packages page to see
                exactly how to create a ticket.
              </p>
              <Link
                to="/packages"
                className="inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full font-semibold text-sm transition-all duration-200 active:scale-95 bg-green-400 hover:bg-green-300 text-slate-950"
                style={{ fontFamily: '"Cinzel", Georgia, serif' }}
              >
                How to Create a Ticket
                <span className="w-7 h-7 rounded-full bg-green-700 flex items-center justify-center">
                  <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {statusFilters.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all border ${filter === s ? 'bg-green-900/20 border-green-500/50 text-green-300' : 'border-white/10 text-gray-400 hover:text-white hover:border-white/20'}`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(listing => {
            const sold = listing.status === 'sold';
            const pending = listing.status === 'pending';

            return (
              <div
                key={listing.id}
                className={`rounded-2xl overflow-hidden group backdrop-blur-xl bg-gradient-to-br from-black/70 via-slate-900/60 to-green-950/50 border border-green-500/20 hover:border-green-400/50 transition-all duration-300 shadow-lg ${sold ? 'opacity-60' : ''}`}
              >
                <div className="relative h-48 bg-black/40 flex items-center justify-center overflow-hidden">
                  {listing.cover_image_url ? (
                    <img
                      src={listing.cover_image_url}
                      alt={listing.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-green-500/40">
                      <ImageOff className="w-8 h-8" />
                      <span className="text-xs">No cover image</span>
                    </div>
                  )}

                  {listing.is_featured && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold border border-green-400/50 bg-green-500/20 text-green-200 z-10">
                      Featured
                    </div>
                  )}

                  {(sold || pending) && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center z-20">
                      <span className="heading-display text-lg font-bold uppercase tracking-wider px-3 py-1 rounded border bg-black/70 border-white/20 text-white">
                        {sold ? 'Sold' : 'Pending'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="heading-display text-lg font-bold text-white mb-1">{listing.title}</h3>

                  <div className="flex flex-wrap gap-3 mb-3 text-xs text-gray-400">
                    {listing.kingdom && (
                      <span className="inline-flex items-center gap-1">
                        <Flag className="w-3.5 h-3.5 text-green-400" /> {listing.kingdom}
                      </span>
                    )}
                    {listing.castle_level && (
                      <span className="inline-flex items-center gap-1">
                        <LayoutGrid className="w-3.5 h-3.5 text-green-400" /> Level {listing.castle_level}
                      </span>
                    )}
                    {listing.power != null && (
                      <span className="inline-flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-green-400" /> {listing.power.toLocaleString()} Power
                      </span>
                    )}
                  </div>

                  {listing.description && (
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{listing.description}</p>
                  )}

                  {listing.highlights && listing.highlights.length > 0 && (
                    <ul className="mb-4 space-y-1">
                      {listing.highlights.slice(0, 3).map((h, i) => (
                        <li key={i} className="text-xs text-gray-500 flex items-start gap-1.5">
                          <span className="text-green-400 mt-0.5">•</span> {h}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex items-center justify-between mt-2 mb-3">
                    <span className="heading-display text-xl font-bold text-green-300">${listing.price}</span>

                    {listing.video_url ? (
                      <button
                        onClick={() => {
                          if (getYouTubeId(listing.video_url)) {
                            setVideoModal({ url: listing.video_url!, title: listing.title });
                          } else {
                            window.open(listing.video_url!, '_blank', 'noopener,noreferrer');
                          }
                        }}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200 active:scale-95 bg-green-500 hover:bg-green-400 text-slate-950"
                        style={{ fontFamily: '"Cinzel", Georgia, serif' }}
                      >
                        <PlayCircle className="w-4 h-4" />
                        View Video
                      </button>
                    ) : (
                      <span className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full font-semibold text-sm bg-green-500/20 text-green-500/40 cursor-not-allowed">
                        <PlayCircle className="w-4 h-4" />
                        View Video
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(listing)}
                    disabled={listing.status !== 'available'}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 active:scale-95 bg-white/5 border border-green-500/30 text-green-200 hover:border-green-400/60 hover:bg-green-500/10 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-green-500/30 disabled:hover:bg-white/5"
                    style={{ fontFamily: '"Cinzel", Georgia, serif' }}
                  >
                    {added === listing.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        {listing.status === 'available' ? 'Add to Cart' : listing.status === 'sold' ? 'Sold Out' : 'Pending Sale'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No castle listings found.
          </div>
        )}
      </div>

      {videoModal && (
        <VideoModal
          url={videoModal.url}
          title={videoModal.title}
          onClose={() => setVideoModal(null)}
          accent="green"
        />
      )}
    </div>
  );
}