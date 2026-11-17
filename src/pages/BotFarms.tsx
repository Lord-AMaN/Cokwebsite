import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import BeamBorder from '@/components/ui/borderbeamcard';
import {
  ShoppingCart,
  Check,
  Minus,
  Plus,
  Bot,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import VideoModal from '../components/VideoModal';
import { getYouTubeId } from '../lib/youtube';
import { Loader } from '../components/LoadingSpinner';

type BotFarmType = 'autoshield';

type BotFarmSettings = {
  id: string;
  type: BotFarmType;
  price: number;
  video_url: string | null;
};

type FarmConfig = {
  title: string;
  description: string;
  features: string[];
};

const FARM_CONFIG: Record<BotFarmType, FarmConfig> = {
  autoshield: {
    title: 'Autoshield Bot Farm',
    description:
      'Put your farm on autopilot. Gathering, upgrading, shielding and reward collection are all handled. Includes a 2-day free trial so you can see it work before you commit.',
    features: [
      'Auto teleport',
      'Resources visible on telegram',
      'Auto-gathers resources',
      'Auto-upgrades farm',
      'Trains troops automatically',
      'Auto-collects resources from plots with boosts and combo',
      'Uses skills',
      '24/7 gathering',
      'Auto-shields on attack',
      'Autoshield in 0.1 seconds',
      'Claims Wishes, Rewards, Princess gifts and Missions',
      'Auto-collects rewards from Alliance monster',
      'Auto-collects Daily Chests, Missions and Legendary level rewards',
      'Alliance Donations (feature added next month)',
      'Gathering stats: approx. 500M wood, 600M food, 15M mithril and 50M iron per month',
      'You can provide your farms or we can create new',
      'Google, Guopan and x7 supported',
      '2 days trial and full refund if needed',
      'Bot support directly from me',
    ],
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

  return (
    <div className="relative">
      <BeamBorder
        size="pulse-outside"
        colorVariant="mono"
        theme="dark"
        active
        strength={1}
        duration={1.1}
        beamWidth={2}
        className="w-full"
      >
        <div className="relative overflow-hidden rounded-2xl bg-[#0a0a0a]">
          <div className="relative z-10">
            {/* Header */}
            <div className="flex flex-col gap-6 border-b border-white/10 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10 lg:pb-8">
              <div className="flex min-w-0 items-start gap-4 sm:gap-5">
                <Bot className="h-16 w-16 shrink-0 text-white/70" />
                <div className="min-w-0">
                  <h3 className="heading-display text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                    {config.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#a3a3a3] sm:text-base">
                    {config.description}
                  </p>
                </div>
              </div>

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
                className="group/btn relative w-full shrink-0 overflow-hidden rounded-full bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-300 py-3 pl-6 pr-2 font-semibold shadow-[0_12px_35px_-12px_rgba(16,185,129,0.95)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_16px_45px_-10px_rgba(16,185,129,1)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 lg:w-auto"
                style={{ fontFamily: '"Cinzel", Georgia, serif' }}
              >
                <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-full -skew-x-12 bg-white/35 blur-md transition-transform duration-700 group-hover/btn:translate-x-[420%] motion-reduce:transition-none" />
                <span className="relative flex items-center justify-center gap-3">
                  <span className="text-sm text-slate-950">Watch it in action</span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-800">
                    <ArrowRight className="h-4 w-4 text-white" />
                  </span>
                </span>
              </button>
            </div>

            {/* Features and purchase */}
            <div className="grid gap-8 bg-gradient-to-b from-[#111111]/80 to-[#1c1c1c]/80 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-10 lg:p-10">
              <div className="order-2 lg:order-1">
                <h4 className="heading-display text-xl font-bold text-white sm:text-2xl">Features</h4>

                <ul className="mt-5 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                  {config.features.map(feature => (
                    <li key={feature} className="flex items-start gap-2 text-sm leading-snug text-[#a3a3a3]">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#4ade80]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Purchase panel */}
              <div className="relative order-1 rounded-2xl border border-emerald-400/25 bg-gradient-to-b from-emerald-500/[0.12] via-emerald-950/30 to-black/40 p-5 shadow-[0_25px_70px_-30px_rgba(16,185,129,0.65)] backdrop-blur sm:p-6 lg:order-2">
                <div
                  aria-hidden
                  className="absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-emerald-300/90 to-transparent"
                />

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300/80">
                    Price per farm
                  </p>
                  <p className="heading-display mt-1 text-3xl font-bold text-white sm:text-4xl">
                    ${price.toFixed(2)}
                  </p>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-300">Number of farms</span>
                    <span className="text-[11px] text-gray-500">Add as many as you need</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/40 p-1.5">
                    <button
                      onClick={() => setQty(quantity - 1)}
                      aria-label="Decrease number of farms"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition-colors hover:border-emerald-400/40 hover:bg-emerald-500/10 hover:text-white active:scale-95"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={event => setQty(parseInt(event.target.value, 10) || 1)}
                      aria-label="Number of farms"
                      className="w-16 appearance-none border-0 bg-transparent text-center text-lg font-bold text-white focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <button
                      onClick={() => setQty(quantity + 1)}
                      aria-label="Increase number of farms"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition-colors hover:border-emerald-400/40 hover:bg-emerald-500/10 hover:text-white active:scale-95"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-sm font-semibold text-gray-300">Total</span>
                  <span className="heading-display text-3xl font-bold text-emerald-300 drop-shadow-[0_0_20px_rgba(16,185,129,0.45)]">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!settings}
                  className="group/btn relative mt-5 w-full overflow-hidden rounded-full bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-300 py-3 pl-6 pr-2 font-semibold shadow-[0_12px_35px_-12px_rgba(16,185,129,0.95)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_16px_45px_-10px_rgba(16,185,129,1)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-full -skew-x-12 bg-white/35 blur-md transition-transform duration-700 group-hover/btn:translate-x-[420%] motion-reduce:transition-none" />
                  <span className="relative flex items-center justify-center gap-3">
                    <span
                      className="text-sm text-slate-950"
                      style={{ fontFamily: '"Cinzel", Georgia, serif' }}
                    >
                      {added ? 'Added to Cart' : 'Add to Cart'}
                    </span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-800">
                      {added ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : (
                        <ShoppingCart className="h-4 w-4 text-white" />
                      )}
                    </span>
                  </span>
                </button>

                <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-gray-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400/80" />
                  2-day trial and full refund available
                </p>
              </div>
            </div>
          </div>
        </div>
      </BeamBorder>

      {showVideo && settings?.video_url && (
        <VideoModal
          url={settings.video_url}
          title={config.title}
          onClose={() => setShowVideo(false)}
          accent="green"
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

  const autoshield = rows.find(r => r.type === 'autoshield');

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 bg-black">
        <Loader className="w-8 h-8 text-white/60 animate-spin" />
      </div>
    );

  return (
    <div className="pt-20 pb-24 min-h-screen bg-black">
      <div className="container-game">
        <div className="text-center mb-12 mt-8">
          <span className="text-sm font-semibold text-[#a3a3a3] tracking-wider uppercase">Automation</span>
          <h1 className="heading-display text-4xl md:text-6xl font-bold text-white mt-2 mb-4">Bot Farms</h1>
          <p className="text-[#a3a3a3] max-w-2xl mx-auto">
            Buy as many bot farms as you need. Always in stock, no limits.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <FarmCard type="autoshield" settings={autoshield} onAdded={() => {}} />
        </div>
      </div>
    </div>
  );
}
