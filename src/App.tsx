import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import Home from './pages/Home';
import Packages from './pages/Packages';
import Skins from './pages/Skins';
import Castles from './pages/Castles';
import BotFarms from './pages/BotFarms';
import GameGuides from './pages/GameGuides';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import TrackOrder from './pages/TrackOrder';
import Resources from './pages/Resources';
import HallOfLosers from './pages/HallofLosers';
import Consultation from './pages/Consultation';
import Admin from './pages/Admin';
import { CartProvider } from './context/CartContext';

export default function App() {
  return (
    <CartProvider>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          {/* Suspense fallback ensures the 3D pyramid appears during page transitions */}
          <Suspense
            fallback={
              <div className="min-h-[70vh] flex items-center justify-center">
                <LoadingSpinner scale={0.7} />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/skins" element={<Skins />} />
              <Route path="/castles" element={<Castles />} />
              <Route path="/bot-farms" element={<BotFarms />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/hall-of-losers" element={<HallOfLosers />} />
              <Route path="/guides" element={<GameGuides />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/track" element={<TrackOrder />} />
              <Route path="/consultation" element={<Consultation />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}