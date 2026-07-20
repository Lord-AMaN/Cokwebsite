import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, X, ArrowRight } from 'lucide-react';

const DISMISS_KEY = 'cok_cart_bar_dismissed_count';

// Hide the floating bar on pages where a cart summary would just be
// redundant/annoying (already looking at the cart, or already checking out).
const HIDDEN_ON = ['/cart', '/checkout'];

export default function FloatingCartBar() {
  const { items, count, total } = useCart();
  const location = useLocation();
  const [dismissed, setDismissed] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const prevCount = useRef(count);

  // Respect a dismissal from earlier in this session, as long as the
  // cart hasn't changed since then.
  useEffect(() => {
    try {
      const savedCount = sessionStorage.getItem(DISMISS_KEY);
      if (savedCount !== null && Number(savedCount) === count) {
        setDismissed(true);
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Whenever the cart grows, surface the bar again (even if it was
  // previously dismissed) and give it a brief "just added" pulse.
  useEffect(() => {
    if (count > prevCount.current) {
      setDismissed(false);
      setJustAdded(true);
      const t = setTimeout(() => setJustAdded(false), 1600);
      prevCount.current = count;
      return () => clearTimeout(t);
    }
    prevCount.current = count;
  }, [count]);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, String(count));
    } catch {
      /* ignore */
    }
  };

  if (count === 0) return null;
  if (dismissed) return null;
  if (HIDDEN_ON.includes(location.pathname)) return null;

  const lastItem = items[items.length - 1];

  return (
    <div className="fixed bottom-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <div
        className={`pointer-events-auto flex items-center gap-4 rounded-full pl-5 pr-2 py-2.5 backdrop-blur-xl bg-gradient-to-br from-black/85 via-slate-900/80 to-blue-950/70 border shadow-lg transition-all duration-300 animate-slide-up ${
          justAdded ? 'border-blue-400/60 shadow-blue-500/20' : 'border-white/10'
        }`}
      >
        <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 relative">
          <ShoppingCart className="w-4 h-4 text-blue-300" />
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
            {count}
          </span>
        </div>

        <div className="min-w-0 hidden sm:block">
          <p className="text-xs text-gray-400 truncate max-w-[160px]">
            {count === 1 ? lastItem?.name ?? 'Item added' : `${count} items in cart`}
          </p>
          <p className="text-sm font-semibold text-white">${total.toFixed(2)}</p>
        </div>

        <p className="text-sm font-semibold text-white sm:hidden">${total.toFixed(2)}</p>

        <Link
          to="/checkout"
          className="inline-flex items-center gap-2 pl-4 pr-3 py-2 rounded-full font-semibold text-sm transition-all duration-200 active:scale-95 bg-blue-400 hover:bg-blue-300 text-slate-950 flex-shrink-0"
          style={{ fontFamily: '"Cinzel", Georgia, serif' }}
        >
          Buy Now
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={handleDismiss}
          className="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-colors flex-shrink-0"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}