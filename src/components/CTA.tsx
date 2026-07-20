import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-24 relative">
      <div className="container-game">
        <div className="relative rounded-3xl overflow-hidden border border-crimson-800/40 bg-gradient-to-br from-crimson-900/30 via-night-900 to-night-950 p-12 md:p-16 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-crimson-700/15 rounded-full blur-[100px]" />
          <div className="relative z-10">
            <h2 className="heading-display text-3xl md:text-5xl font-bold text-white mb-4">Ready to Conquer?</h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">Join thousands of players who trust Aman's Store for their Clash of Kings: The West needs. Start your journey to dominance today.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/packages" className="btn-primary">Browse Packages <ArrowRight className="w-5 h-5" /></Link>
              <Link to="/skins" className="btn-outline">Shop Skins</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
