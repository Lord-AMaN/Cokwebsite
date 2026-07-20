import { useState, useMemo, useEffect } from 'react';
import { Calculator, RotateCcw, ShoppingCart, Loader, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';

type Resource = {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  stock_quantity_millions: number;
};

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('resources')
        .select('*')
        .order('sort_order');
      if (data) {
        const rows = data as (typeof data)[number][];
        const mapped: Resource[] = rows.map(r => ({
          id: r.id,
          name: r.name,
          image: r.image_url || '/wood.png',
          price: Number(r.price),
          description: r.description || '',
          stock_quantity_millions: r.stock_quantity_millions,
        }));
        setResources(mapped);
        setQuantities(Object.fromEntries(mapped.map(r => [r.name, 0])));
      }
      setLoading(false);
    })();
  }, []);

  const lineTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const r of resources) {
      totals[r.name] = (quantities[r.name] || 0) * r.price;
    }
    return totals;
  }, [quantities, resources]);

  const grandTotal = useMemo(() => {
    return Object.values(lineTotals).reduce((sum, v) => sum + v, 0);
  }, [lineTotals]);

  const handleAddToCart = async () => {
    if (grandTotal === 0) return;
    const selected = resources
      .filter(r => quantities[r.name] > 0)
      .map(r => `${quantities[r.name]}M ${r.name}`)
      .join(', ');

    await addItem({
      item_type: 'resource',
      item_id: null,
      name: 'Resource Bundle',
      description: selected,
      price: grandTotal,
      quantity: 1,
      metadata: { quantities },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleQty = (name: string, value: string) => {
    const res = resources.find(r => r.name === name);
    const maxAvailable = res?.stock_quantity_millions ?? 0;
    let num = value === '' ? 0 : Math.max(0, parseInt(value) || 0);

    if (num > maxAvailable) {
      num = maxAvailable;
    }

    setQuantities(prev => ({ ...prev, [name]: num }));
  };

  const reset = () => {
    setQuantities(Object.fromEntries(resources.map(r => [r.name, 0])));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Loader className="w-8 h-8 text-green-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-20 pb-24 min-h-screen">
      <div className="container-game">
        <div className="text-center mb-16 mt-8">
          <h1 className="heading-display text-4xl md:text-6xl font-bold text-white mt-2 mb-4">Buy Resources</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Resources will be given to you in plunder from a farm with protection from a P6 castle</p>
          <p className="text-red-400 max-w-2xl mx-auto">Euros(€) and INR(₹) conversions will be at checkout</p>
          <p className="text-yellow-400 max-w-2xl mx-auto">Note : Kingdom restrictions apply , only buy if your kingdom has joined plunder and is able to visit "K21" , mostly odd numbered Kingdom join in the slot with k21.</p>
        </div>

        {/* Resource Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {resources.map((res) => {
            const availableStock = res.stock_quantity_millions;
            const outOfStock = availableStock <= 0;
            const lowStock = availableStock > 0 && availableStock <= 50;

            return (
              <div key={res.name} className={`card-game overflow-hidden group flex flex-col ${outOfStock ? 'opacity-60' : ''}`}>
                <div className="relative h-48 bg-gradient-to-br from-crimson-900/20 to-night-950 flex items-center justify-center overflow-hidden">
                  <img src={res.image} alt={res.name} className="max-w-full max-h-full object-contain p-4" />

                  {outOfStock && (
                    <div className="absolute inset-0 bg-night-950/1 backdrop-blur-[0px] flex items-center justify-center z-20 transition-all duration-300">
                      <span className="heading-display text-base font-bold text-red-500 uppercase tracking-wider bg-black/80 px-3 py-1 rounded border border-red-900/50 shadow-[0_0_10px_rgba(0,0,0,0.8)]">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="heading-display text-xl font-bold text-white mb-1">{res.name}</h3>

                  <div className="flex items-center gap-1.5 mb-3">
                    <Package className={`w-3.5 h-3.5 ${outOfStock ? 'text-red-400' : lowStock ? 'text-gold-400' : 'text-green-500'}`} />
                    <span className={`text-xs font-medium ${outOfStock ? 'text-red-400' : lowStock ? 'text-gold-400' : 'text-gray-500'}`}>
                      {outOfStock ? 'Out of stock' : `${availableStock}M available`}
                    </span>
                  </div>

                  <p className="text-sm text-gray-400 mb-4 flex-1">{res.description}</p>
                  <div className="flex items-baseline justify-between">
                    <span className="heading-display text-2xl font-bold text-gold-300">${res.price}</span>
                    <span className="text-xs text-gray-500">/ million</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Price Calculator Console */}
        <div className="max-w-3xl mx-auto">
          <div className="p-6 md:p-8 bg-black border border-green-900/50 rounded-2xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-green-900/20 border border-green-700/30 flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h2 className="heading-display text-2xl font-bold text-white">PRICE CALCULATOR</h2>
                  <p className="text-sm text-gray-500">Enter quantities in millions to get your total</p>
                </div>
              </div>
              <button
                onClick={reset}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-green-400 transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            </div>

            <div className="space-y-4">
              {resources.map((res) => {
                const availableStock = res.stock_quantity_millions;
                const isItemDisabled = availableStock <= 0;

                return (
                  <div key={res.name} className={`grid grid-cols-12 gap-3 items-center ${isItemDisabled ? 'opacity-40' : ''}`}>
                    <div className="col-span-4 sm:col-span-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-black border border-green-900 flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img src={res.image} alt={res.name} className="w-full h-full object-contain p-0.5" />
                      </div>
                      <span className="font-roboto mono text-sm text-green-500">{res.name}</span>
                    </div>

                    <div className="col-span-3 sm:col-span-2 text-right text-xs text-gray-600 hidden sm:block italic">
                      {isItemDisabled ? 'Unavailable' : `Max: ${availableStock}M`}
                    </div>

                    <div className="col-span-5 sm:col-span-4">
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max={availableStock}
                          disabled={isItemDisabled}
                          value={quantities[res.name] || ''}
                          onChange={(e) => handleQty(res.name, e.target.value)}
                          placeholder={isItemDisabled ? "0" : `0 - ${availableStock}`}
                          className="w-full bg-black border border-green-900 py-2 text-center text-white rounded outline-none focus:border-green-500 pr-12 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-600 pointer-events-none italic">million</span>
                      </div>
                    </div>

                    <div className="col-span-3 text-right">
                      <span className="heading-display text-lg font-roboto mono text-green-400">
                        ${lineTotals[res.name].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="my-6 border-t border-green-900" />

            <div className="flex items-center justify-between mb-6">
              <span className="heading-display text-xl font-roboto mono text-white">Total Price</span>
              <div className="text-right">
                <span className="heading-display text-3xl md:text-4xl font-roboto mono text-white">
                  ${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-green-600 hover:bg-green-400 text-black font-bold py-4 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-green-600"
                disabled={grandTotal === 0}
              >
                {grandTotal > 0 ? `Purchase for ${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : 'Enter quantities to purchase'}
              </button>
              <button
                onClick={handleAddToCart}
                disabled={grandTotal === 0}
                className={`flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold text-sm transition-all duration-200 active:scale-95 border disabled:opacity-50 ${added ? 'border-green-600 text-green-400 bg-green-500/10' : 'border-green-900 text-gray-300 hover:text-green-400 hover:border-green-600'}`}
                style={{ fontFamily: 'Cinzel, Georgia, serif' }}
              >
                <ShoppingCart className="w-4 h-4" /> {added ? 'Added!' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
