import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { PlayCircle, ShoppingCart, Check, Minus, Plus, Bot, Infinity as InfinityIcon } from 'lucide-react';
import VideoModal from '../components/VideoModal';
import { getYouTubeId } from '../lib/youtube';
import { Loader } from '../components/LoadingSpinner';

type BotFarmType = 'normal' | 'autoshield';

type BotFarmSettings = {
  id: string;
  type: BotFarmType;
  price: number;
  video_url: string | null;
};

const FARM_CONFIG: Record<BotFarmType, { title: string; description: string; accent: 'blue' | 'green'; features: string[] }> = {
  normal: {
    title: 'Bot Farm',
    description: 'Automated farming account. Gathers resources and upgrades the farm continuously.',
    accent: 'blue',
    features: ['Auto-gathers resources', 'Auto-upgrades farm', 'Cheap'],
  },
  autoshield: {
    title: 'Autoshield Bot Farm',
    description: 'Everything the standard farm does, plus automatic shielding when under attack.',
    accent: 'green',
    features: ['Auto-gathers resources', 'Auto-upgrades farm', 'Auto-shields on attack'],
  },
};

function FarmCard({
  type,
  settings,
  onAdded,
}: {
  type: BotFarmType;
  settings: BotFarmSettings | undefined;
  onAdded: () => void;
}) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const config = FARM_CONFIG[type];
  const price = settings ? Number(settings.price) : 0;
  const total = price * quantity;
  const isAutoshield = type === 'autoshield';

  const setQty = (n: number) => setQuantity(Math.max(1, n));

  const handleAddToCart = async () => {
    if (!settings) return;
    await addItem({
      item_type: 'bot_farm',
      item_id: settings.id,
      name: config.title,
      description: `${quantity} ${config.title.toLowerCase()}${quantity !== 1 ? 's' : ''}`,
      price,
      quantity,
      metadata: { type },
    });
    setAdded(true);
    onAdded();
    setTimeout(() => setAdded(false), 2000);
  };

  const accentBorder = isAutoshield ? 'hover:border-green-400/40' : 'hover:border-blue-400/40';
  const accentBg = isAutoshield ? 'hover:bg-green-500/10' : 'hover:bg-blue-500/10';
  const badgeBorder = isAutoshield ? 'border-green-400/40' : 'border-blue-400/40';
  const badgeBg = isAutoshield ? 'bg-green-500/10 text-green-200' : 'bg-blue-500/10 text-blue-200';
  const priceColor = isAutoshield ? 'text-green-300' : 'text-blue-300';
  const inputFocus = isAutoshield ? 'focus:border-green-400/50' : 'focus:border-blue-400/50';
  const iconHover = isAutoshield ? 'hover:text-white hover:border-green-400/40' : 'hover:text-white hover:border-blue-400/40';
  const buttonBg = isAutoshield ? 'bg-green-400 hover:bg-green-300' : 'bg-blue-400 hover:bg-blue-300';
  const buttonIconBg = isAutoshield ? 'bg-green-700' : 'bg-blue-700';

  return (
    <div className="rounded-2xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-black/70 via-slate-900/60 to-blue-950/50 border border-white/10 shadow-lg">
      <div className="relative h-48 bg-black/40 flex items-center justify-center">
        {isAutoshield ? (
          <Bot className="w-16 h-16 text-green-400/50" />
        ) : (
          <Bot className="w-16 h-16 text-blue-400/50" />
        )}
        <div className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeBorder} ${badgeBg}`}>
          <InfinityIcon className="w-3.5 h-3.5" /> Unlimited Stock
        </div>
      </div>

      <div className="p-6">
        <h3 className="heading-display text-xl font-bold text-white mb-1">{config.title}</h3>
        <p className="text-sm text-gray-400 mb-3">{config.description}</p>

        <ul className="mb-5 space-y-1.5">
          {config.features.map(f => (
            <li key={f} className="flex items-center gap-2 text-xs text-gray-300">
              <Check className={`w-3.5 h-3.5 flex-shrink-0 ${isAutoshield ? 'text-green-400' : 'text-blue-400'}`} />
              {f}
            </li>
          ))}
        </ul>

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
          className={`w-full mb-5 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 active:scale-95 bg-white/5 border border-white/10 text-gray-200 ${accentBorder} ${accentBg} disabled:opacity-40 disabled:cursor-not-allowed`}
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
            className={`w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 transition-colors ${iconHover}`}
          >
            <Minus className="w-4 h-4" />
          </button>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={e => setQty(parseInt(e.target.value, 10) || 1)}
            className={`w-20 text-center rounded-lg px-3 py-2 bg-black/30 backdrop-blur border border-white/10 text-white font-semibold focus:outline-none ${inputFocus}`}
          />
          <button
            onClick={() => setQty(quantity + 1)}
            className={`w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 transition-colors ${iconHover}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between mb-5 pt-4 border-t border-white/10">
          <span className="text-white font-semibold">Total</span>
          <span className={`heading-display text-2xl font-bold ${priceColor}`}>${total.toFixed(2)}</span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!settings}
          className={`w-full inline-flex items-center justify-center gap-3 pl-6 pr-2 py-2 rounded-full font-semibold transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${buttonBg}`}
        >
          <span className="text-sm text-slate-950" style={{ fontFamily: '"Cinzel", Georgia, serif' }}>
            {added ? 'Added to Cart' : 'Add to Cart'}
          </span>
          <span className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${buttonIconBg}`}>
            {added ? <Check className="w-4 h-4 text-white" /> : <ShoppingCart className="w-4 h-4 text-white" />}
          </span>
        </button>
      </div>

      {showVideo && settings?.video_url && (
        <VideoModal
          url={settings.video_url}
          title={config.title}
          onClose={() => setShowVideo(false)}
          accent={isAutoshield ? 'green' : 'blue'}
        />
      )}
    </div>
  );
}

export default function BotFarms() {
  const [rows, setRows] = useState<BotFarmSettings[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('bot_farm_settings').select('*');
      if (data) setRows(data as BotFarmSettings[]);
      setLoading(false);
    })();
  }, []);

  const normal = rows.find(r => r.type === 'normal');
  const autoshield = rows.find(r => r.type === 'autoshield');

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <FarmCard type="autoshield" settings={autoshield} onAdded={() => {}} />
<FarmCard type="normal" settings={normal} onAdded={() => {}} />
        </div>
      </div>
    </div>
  );
}