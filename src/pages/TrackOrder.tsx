import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Search, Loader, Package, CheckCircle, Clock, XCircle, AlertCircle, Receipt } from 'lucide-react';

type OrderItem = {
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  item_type: string;
};

type Order = {
  id: string;
  order_number: string;
  total: number;
  status: string;
  payment_method: string | null;
  receipt_url: string | null;
  created_at: string;
  order_items: OrderItem[];
};

const statusSteps = [
  { key: 'pending', label: 'Order Created', icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-600/30' },
  { key: 'processing', label: 'Processing', icon: Clock, color: 'text-gold-400', bg: 'bg-gold-500/10', border: 'border-gold-600/30' },
  { key: 'completed', label: 'Completed', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-600/30' },
];

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('order') || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setOrder(null);
    setSearched(true);

    const { data, error: queryError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('order_number', query.trim().toUpperCase())
      .single();

    if (queryError || !data) {
      setError('Order not found. Please check your order number.');
      setLoading(false);
      return;
    }

    setOrder(data as Order);
    setLoading(false);
  };

  useEffect(() => {
    const initial = searchParams.get('order');
    if (initial) {
      setQuery(initial);
      // Auto-search
      search({ preventDefault: () => {} } as React.FormEvent);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentStepIndex = order
    ? order.status === 'cancelled'
      ? -1
      : statusSteps.findIndex(s => s.key === order.status)
    : -1;

  return (
    <div className="pt-20 pb-24 min-h-screen">
      <div className="container-game">
        <div className="text-center mb-12 mt-8">
          <span className="text-sm font-semibold text-crimson-400 tracking-wider uppercase">Order Tracking</span>
          <h1 className="heading-display text-4xl md:text-5xl font-bold text-white mt-2 mb-4">Track Your Order</h1>
          <p className="text-gray-400 max-w-xl mx-auto">Enter your order number to check the current status of your purchase.</p>
        </div>

        <div className="max-w-xl mx-auto mb-10">
          <form onSubmit={search} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Enter order number (e.g. AMAN-000001)"
                className="input-game pl-10 uppercase"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Track'}
            </button>
          </form>
        </div>

        {error && (
          <div className="max-w-xl mx-auto">
            <div className="card-game p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-gray-400">{error}</p>
            </div>
          </div>
        )}

        {searched && !error && !order && !loading && (
          <div className="max-w-xl mx-auto">
            <div className="card-game p-8 text-center">
              <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Enter an order number above to track your order.</p>
            </div>
          </div>
        )}

        {order && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            {/* Order status tracker */}
            <div className="card-game p-8">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm text-gray-500">Order Number</p>
                  <p className="heading-display text-xl font-bold text-gold-300">{order.order_number}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="text-sm text-gray-300">{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
              </div>

              {order.status === 'cancelled' ? (
                <div className="mt-6 flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-600/30">
                  <XCircle className="w-6 h-6 text-red-400" />
                  <div>
                    <p className="font-semibold text-red-400">Order Cancelled</p>
                    <p className="text-sm text-gray-500">This order has been cancelled. Please contact support if you have questions.</p>
                  </div>
                </div>
              ) : (
                <div className="mt-8">
                  <div className="flex items-center justify-between relative">
                    {/* Progress line */}
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-night-700" />
                    <div
                      className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-crimson-600 to-gold-500 transition-all duration-500"
                      style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                    />

                    {statusSteps.map((step, idx) => {
                      const Icon = step.icon;
                      const isComplete = idx <= currentStepIndex;
                      const isCurrent = idx === currentStepIndex;
                      return (
                        <div key={step.key} className="relative z-10 flex flex-col items-center gap-2 flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isComplete ? `${step.bg} ${step.border} ${step.color}` : 'bg-night-900 border-night-700 text-gray-600'} ${isCurrent ? 'ring-4 ring-crimson-600/20 scale-110' : ''}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className={`text-xs font-medium text-center ${isComplete ? step.color : 'text-gray-600'}`}>{step.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Order items */}
            <div className="card-game p-6">
              <h3 className="heading-display text-lg font-bold text-white mb-4">Items</h3>
              <div className="space-y-3">
                {order.order_items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm border-b border-night-700/50 pb-3 last:border-0">
                    <div>
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-gray-400">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-white font-semibold text-base mt-4 pt-3 border-t border-night-700">
                <span>Total</span>
                <span className="heading-display text-gold-300">${Number(order.total).toFixed(2)}</span>
              </div>
            </div>

            {/* Payment info */}
            <div className="card-game p-6">
              <h3 className="heading-display text-lg font-bold text-white mb-4">Payment Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Payment Method</p>
                  <p className="text-gray-300">{order.payment_method || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Status</p>
                  <p className="text-gray-300 capitalize">{order.status}</p>
                </div>
              </div>
              {order.receipt_url && (
                <div className="mt-4">
                  <p className="text-gray-500 text-sm mb-2">Receipt</p>
                  <a href={order.receipt_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-gold-300 hover:text-gold-200 transition-colors">
                    <Receipt className="w-4 h-4" /> View Receipt
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {!searched && (
          <div className="max-w-xl mx-auto">
            <div className="card-game p-8 text-center">
              <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">Enter your order number above to track its status.</p>
              <Link to="/" className="btn-outline text-sm">Back to Store</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
