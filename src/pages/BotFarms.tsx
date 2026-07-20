import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { Loader, PlayCircle, ShoppingCart, Check, Minus, Plus, Bot, Infinity as InfinityIcon } from 'lucide-react';
import VideoModal from '../components/VideoModal';
import { getYouTubeId } from '../lib/youtube';

type BotFarmSettings = {
  id: string;
  price: number;
  video_url: string | null;
};

export default function BotFarms() {
  const { addItem } = useCart();
  const [settings, setSettings] = useState<BotFarmSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('bot_farm_settings').select('*').limit(1).maybeSingle();
      if (data) setSettings(data as BotFarmSettings);
      setLoading(false);
    })();
  }, []);

  const price = settings ? Number(settings.price) : 0;
  const total = price * quantity;

  const setQty = (n: number) => setQuantity(Math.max(1, n));

  const handleAddToCart = async () => {
    if (!settings) return;
    await addItem({
      item_type: 'bot_farm',
      item_id: settings.id,
      name: 'Bot Farm',
      description: `${quantity} bot farm${quantity !== 1 ? 's' : ''}`,
      price,
      quantity,
      metadata: {},
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Loader className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );

  return (
    <div className="pt-20 pb-24 min-h-screen">
      <div className="container-game">
        <div className="text-center mb-12 mt-8">
          <span className="text-sm font-semibold text-crimson-400 tracking-wider uppercase">Automation</span>
          <h1 className="heading-display text-4xl md:text-6xl font-bold text-white mt-2 mb-4">Bot Farms</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Buy as many bot farms as you need — always in stock, no limits.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="rounded-2xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-black/70 via-slate-900/60 to-blue-950/50 border border-white/10 shadow-lg">
            <div className="relative h-48 bg-black/40 flex items-center justify-center">
              <Bot className="w-16 h-16 text-blue-400/50" />
              <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border border-blue-400/40 bg-blue-500/10 text-blue-200">
                <InfinityIcon className="w-3.5 h-3.5" /> Unlimited Stock
              </div>
            </div>

            <div className="p-6">
              <h3 className="heading-display text-xl font-bold text-white mb-1">Bot Farm</h3>
              <p className="text-sm text-gray-400 mb-5">
                Automated farming account. Each unit is delivered and set up individually after purchase.
              </p>

              <button
                onClick={() => {
                  if (!settings?.video_url) return;
                  if (getYouTubeId(settings.video_url)) {
                    setShowVideo(true);
                  } else {
                    window.open(settings.video_url, '_blank', 'noopener,noreferrer');
                  }
                }}
                disabled={!settings?.video_url}
                className="w-full mb-5 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 active:scale-95 bg-white/5 border border-white/10 text-gray-200 hover:border-blue-400/40 hover:bg-blue-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ fontFamily: '"Cinzel", Georgia, serif' }}
              >
                <PlayCircle className="w-4 h-4" />
                View Video
              </button>

              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-400">Number of Farms</span>
                <span className="text-xs text-gray-500">${price.toFixed(2)} / farm</span>
              </div>

              <div className="flex items-center justify-center gap-3 mb-5">
                <button
                  onClick={() => setQty(quantity - 1)}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:border-blue-400/40 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={e => setQty(parseInt(e.target.value, 10) || 1)}
                  className="w-20 text-center rounded-lg px-3 py-2 bg-black/30 backdrop-blur border border-white/10 text-white font-semibold focus:outline-none focus:border-blue-400/50"
                />
                <button
                  onClick={() => setQty(quantity + 1)}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:border-blue-400/40 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between mb-5 pt-4 border-t border-white/10">
                <span className="text-white font-semibold">Total</span>
                <span className="heading-display text-2xl font-bold text-blue-300">${total.toFixed(2)}</span>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full inline-flex items-center justify-center gap-3 pl-6 pr-2 py-2 rounded-full font-semibold transition-all duration-200 active:scale-95 bg-blue-400 hover:bg-blue-300"
              >
                <span className="text-sm text-slate-950" style={{ fontFamily: '"Cinzel", Georgia, serif' }}>
                  {added ? 'Added to Cart' : 'Add to Cart'}
                </span>
                <span className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center flex-shrink-0">
                  {added ? <Check className="w-4 h-4 text-white" /> : <ShoppingCart className="w-4 h-4 text-white" />}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showVideo && settings?.video_url && (
        <VideoModal
          url={settings.video_url}
          title="Bot Farm"
          onClose={() => setShowVideo(false)}
          accent="blue"
        />
      )}
    </div>
  );
}