import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
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
import Consultation from './pages/Consultation';
import Admin from './pages/Admin';
import { CartProvider } from './context/CartContext';

export default function App() {
  return (
    <CartProvider>
      <ScrollToTop />
      <div className="scale-90 origin-top flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/skins" element={<Skins />} />
            <Route path="/castles" element={<Castles />} />
            <Route path="/bot-farms" element={<BotFarms />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/guides" element={<GameGuides />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/track" element={<TrackOrder />} />
            <Route path="/consultation" element={<Consultation />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}