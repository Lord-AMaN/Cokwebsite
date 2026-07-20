import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-crimson-800/15 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-lava-600/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgb(232, 185, 17) 1px, transparent 1px), linear-gradient(90deg, rgba(192,24,24,1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
      }} />

      <div className="container-game relative z-10 text-center">
       {/* <h1 className="heading-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[1.1] mb-6 animate-slide-up">
          Clash of Kings<br />
          <span className="text-gradient-gold">The West</span>
        </h1>*/}
        <div className="flex justify-center mb-16 mt-16 animate-slide-up">
        <img 
          src="/logo.png" 
          alt="Clash of Kings The West" 
          className="h-auto max-w-full w-[240px] md:w-[260px] object-contain"
        />
        </div>

      {/* Skins Section */}
<div className="max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
  <div className="flex items-center justify-between gap-6">
    <p className="text-lg md:text-xl text-gray-400 leading-relaxed text-left">
      Panda, Knight, Dragon, Easter, Ice Skins Available
    </p>
    <Link to="/Skins" className="btn bg-yellow-500 hover:bg-yellow-600 text-black font-mono font-bold py-2 px-4 rounded-lg inline-flex items-center gap-2 transition-all flex-shrink-0">
      Buy Skins <ArrowRight className="w-5 h-5" />
    </Link>
  </div>
</div>

{/* Packages Section */}
<div className="max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
  <div className="flex items-center justify-between gap-6">
    
    {/* Text Container: Flex column stacks the two lines vertically */}
    <div className="flex flex-col text-left">
      <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
        20% Discount on packages Available
      </p>
      <p className="text-md md:text-lg text-gray-500 leading-relaxed italic">
        (*Account Access not Needed)
      </p>
     
    </div>
    
    {/* Button: Stays aligned to the right because of the parent flex-row */}
    <Link to="/packages" className="btn bg-blue-400 hover:bg-blue-700 text-black font-mono font-bold py-2 px-4 rounded-lg inline-flex items-center gap-2 transition-all flex-shrink-0">
      Buy Packages <ArrowRight className="w-5 h-5" />
    </Link>
  </div>
</div>

{/* Resources Section */}
<div className="max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
  <div className="flex items-center justify-between gap-6">
    
    {/* Text Container: Flex column stacks the two lines vertically */}
    <div className="flex flex-col text-left">
      <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
         Short on Food<img src="/wheat.png" alt="icon" className="w-7 h-7 mx-2 inline-block" /> or Mithril<img src="/iron.png" alt="icon" className="w-7 h-7 mx-2 inline-block" /> or others ?  
      </p>
    </div>
    
    {/* Button: Stays aligned to the right because of the parent flex-row */}
    <Link to="/Resources" className="btn bg-green-600 hover:bg-green-800 text-black font-mono font-bold py-2 px-4 rounded-lg inline-flex items-center gap-2 transition-all flex-shrink-0">
      Get Resources <ArrowRight className="w-5 h-5" />
    </Link>
  </div>
</div>

{/* Guides Section */}
<div className="max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
  <div className="flex items-center justify-between gap-6">
    {/* Wrapped text in a div so it can wrap without pushing the button */}
    <div className="text-left max-w-[70%]">
      <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
        Problems growing your castle? Low power?
      </p>
      <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
        Confused in Troop mechanisms?
        <p className="text-md md:text-lg text-red-500 leading-relaxed italic">
        (Coming soon)
      </p>
      </p>
    </div>
    <Link to="/guides" className="btn bg-red-700 hover:bg-red-600 text-black font-mono font-bold py-2 px-4 rounded-lg inline-flex items-center gap-2 transition-all flex-shrink-0">
      Check Game Guides <ArrowRight className="w-5 h-5" />
    </Link>
  </div>
</div>

<div className="max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
  <div className="flex items-center justify-between gap-6">
    
    {/* Text Container: Flex column stacks the two lines vertically */}
    <div className="flex flex-col text-left">
      <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
         Want to Purchase a Castle or Sell one ? 
      </p>
    </div>
    
    {/* Button: Stays aligned to the right because of the parent flex-row */}
    <Link to="/Castles" className="btn bg-purple-600 hover:bg-purple-800 text-black font-mono font-bold py-2 px-4 rounded-lg inline-flex items-center gap-2 transition-all flex-shrink-0">
      Buy/sell Castles <ArrowRight className="w-5 h-5" />
    </Link>
  </div>
</div>
<div className="max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
  <div className="flex items-center justify-between gap-6">
    
    {/* Text Container: Flex column stacks the two lines vertically */}
    <div className="flex flex-col text-left">
      <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
         Bots Farms for farming resources in new kingdoms
      </p>
      <p className="text-md md:text-lg text-red-500 leading-relaxed italic">
        (*only $3.5/farm per month)
      </p>
    </div>
    
    {/* Button: Stays aligned to the right because of the parent flex-row */}
    <Link to="/bot-farms" className="btn bg-orange-600 hover:bg-orange-800 text-black font-mono font-bold py-2 px-4 rounded-lg inline-flex items-center gap-2 transition-all flex-shrink-0">
      Bot farms <ArrowRight className="w-5 h-5" />
    </Link>
  </div>
</div>
      </div>
    </section>
  );
}
 