import { Package, Palette, Brain, ArrowRight, Check, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  { icon: Package, title: 'Resource Packages', desc: 'Get gold, food, wood, stone, and gems delivered to your account instantly. Bundles for every budget.', link: '/packages' },
  { icon: Palette, title: 'Exclusive Skins', desc: 'Stand out on the battlefield with rare hero skins from Common to Legendary rarity tiers.', link: '/skins' },
  { icon: Brain, title: 'Game Guides', desc: 'Master every system with detailed guides on combat, economy, alliances, and strategy.', link: '/guides' },
];

export default function Features() {
  return (
    <section className="py-24 relative">
      <div className="container-game">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-crimson-400 tracking-wider uppercase">What We Offer</span>
          <h2 className="heading-display text-3xl md:text-5xl font-bold text-white mt-2 mb-4">Everything You Need to Win</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">From resources to pro coaching, we've got every aspect of your Clash of Kings journey covered.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <Link to={f.link} key={i} className="card-game p-8 group">
              <div className="w-14 h-14 rounded-2xl bg-crimson-900/20 border border-crimson-700/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <f.icon className="w-7 h-7 text-gold-400" />
              </div>
              <h3 className="heading-display text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{f.desc}</p>
              <span className="inline-flex items-center gap-1 text-crimson-400 text-sm font-medium group-hover:gap-2 transition-all">
                Learn More <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sm font-semibold text-crimson-400 tracking-wider uppercase">Why Aman's Store</span>
            <h2 className="heading-display text-3xl md:text-4xl font-bold text-white mt-2 mb-6">The Trusted Name in Gaming</h2>
            <div className="space-y-4">
              {[
                'Instant automated delivery to your game account',
                'Secure payment processing with buyer protection',
                '24/7 customer support via Discord and email',
                'Verified pro players for all consultations',
                'Money-back guarantee on every purchase',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-crimson-900/30 border border-crimson-700/40 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-gold-400" />
                  </div>
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="card-game p-6 text-center">
              <Star className="w-8 h-8 text-gold-400 mx-auto mb-3" />
              <div className="heading-display text-3xl font-bold text-white">4.9/5</div>
              <div className="text-sm text-gray-500">Customer Rating</div>
            </div>
            <div className="card-game p-6 text-center">
              <Package className="w-8 h-8 text-gold-400 mx-auto mb-3" />
              <div className="heading-display text-3xl font-bold text-white">50K+</div>
              <div className="text-sm text-gray-500">Orders Delivered</div>
            </div>
            <div className="card-game p-6 text-center">
              <Brain className="w-8 h-8 text-gold-400 mx-auto mb-3" />
              <div className="heading-display text-3xl font-bold text-white">200+</div>
              <div className="text-sm text-gray-500">Pro Coaches</div>
            </div>
            <div className="card-game p-6 text-center">
              <Check className="w-8 h-8 text-gold-400 mx-auto mb-3" />
              <div className="heading-display text-3xl font-bold text-white">99.8%</div>
              <div className="text-sm text-gray-500">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
