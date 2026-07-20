import { MessageCircle, Mail, Phone, Castle } from "lucide-react";
import { Link } from "react-router-dom";

// TODO: keep in sync with the invite link used on the Packages page
const DISCORD_INVITE_URL = "https://discord.gg/YACFe6n2QY";

export default function Footer() {
  return (
    <footer className="border-t border-night-700 bg-night-950">
      <div className="container-game py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo.png" alt="Aman's Store" className="w-8 h-8" />
              <span className="heading-display text-lg font-bold text-gold-300">
                Aman's Store
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Genuine destination for Clash of Kings: The West resources, skins,
              Bots , Guides , tips and Help
            </p>
          </div>
          <div>
            <h4 className="heading-display text-sm font-semibold text-white mb-4">
              Store
            </h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link
                  to="/packages"
                  className="hover:text-gold-300 transition-colors"
                >
                  Packages
                </Link>
              </li>
              <li>
                <Link
                  to="/skins"
                  className="hover:text-gold-300 transition-colors"
                >
                  Skins
                </Link>
              </li>
              <li>
                <Link
                  to="/guides"
                  className="hover:text-gold-300 transition-colors"
                >
                  Game Guides
                </Link>
              </li>
              <li>
                <Link
                  to="/track"
                  className="hover:text-gold-300 transition-colors"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="heading-display text-sm font-semibold text-white mb-4">
              Connect
            </h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li>
                <a
                  href="mailto:aman903gamer2@gmail.com"
                  className="flex items-center gap-2.5 hover:text-gold-300 transition-colors"
                >
                  <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
                  <span className="truncate">aman903gamer2@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/2348132074221"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-gold-300 transition-colors"
                >
                  <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                  <span>+234 813 207 4221</span>
                </a>
              </li>
              <li>
                <a
                  href={DISCORD_INVITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-gold-300 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-gold-400 flex-shrink-0" />
                  <span>Discord: aman.loc</span>
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Castle className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>IC€man &middot; K21</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-night-700 text-center text-sm text-gray-600">
          <p>
            &copy; 2026 Aman's Store . All rights reserved. Not affiliated with
            or endorsed by Clash of Kings.
          </p>
        </div>
      </div>
    </footer>
  );
}