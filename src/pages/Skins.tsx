import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useCart } from "../context/CartContext";
import { Loader, ShoppingCart, Package, Check } from "lucide-react";

type Skin = {
  id: string;
  name: string;
  hero_name: string;
  description: string;
  price: number;
  rarity: string;
  image_url: string | null;
  is_featured: boolean;
  stock_quantity: number;
};

const rarities = ["All", "Common", "Rare", "Epic", "Legendary"];

export default function Skins() {
  const [items, setItems] = useState<Skin[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [added, setAdded] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("skins")
        .select("*")
        .order("sort_order");
      if (data) setItems(data as Skin[]);
      setLoading(false);
    })();
  }, []);

  const handleAddToCart = async (skin: Skin) => {
    if (skin.stock_quantity <= 0) return;
    await addItem({
      item_type: "skin",
      item_id: skin.id,
      name: skin.name,
      description: skin.description,
      price: Number(skin.price),
      quantity: 1,
      metadata: { rarity: skin.rarity, hero_name: skin.hero_name },
    });
    setAdded(skin.id);
    setTimeout(() => setAdded(null), 2000);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Loader className="w-8 h-8 text-crimson-500 animate-spin" />
      </div>
    );

  const filtered =
    filter === "All" ? items : items.filter((s) => s.rarity === filter);

  return (
    <div className="pt-20 pb-24 min-h-screen">
      <div className="container-game">
        <div className="text-center mb-12 mt-8">
          <h1 className="heading-display text-4xl md:text-6xl font-bold text-white mt-2 mb-4">
            Castle Skins
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Skins you purchase are sent via envelope in game 
          </p>
          <p className="text-red-400 max-w-2xl mx-auto">
            Prices change every few days , keep watch for discounts.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {rarities.map((r) => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${filter === r ? "bg-crimson-900/30 border border-crimson-700/50 text-gold-300" : "border border-night-600 text-gray-400 hover:text-white hover:border-night-500"}`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((skin) => {
            const outOfStock = skin.stock_quantity <= 0;
            const lowStock =
              skin.stock_quantity > 0 && skin.stock_quantity <= 3;
            return (
              <div
                key={skin.id}
                className={`card-game overflow-hidden group ${outOfStock ? "opacity-60" : ""}`}
              >
                <div className="relative h-48 bg-gradient-to-br from-crimson-900/30 to-night-950 flex items-center justify-center overflow-hidden">
                  <img
                    src={skin.image_url || "/image.png"}
                    alt={skin.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const img = e.currentTarget;
                      img.style.display = "none";
                      const parent = img.parentElement;
                      if (parent && !parent.querySelector(".skin-fallback")) {
                        const fallback = document.createElement("div");
                        fallback.className =
                          "skin-fallback absolute inset-0 opacity-20";
                        fallback.style.backgroundImage =
                          "url(https://images.pexels.com/photos/167085/pexels-photo-167085.jpeg?auto=compress&cs=tinysrgb&w=600)";
                        fallback.style.backgroundSize = "cover";
                        parent.insertBefore(fallback, img);
                        const star = document.createElement("div");
                        star.className =
                          "absolute inset-0 flex items-center justify-center";
                        star.innerHTML =
                          '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(192,24,24,0.4)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
                        parent.appendChild(star);
                      }
                    }}
                  />
                  <div
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold border ${rarityClass(skin.rarity)} z-10`}
                  >
                    {skin.rarity}   
                  </div>
                  {outOfStock && (
                    <div className="absolute inset-0 bg-night-950/1 backdrop-blur-[0px] flex items-center justify-center z-20 transition-all duration-300"> 
                      <span className="heading-display text-lg font-bold text-red-500 uppercase tracking-wider bg-night-5/80 px-3 py-1 rounded border border-red-900/50">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="heading-display text-lg font-bold text-white">
                    {skin.name}
                  </h3>
                  <p className="text-sm text-crimson-400 mb-2">
                    {skin.hero_name}
                  </p>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                    {skin.description}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <Package
                      className={`w-4 h-4 ${outOfStock ? "text-red-400" : lowStock ? "text-gold-400" : "text-gray-500"}`}
                    />
                    <span
                      className={`text-xs font-medium ${outOfStock ? "text-red-400" : lowStock ? "text-gold-400" : "text-gray-500"}`}
                    >
                      {outOfStock
                        ? "Out of stock"
                        : `${skin.stock_quantity} available`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="heading-display text-xl font-bold text-gold-300">
                      ${skin.price}
                    </span>
                    <button
                      onClick={() => handleAddToCart(skin)}
                      disabled={outOfStock}
                      className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 active:scale-95 border disabled:opacity-40 disabled:cursor-not-allowed ${added === skin.id ? "border-green-600 text-green-400 bg-green-500/10" : "btn-primary"}`}
                    >
                      {added === skin.id ? (
                        <>
                          <Check /> Added
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" /> Add
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No skins found in this rarity tier.
          </div>
        )}
      </div>
    </div>
  );
}

function rarityClass(rarity: string) {
  const map: Record<string, string> = {
    Common: "badge-rarity-Common",
    Rare: "badge-rarity-Rare",
    Epic: "badge-rarity-Epic",
    Legendary: "badge-rarity-Legendary",
  };
  return map[rarity] || map.Common;
}
