import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/packages', label: 'Buy Packages' },
  { to: '/skins', label: 'Buy Skins' },
  { to: '/castles', label: 'Buy/Sell Castles' },
  { to: '/bot-farms', label: 'Bot Farms' },
  { to: '/resources', label: 'Buy Resources' },
  { to: '/guides', label: 'Game Guides' },
  { to: '/track', label: 'Track Order' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
      <nav className="container-game flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src="/coklogo.png"
            alt="Aman's Store"
            className="h-10 w-auto object-contain"
          />
         
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === link.to ? "text-gold-300 bg-crimson-900/20" : "text-gray-400 hover:text-white hover:bg-night-700/50"}`}
            >
              {link.label}
            </Link>
          ))}
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
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden bg-night-950/95 backdrop-blur-lg border-b border-night-700">
          <div className="container-game py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-3 rounded-lg text-sm font-medium ${location.pathname === link.to ? "text-gold-300 bg-crimson-900/20" : "text-gray-400 hover:text-white hover:bg-night-700/50"}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}