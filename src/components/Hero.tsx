import { Link } from 'react-router-dom';
import {

  ArrowUpRight,
  
  
} from "lucide-react";

const RESOURCE_NOTICE =
  'Resources available in k155 , 156 , 159 directly , whie other kingdoms like k160 are available via plunder.';

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
 {/* Resource availability announcement */}
<div className="max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
  <div className="relative px-4 py-1.5">
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,160,23,0.14),transparent_70%)] blur-md"
    />

    {/* Left wooden roller */}
    <div
      aria-hidden
      className="absolute bottom-0 left-0 top-0 z-20 w-3 rounded-full shadow-[0_0_0_1px_rgba(212,160,23,0.35),0_6px_14px_rgba(0,0,0,0.65)]"
      style={{
        backgroundImage:
          'linear-gradient(90deg, #2b1809 0%, #7a4a24 35%, #c79a55 52%, #6b3f1e 72%, #241206 100%)',
      }}
    >
      <span className="absolute -top-2 left-1/2 h-3 w-5 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#c79a55] to-[#6b3f1e] shadow-[0_2px_4px_rgba(0,0,0,0.55)]" />
      <span className="absolute -bottom-2 left-1/2 h-3 w-5 -translate-x-1/2 rounded-full bg-gradient-to-t from-[#c79a55] to-[#6b3f1e] shadow-[0_2px_4px_rgba(0,0,0,0.55)]" />
    </div>

    {/* Right wooden roller */}
    <div
      aria-hidden
      className="absolute bottom-0 right-0 top-0 z-20 w-3 rounded-full shadow-[0_0_0_1px_rgba(212,160,23,0.35),0_6px_14px_rgba(0,0,0,0.65)]"
      style={{
        backgroundImage:
          'linear-gradient(90deg, #241206 0%, #6b3f1e 28%, #c79a55 48%, #7a4a24 65%, #2b1809 100%)',
      }}
    >
      <span className="absolute -top-2 left-1/2 h-3 w-5 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#c79a55] to-[#6b3f1e] shadow-[0_2px_4px_rgba(0,0,0,0.55)]" />
      <span className="absolute -bottom-2 left-1/2 h-3 w-5 -translate-x-1/2 rounded-full bg-gradient-to-t from-[#c79a55] to-[#6b3f1e] shadow-[0_2px_4px_rgba(0,0,0,0.55)]" />
    </div>

    {/* Parchment scroll */}
    <div className="relative mx-1.5 overflow-hidden border-y-2 border-[#c9a96a] bg-[#f2e0b9] shadow-[0_16px_35px_-18px_rgba(0,0,0,0.9),inset_0_0_35px_rgba(122,84,36,0.16)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 18% 12%, rgba(255,255,255,0.55), transparent 42%), radial-gradient(ellipse at 82% 88%, rgba(139,93,38,0.2), transparent 55%), repeating-linear-gradient(0deg, rgba(106,73,32,0.055) 0px, rgba(106,73,32,0.055) 1px, transparent 1px, transparent 4px)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[3px] rounded-[2px] border border-[#a9813f]/40"
      />

      <div className="relative z-10 flex items-center gap-3 px-4 py-3 sm:px-5">
        <span
          aria-hidden
          className="flex h-8 w-8 shrink-0 -rotate-3 items-center justify-center rounded-[3px] border-2 border-[#7f1d14] bg-[#b3261e] text-[15px] font-bold text-[#f8e7c0] shadow-[0_2px_6px_rgba(80,15,10,0.45),inset_0_0_0_1px_rgba(248,231,192,0.25)]"
          style={{ fontFamily: '"SimSun", "Songti SC", serif' }}
        >
          告
        </span>

        <p
          className="relative z-10 min-w-0 flex-1 text-sm font-medium leading-relaxed tracking-wide text-[#3a2715] sm:text-base"
          style={{ fontFamily: '"Georgia", "Times New Roman", serif' }}
        >
          {RESOURCE_NOTICE}
        </p>
      </div>
    </div>
  </div>
</div>

      {/* Skins Section */}
<div className="max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
    <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed text-left">
      Panda, Knight, Dragon, Easter, Ice Skins Available
    </p>
    <Link to="/Skins" className="inline-flex items-center gap-5 pl-6 pr-2 py-3 sm:py-2.5 rounded-full bg-yellow-400 hover:bg-yellow-300 transition-colors duration-200 active:scale-95 font-semibold text-base text-black w-full sm:w-auto justify-center sm:justify-start" style={{ fontFamily: '"Cinzel", Georgia, serif' }}>
    Buy Skins
       <span className="w-8 h-8 rounded-full bg-yellow-700 flex items-center justify-center flex-shrink-0">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </span>

    </Link>
  </div>
</div>

