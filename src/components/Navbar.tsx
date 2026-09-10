import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ShoppingCart,
  Home,
  ShoppingBag,
  Shirt,
  Castle,
  Bot,
  Package,
  BookOpen,
  Skull,
  Truck,
  type LucideIcon,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

// Small local class-joiner so we don't need an extra "@/lib/utils" dependency.
function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

interface NavLink {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Tailwind classes applied when this link is the active page (text + bg + glow) */
  activeText: string;
  activeBg: string;
  glow: string;
}

const navLinks: NavLink[] = [
  { to: '/', label: 'Home', icon: Home, activeText: 'text-blue-400', activeBg: 'bg-blue-900/20', glow: 'bg-blue-500/25' },
  { to: '/packages', label: 'Buy Packages', icon: ShoppingBag, activeText: 'text-green-400', activeBg: 'bg-green-900/20', glow: 'bg-green-500/25' },
  { to: '/skins', label: 'Buy Skins', icon: Shirt, activeText: 'text-purple-400', activeBg: 'bg-purple-900/20', glow: 'bg-purple-500/25' },
  { to: '/castles', label: 'Buy/Sell Castles', icon: Castle, activeText: 'text-amber-400', activeBg: 'bg-amber-900/20', glow: 'bg-amber-500/25' },
  { to: '/bot-farms', label: 'Bot Farms', icon: Bot, activeText: 'text-red-400', activeBg: 'bg-red-900/20', glow: 'bg-red-500/25' },
  { to: '/resources', label: 'Buy Resources', icon: Package, activeText: 'text-cyan-400', activeBg: 'bg-cyan-900/20', glow: 'bg-cyan-500/25' },
  { to: '/guides', label: 'Game Guides', icon: BookOpen, activeText: 'text-pink-400', activeBg: 'bg-pink-900/20', glow: 'bg-pink-500/25' },
  { to: '/hall-of-losers', label: 'Hall of Losers', icon: Skull, activeText: 'text-purple-300', activeBg: 'bg-purple-700/30', glow: 'bg-gray-400/20' },
  { to: '/track', label: 'Track Order', icon: Truck, activeText: 'text-orange-400', activeBg: 'bg-orange-900/20', glow: 'bg-orange-500/25' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const location = useLocation();
  const { count } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-night-950/90 backdrop-blur-lg border-b border-night-700" : "bg-transparent"}`}
    >
      {/* h-16 (4rem) increased 40% -> 5.6rem */}
      <nav className="container-game flex items-center justify-between h-[5.6rem]">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src="/coklogo.png"
            alt="Aman's Store"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop nav: animated glowing pill bar. py-1.5 (0.375rem) increased 40% -> 0.525rem */}
        <div className="hidden md:flex items-center gap-1 bg-black/30 border border-white/10 backdrop-blur-lg py-[0.55rem] px-3.5 rounded-full relative">
          {navLinks.map((link) => {
            
            const isActive = location.pathname === link.to;
            const isHovered = hoveredTab === link.to;

            return (
              <Link
                key={link.to}
                to={link.to}
                onMouseEnter={() => setHoveredTab(link.to)}
                onMouseLeave={() => setHoveredTab(null)}
                className={cx(
                  'relative text-sm font-game font-medium px-4 py-5 rounded-full transition-colors duration-200 whitespace-nowrap',
                  isActive ? link.activeText : 'text-gray-400 hover:text-white'
                )}
              >
                {isActive && (
                  <motion.div
                
                    className="absolute inset-0 rounded-full -z-10 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0.3, 0.5, 0.3],
                      scale: [1, 1.03, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <div className={cx('absolute inset-0 rounded-full blur-md', link.glow)} />
                    <div className={cx('absolute inset-[-4px] rounded-full blur-xl', link.glow)} />
                    <div className={cx('absolute inset-0 rounded-full', link.activeBg)} />
                  </motion.div>
                )}

                <AnimatePresence>
                  {isHovered && !isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.15 }}
                      className="absolute inset-0 bg-night-700/60 rounded-full -z-10"
                    />
                  )}
                </AnimatePresence>

                <span className="relative z-10 flex items-center gap-1.5">
                 
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            className="relative p-2 rounded-lg text-gray-400 hover:text-gold-300 hover:bg-night-700/50 transition-all"
            aria-label="Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-crimson-600 text-white text-xs font-bold flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          <button
            className="md:hidden text-gray-300"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden bg-night-950/95 backdrop-blur-lg border-b border-night-700">
          <div className="container-game py-4 flex flex-col gap-1">
            {navLinks.map((link) => {
            
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cx(
                    'px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2',
                    isActive ? cx(link.activeText, link.activeBg) : 'text-gray-400 hover:text-white hover:bg-night-700/50'
                  )}
                >
                  
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}