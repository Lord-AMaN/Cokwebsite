import { Play } from 'lucide-react';

export default function VideoSection() {
  return (
    <section className="py-24 relative">
      <div className="container-game">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-crimson-400 tracking-wider uppercase">Gameplay</span>
          <h2 className="heading-display text-3xl md:text-5xl font-bold text-white mt-2">See It In Action</h2>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-night-700 group cursor-pointer aspect-video max-w-4xl mx-auto"
          style={{ backgroundImage: `linear-gradient(135deg, rgba(120,13,13,0.2), rgba(8,5,6,0.9)), url(https://images.pexels.com/photos/167085/pexels-photo-167085.jpeg?auto=compress&cs=tinysrgb&w=1200)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-night-950/50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-crimson-800/30 border border-crimson-600/50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-gold-300 ml-1" fill="currentColor" />
              </div>
              <p className="heading-display text-xl font-bold text-white">Watch Gameplay Trailer</p>
              <p className="text-sm text-gray-400 mt-1">2 min overview</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto">
          {[
            { icon: '⚔️', label: 'Real-time Battles' },
            { icon: '🏰', label: 'Castle Building' },
            { icon: '🤝', label: 'Alliance System' },
            { icon: '🌍', label: 'Global Server' },
          ].map((f, i) => (
            <div key={i} className="card-game p-4 text-center">
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="text-sm text-gray-300 font-medium">{f.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
