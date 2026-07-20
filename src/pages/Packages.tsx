import {
  MessageCircle,
  Ticket,
  
  ChevronDown,
  ImageOff,
  ArrowUpRight,
  
  LucideMessageCircleQuestion,
} from "lucide-react";

// TODO: replace with your real Discord server invite link
const DISCORD_INVITE_URL = "https://discord.gg/YACFe6n2QY";

export default function Packages() {
  return (
    <div className="pt-20 pb-24 min-h-screen">
      <div className="container-game">
        <div className="text-center mb-16 mt-8">
          <h1 className="heading-display text-4xl md:text-6xl font-bold text-white mt-2 mb-4">
            Game Packages
          </h1>
          <span className="text-sm font-semibold text-crimson-400 tracking-wider uppercase">
            20% Discount on the price that YOU see on your side.
          </span>
        </div>

        <div className="max-w-3xl mx-auto space-y-5">
          {/* Dropdown 1: Join Discord */}
          <details
            className="rounded-2xl p-5 group backdrop-blur-xl bg-gradient-to-br from-black/70 via-slate-900/60 to-blue-950/50 border border-white/10 shadow-lg"
            open
          >
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 backdrop-blur flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <h3 className="heading-display text-lg font-bold text-white">
                    Step 1 — Join Our Discord
                  </h3>
                  <p className="text-xs text-gray-400">
                    Where every order gets handled
                  </p>
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-open:bg-blue-500/10 group-open:border-blue-400/30 transition-colors">
                <ChevronDown className="w-4 h-4 text-gray-400 group-open:text-blue-300 group-open:rotate-180 transition-transform" />
              </div>
            </summary>
            <div className="mt-5 space-y-4">
              <p className="text-sm text-gray-400 leading-relaxed">
                All package orders are handled through our Discord server. Tap
                the button below to join. Then create a discord account if you do not have one , then use the account with the invite link to get into the server (server means a group I have created for you to join and talk to me about stuff) . You can also use your existing account to join the server on discord. If you do not have a discord account , create one and then join the server. You can also use the web version of discord to join the server.
              </p>

              <div className="flex justify-center">
                <a
                  href={DISCORD_INVITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 pl-6 pr-2 py-2 rounded-full bg-blue-400 hover:bg-blue-300 transition-colors duration-200 active:scale-95"
                >
                  <span
                    className="font-semibold text-sm text-slate-950"
                    style={{ fontFamily: '"Cinzel", Georgia, serif' }}
                  >
                    Join Discord
                  </span>
                  <span className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </span>
                </a>
              </div>

              <PicturePlaceholder
                label="discord-invite-screenshot.png"
                src="/one.png"
              />
              
            </div>
          </details>

          {/* Dropdown 2: Head to tickets channel */}
          <details
            className="rounded-2xl p-5 group backdrop-blur-xl bg-gradient-to-br from-black/70 via-slate-900/60 to-blue-950/50 border border-white/10 shadow-lg"
            open
          >
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 backdrop-blur flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <h3 className="heading-display text-lg font-bold text-white">
                    Step 2 — Open a Ticket
                  </h3>
                  <p className="text-xs text-gray-400">
                    Head to #tickets and create one
                  </p>
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-open:bg-blue-500/10 group-open:border-blue-400/30 transition-colors">
                <ChevronDown className="w-4 h-4 text-gray-400 group-open:text-blue-300 group-open:rotate-180 transition-transform" />
              </div>
            </summary>
            <div className="mt-5 space-y-4">
              <p className="text-sm text-gray-400 leading-relaxed">
                {"  ~>  "}Once you're in the server, You can find list of
                channels in the left side.
              </p>
              <PicturePlaceholder
                label="discord-invite-screenshot.png"
                src="/two.png"
              />
              <p className="text-sm text-gray-400 leading-relaxed">
                {"  ~>  "}Now scroll down and head over to the{" "}
                <span className="text-blue-300 font-medium">#buy-here</span>{" "}
                channel. And Click{" "}
                <span className="text-blue-300 font-medium">Create Ticket</span>
              </p>
              <PicturePlaceholder
                label="discord-invite-screenshot.png"
                src="/three.png"
              />
              <PicturePlaceholder
                label="discord-invite-screenshot.png"
                src="/four.png"
              />
              <p className="text-sm text-gray-400 leading-relaxed">
                {"  ~>  "} A private ticket will be created for you in this
                channel.
              </p>

              <PicturePlaceholder
                label="discord-invite-screenshot.png"
                src="/five.png"
              />

              <p className="text-sm text-gray-400 leading-relaxed">
                {"  ~>  "}Now head over to this ticket and convey me the package
                you want , either via your account id , or ingame .
              </p>
              <PicturePlaceholder
                label="discord-invite-screenshot.png"
                src="/six.png"
              />
              <p className="text-sm text-gray-400 leading-relaxed">
                {"  ~>  "}Rest is discussed in this ticket. It is private to you
                and me only.
              </p>
            </div>
          </details>

          {/* Dropdown 3: Upload pack image in ticket */}
          <details
            className="rounded-2xl p-5 group backdrop-blur-xl bg-gradient-to-br from-black/70 via-slate-900/60 to-blue-950/50 border border-white/10 shadow-lg"
            open
          >
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 backdrop-blur flex items-center justify-center">
                  <LucideMessageCircleQuestion className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <h3 className="heading-display text-lg font-bold text-green-400">
                    Procedure:
                  </h3>
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-open:bg-blue-500/10 group-open:border-blue-400/30 transition-colors">
                <ChevronDown className="w-4 h-4 text-gray-400 group-open:text-blue-300 group-open:rotate-180 transition-transform" />
              </div>
            </summary>
            <div className="mt-5 space-y-4">
              <p className="text-sm text-gray-400 leading-relaxed">
                There are two ways to buy packages.
              </p>

              <div>
                <p className="text-sm font-semibold text-blue-300 mb-2">
                  1. Official Game Website
                </p>
                <ul className="space-y-1.5 pl-4">
                  <li className="text-sm text-gray-400 leading-relaxed list-disc">
                    Offers double gold bars for first purchase only. Resets after 6 months.
                  </li>
                  <li className="text-sm text-gray-400 leading-relaxed list-disc">
                    Gold bars can be used to purchase packages in the game. 
                  </li>
                  <li className="text-sm text-gray-400 leading-relaxed list-disc">
                    Only Google and iOS(apple) platforms are supported
                  </li>
                  <li className="text-sm text-gray-400 leading-relaxed list-disc">
                    You can check by entering your ID on the game website:{" "}
                    <span className="text-blue-300 font-small">
                      ctw-pay.elex.com
                    </span>
                    <PicturePlaceholder
                      label="discord-invite-screenshot.png"
                      src="/nine.jpg"
                    />
                    <span className="text-red-300 font-medium">
                        it costs 99.00 INR for 1+1 bars ,  You only pay me 99 x 0.8 = 79.2 INR for 1+1 bars. In US$ prices for $100 = you pay $80
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-sm font-semibold text-blue-300 mb-2">
                  2. In game Purchase
                </p>
                <ul className="space-y-1.5 pl-4">
                  <li className="text-sm text-gray-400 leading-relaxed list-disc">
                   The id doesnt work for everyone , You would get an error player information not found . That means you could only purchase through in game system.
                  </li>
                  <PicturePlaceholder
                      label="discord-invite-screenshot.png"
                      src="/ten.png"
                    />
                  <li className="text-sm text-gray-400 leading-relaxed list-disc">
                    The only way to purchase packages now is through the in-game system. You can find the package you want to buy in the game and send a screenshot , I login to your account and purchase it , you pay 80% of the price to me . 
                  </li>
                  <li className="text-sm text-red-400 leading-relaxed list-disc">
                    I earn 0.6-0.7% as a profit on all purchases you buy through me , this amount is donated to the Save Speechless Organization (SSO) , Non profit that helps stray animals in my city.
                  </li>
                  <li className="text-sm text-white-400 leading-relaxed list-disc">
                    Create a ticket if you are confused , follow step 1 and 2 above .
                  </li>
                </ul>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

function PicturePlaceholder({ label, src }: { label: string; src?: string }) {
  if (src) {
    return (
      <div className="rounded-lg overflow-hidden border border-white/10">
        <img src={src} alt={label} className="w-full h-full block" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-dashed border-white/10 bg-black/30 p-6 flex flex-col items-center justify-center gap-2 text-center">
      <ImageOff className="w-6 h-6 text-blue-400/60" />
      <p className="text-xs text-gray-500">
        Add screenshot: <span className="text-gray-400">{label}</span>
      </p>
    </div>
  );
}
