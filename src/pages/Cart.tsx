import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingCart, ArrowRight, Loader } from 'lucide-react';

export default function Cart() {
  const { items, loading, removeItem, updateQuantity, total, count } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Loader className="w-8 h-8 text-crimson-500 animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-20 pb-24 min-h-screen">
        <div className="container-game">
          <div className="text-center py-20">
            <ShoppingCart className="w-16 h-16 text-gray-700 mx-auto mb-6" />
            <h1 className="heading-display text-2xl font-bold text-white mb-2">Your cart is empty</h1>
            <p className="text-gray-500 mb-8">Browse the store and add items to your cart</p>
            <Link to="/packages" className="btn-primary">Browse Store</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-24 min-h-screen">
      <div className="container-game">
        <h1 className="heading-display text-3xl font-bold text-white mb-2 mt-4">Your Cart</h1>
        <p className="text-gray-500 text-sm mb-8">{count} item{count !== 1 ? 's' : ''}</p>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {items.map(item => (
              <div key={item.id} className="card-game p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-crimson-400 uppercase tracking-wider">{item.item_type}</span>
                  </div>
                  <h4 className="font-semibold text-white truncate">{item.name}</h4>
                  {item.description && <p className="text-sm text-gray-500 truncate">{item.description}</p>}
                </div>
                <div className="flex items-center gap-2">
                  {item.item_type === 'castle' ? (
                    <span className="w-8 text-center text-white font-semibold" title="Only one of this castle is available">1</span>
                  ) : (
                    <>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg border border-night-600 text-gray-400 hover:text-white hover:border-gold-600/40 transition-colors"
                      >-</button>
                      <span className="w-8 text-center text-white font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg border border-night-600 text-gray-400 hover:text-white hover:border-gold-600/40 transition-colors"
                      >+</button>
                    </>
                  )}
                </div>
                <span className="heading-display text-lg font-bold text-gold-300 w-20 text-right">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="card-game p-6 h-fit sticky top-24">
            <h3 className="heading-display text-lg font-bold text-white mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-gray-400">
                <span>Items</span>
                <span>{count}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="border-t border-night-700 pt-2 flex justify-between text-white font-semibold text-base">
                <span>Total</span>
                <span className="heading-display text-gold-300">${total.toFixed(2)}</span>
              </div>
            </div>
            <Link to="/checkout" className="btn-primary w-full">
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/packages" className="btn-outline w-full mt-3 text-sm py-2.5">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}