{/* Packages Section */}
<div className="max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">

    {/* Text Container: Flex column stacks the two lines vertically */}
    <div className="flex flex-col text-left">
      <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed">
        20% Discount on packages Available
      </p>
      <p className="text-sm sm:text-md md:text-lg text-gray-500 leading-relaxed italic">
        (*Account Access not Needed)
      </p>

    </div>

    {/* Button: Stays aligned to the right because of the parent flex-row */}
    <Link to="/Packages" className="inline-flex items-center gap-5 pl-6 pr-2 py-3 sm:py-2.5 rounded-full bg-blue-400 hover:bg-blue-500 transition-colors duration-200 active:scale-95 font-semibold text-base text-black w-full sm:w-auto justify-center sm:justify-start" style={{ fontFamily: '"Cinzel", Georgia, serif' }}>
      Buy Packages
      <span className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center flex-shrink-0">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </span>
    </Link>
  </div>
</div>

{/* Resources Section */}
<div className="max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">

    {/* Text Container: Flex column stacks the two lines vertically */}
    <div className="flex flex-col text-left">
      <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed">
         Short on Food<img src="/wheat.png" alt="icon" className="w-7 h-7 mx-2 inline-block" /> or Mithril<img src="/iron1.png" alt="icon" className="w-7 h-7 mx-2 inline-block" /> or others ?
      </p>
    </div>

    {/* Button: Stays aligned to the right because of the parent flex-row */}
    <Link to="/Resources" className="inline-flex items-center gap-4 pl-6 pr-2 py-3 sm:py-2.5 rounded-full bg-green-400 hover:bg-green-500 transition-colors duration-200 active:scale-95 font-semibold text-base text-black w-full sm:w-auto justify-center sm:justify-start" style={{ fontFamily: '"Cinzel", Georgia, serif' }}>
      Get Resources
      <span className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center flex-shrink-0">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </span>
    </Link>
  </div>
</div>

{/* Guides Section */}
<div className="max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
    {/* Wrapped text in a div so it can wrap without pushing the button */}
    <div className="text-left">
      <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed">
        Problems growing your castle? Low power?
      </p>
      <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed">
        Confused in Troop mechanisms?
        <p className="text-sm sm:text-md md:text-lg text-red-500 leading-relaxed italic">
        (Coming soon)
      </p>
      </p>
    </div>
    <Link to="/guides" className="inline-flex items-center gap-4 pl-4 pr-2 py-3 sm:py-2.5 rounded-full bg-red-500 hover:bg-red-400 transition-colors duration-200 active:scale-95 font-semibold text-base text-black w-full sm:w-auto justify-center sm:justify-start" style={{ fontFamily: '"Cinzel", Georgia, serif' }}>
      Game Guides
      <span className="w-8 h-8 rounded-full bg-red-900 flex items-center justify-center flex-shrink-0">
        <ArrowUpRight className="w-4 h-4 text-white" />
      </span>
    </Link>
  </div>
</div>

<div className="max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">

    {/* Text Container: Flex column stacks the two lines vertically */}
    <div className="flex flex-col text-left">
      <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed">
         Want to Purchase a Castle or Sell one ?
      </p>
    </div>

    {/* Button: Stays aligned to the right because of the parent flex-row */}
    <Link to="/Castles" className="inline-flex items-center gap-4 pl-4 pr-2 py-3 sm:py-2.5 rounded-full bg-purple-500 hover:bg-purple-400 transition-colors duration-200 active:scale-95 font-semibold text-base text-black w-full sm:w-auto justify-center sm:justify-start" style={{ fontFamily: '"Cinzel", Georgia, serif' }}>
      Buy/Sell Castles
      <span className="w-8 h-8 rounded-full bg-purple-900 flex items-center justify-center flex-shrink-0">
        <ArrowUpRight className="w-4 h-4 text-white" />
      </span>
    </Link>
  </div>
</div>
<div className="max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">

    {/* Text Container: Flex column stacks the two lines vertically */}
    <div className="flex flex-col text-left">
      <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed">
         Bots Farms for farming resources in new kingdoms
      </p>
      <p className="text-sm sm:text-md md:text-lg text-red-500 leading-relaxed italic">
        (*only $3.5/farm per month)
      </p>
    </div>

    {/* Button: Stays aligned to the right because of the parent flex-row */}
    <Link to="/bot-farms" className="inline-flex items-center gap-4 pl-4 pr-2 py-3 sm:py-2.5 rounded-full bg-orange-500 hover:bg-orange-400 transition-colors duration-200 active:scale-95 font-semibold text-base text-black w-full sm:w-auto justify-center sm:justify-start" style={{ fontFamily: '"Cinzel", Georgia, serif' }}>
      Bot Farms
      <span className="w-8 h-8 rounded-full bg-orange-900 flex items-center justify-center flex-shrink-0">
        <ArrowUpRight className="w-4 h-4 text-white" />
      </span>
    </Link>
  </div>
</div>
      </div>
    </section>
  );
}
 