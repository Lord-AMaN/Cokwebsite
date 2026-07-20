import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { Loader, Check, ChevronDown, Upload, AlertCircle, FileText, Package, MapPin, ArrowUpRight } from 'lucide-react';
import PicturePlaceholder from '../components/PicturePlaceholder';

type PaymentMethod = {
  id: string;
  name: string;
  instructions: string;
  sort_order: number;
};

// Instructions are now coded here instead of pulled from the database.
// Key must match the payment method's `name` column in Supabase exactly.
// `image` is optional — point it at a file in /public (e.g. '/upi-qr.png').
// Leave it out and a placeholder box will show instead, telling you what to add.
type PaymentInstruction = {
  text: string;
  image?: string;
  guideUrl?: string;
  payButtonUrl?: string;
  payButtonIcon?: string;
};

const PAYMENT_INSTRUCTIONS: Record<string, PaymentInstruction> = {
  'Bank Transfer [Wise](Recommended)': {
    text: `Send to Country: India
    Account Holder Name: Aman Maan 
    Account Number: 41331050755
Bank: State Bank of India
IFSC Code : SBIN0010314
    State : Maharashtra
    City : Nagpur
    Postcode : 440023
     
Send the exact total shown above and upload the receipt below.`,
guideUrl: '/wise.pdf',
 image: '/re.png',
  },

  'Bank Transfer [Revolut](Recommended)': {
    text: `Send to Country: India
    Account Holder Name: Aman Maan 
    Account Number: 41331050755
Bank: State Bank of India
IFSC Code : SBIN0010314
    State : Maharashtra
    City : Nagpur
    Postcode : 440023
     
Send the exact total shown above and upload the receipt below.`,
guideUrl: '/r1.pdf',
image: '/re1.png',

  },
  
  'UPI (only for indian users)': {
    text: `UPI ID: castlep5kannon@oksbi 
   

Scan the QR code or send to the UPI ID above, then upload a screenshot of the successful payment.`,
    image: '/qr.jpeg',
  },
  'PayPal': {
    text: `PayPal link : https://www.paypal.me/RHaeflinger

Send the exact total shown above as Friends & Family, then upload the payment screenshot.`,
    image: '/paypal.png',
    payButtonUrl: 'https://www.paypal.me/RHaeflinger',
    payButtonIcon: '/paypal2.png',
  },
};

const DEFAULT_PAYMENT_INSTRUCTIONS: PaymentInstruction = {
  text: 'Instructions for this payment method are coming soon. Please open a Discord ticket if you need help completing this payment.',
};

type ExchangeRate = {
  id: number;
  currency_code: string;
  rate_per_usd: number;
  symbol: string;
};

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [paidConfirmed, setPaidConfirmed] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const [delivery, setDelivery] = useState({
    customer_name: '',
    castle_name: '',
    castle_level: '',
    kingdom: '',
    coordinates: '',
    whatsapp_number: '',
  });
  const [deliveryTouched, setDeliveryTouched] = useState(false);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);

  const deliveryValid =
    delivery.customer_name.trim() &&
    delivery.castle_name.trim() &&
    delivery.castle_level.trim() &&
    delivery.kingdom.trim() &&
    delivery.coordinates.trim() &&
    delivery.whatsapp_number.trim();

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (data) setPaymentMethods(data as PaymentMethod[]);

      const { data: rates } = await supabase
        .from('exchange_rates')
        .select('*')
        .order('id');
      if (rates) setExchangeRates(rates as ExchangeRate[]);
    })();
  }, []);

  const selectedPayment = paymentMethods.find(m => m.id === selectedMethod);

  const canSubmit = !!selectedMethod && paidConfirmed && !!receiptFile && !!deliveryValid && !submitting;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);

    try {
      // Upload receipt to storage
      const fileExt = receiptFile!.name.split('.').pop();
      const fileName = `receipt-${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(fileName, receiptFile!);

      if (uploadError) throw new Error('Failed to upload receipt. Please try again.');

      const { data: publicUrlData } = supabase.storage
        .from('receipts')
        .getPublicUrl(fileName);

      const receiptUrl = publicUrlData.publicUrl;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          total,
          status: 'pending',
          receipt_url: receiptUrl,
          payment_method: selectedPayment?.name ?? null,
          customer_name: delivery.customer_name.trim(),
          castle_name: delivery.castle_name.trim(),
          castle_level: delivery.castle_level.trim(),
          kingdom: delivery.kingdom.trim(),
          coordinates: delivery.coordinates.trim(),
          whatsapp_number: delivery.whatsapp_number.trim(),
        })
        .select('*')
        .single();

      if (orderError || !order) throw new Error('Failed to create order.');

      // Create order items (triggers stock decrement)
      const orderItems = items.map(i => ({
        order_id: order.id,
        item_type: i.item_type,
        item_id: i.item_id,
        name: i.name,
        description: i.description,
        price: Number(i.price),
        quantity: i.quantity,
        metadata: i.metadata,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw new Error('Failed to create order items.');

      await clearCart();
      setOrderNumber(order.order_number);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  // Success screen
  if (orderNumber) {
    return (
      <div className="pt-20 pb-24 min-h-screen flex items-center justify-center">
        <div className="container-game max-w-lg">
          <div className="rounded-2xl p-10 text-center backdrop-blur-xl bg-gradient-to-br from-black/70 via-slate-900/60 to-blue-950/50 border border-white/10 shadow-lg">
            <div className="w-16 h-16 rounded-full bg-green-600/20 border border-green-600/40 flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="heading-display text-2xl font-bold text-white mb-2">Order Created!</h1>
            <p className="text-gray-400 mb-6">Your order has been submitted. We'll verify your payment and update the status shortly.</p>
            <div className="bg-black/30 border border-white/10 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">Your Order Number</p>
              <p className="heading-display text-2xl font-bold text-blue-300">{orderNumber}</p>
            </div>
            <div className="flex gap-3 justify-center">
              <Link
                to={`/track?order=${orderNumber}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-200 active:scale-95 bg-blue-400 hover:bg-blue-300 text-slate-950"
                style={{ fontFamily: '"Cinzel", Georgia, serif' }}
              >
                Track Order
              </Link>
              <Link
                to="/"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-200 active:scale-95 bg-white/5 border border-white/10 text-gray-200 hover:border-blue-400/40 hover:bg-blue-500/10"
                style={{ fontFamily: '"Cinzel", Georgia, serif' }}
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="pt-20 pb-24 min-h-screen flex items-center justify-center">
        <div className="container-game max-w-md text-center">
          <p className="text-gray-400 mb-6">Your cart is empty.</p>
          <Link
            to="/packages"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-200 active:scale-95 bg-blue-400 hover:bg-blue-300 text-slate-950"
            style={{ fontFamily: '"Cinzel", Georgia, serif' }}
          >
            Browse Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-24 min-h-screen">
      <div className="container-game">
        <h1 className="heading-display text-3xl font-bold text-white mt-4 mb-8">Checkout & Payment</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Dropdown 1: Order Summary */}
            <details className="rounded-2xl p-6 group backdrop-blur-xl bg-gradient-to-br from-black/70 via-slate-900/60 to-blue-950/50 border border-white/10 shadow-lg" open>
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 backdrop-blur flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-300" />
                  </div>
                  <h3 className="heading-display text-lg font-bold text-white">Order Summary</h3>
                </div>
                <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-open:bg-blue-500/10 group-open:border-blue-400/30 transition-colors">
                  <ChevronDown className="w-4 h-4 text-gray-400 group-open:text-blue-300 group-open:rotate-180 transition-transform" />
                </div>
              </summary>
              <div className="mt-4 space-y-3">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm border-b border-white/10 pb-3">
                    <div className="min-w-0">
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-gray-500 text-xs">Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</p>
                    </div>
                    <span className="text-gray-300 flex-shrink-0">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-white font-semibold text-base pt-2">
                  <span>Total Amount</span>
                  <span className="heading-display text-blue-300 text-xl">${total.toFixed(2)}</span>
                </div>
                {exchangeRates.filter(r => r.currency_code !== 'USD').map(r => (
                  <div key={r.id} className="flex justify-between text-sm text-gray-400 pt-1">
                    <span>≈ {r.currency_code} (1 USD = {r.rate_per_usd} {r.currency_code})</span>
                    <span className="font-medium">{r.symbol}{(total * Number(r.rate_per_usd)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </details>

            {/* Dropdown 2: Delivery Details */}
            <details className="rounded-2xl p-6 group backdrop-blur-xl bg-gradient-to-br from-black/70 via-slate-900/60 to-blue-950/50 border border-white/10 shadow-lg" open>
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 backdrop-blur flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-300" />
                  </div>
                  <h3 className="heading-display text-lg font-bold text-white">Delivery Details</h3>
                </div>
                <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-open:bg-blue-500/10 group-open:border-blue-400/30 transition-colors">
                  <ChevronDown className="w-4 h-4 text-gray-400 group-open:text-blue-300 group-open:rotate-180 transition-transform" />
                </div>
              </summary>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="label-game">Your Name (who makes the payment)</label>
                  <input
                    value={delivery.customer_name}
                    onChange={e => setDelivery(d => ({ ...d, customer_name: e.target.value }))}
                    onBlur={() => setDeliveryTouched(true)}
                    placeholder="John Doe"
                    className="w-full rounded-lg px-4 py-2.5 transition-all focus:outline-none bg-black/30 backdrop-blur border border-white/10 text-gray-200 placeholder:text-gray-500 focus:border-blue-400/50"
                  />
                </div>
                <div>
                  <label className="label-game">Castle Name</label>
                  <input
                    value={delivery.castle_name}
                    onChange={e => setDelivery(d => ({ ...d, castle_name: e.target.value }))}
                    placeholder="Iron Keep"
                    className="w-full rounded-lg px-4 py-2.5 transition-all focus:outline-none bg-black/30 backdrop-blur border border-white/10 text-gray-200 placeholder:text-gray-500 focus:border-blue-400/50"
                  />
                </div>
                <div>
                  <label className="label-game">Castle Level</label>
                  <input
                    value={delivery.castle_level}
                    onChange={e => setDelivery(d => ({ ...d, castle_level: e.target.value }))}
                    placeholder="p2, p6..."
                    className="w-full rounded-lg px-4 py-2.5 transition-all focus:outline-none bg-black/30 backdrop-blur border border-white/10 text-gray-200 placeholder:text-gray-500 focus:border-blue-400/50"
                  />
                </div>
                <div>
                  <label className="label-game">Kingdom</label>
                  <input
                    value={delivery.kingdom}
                    onChange={e => setDelivery(d => ({ ...d, kingdom: e.target.value }))}
                    placeholder="Kingdom name"
                    className="w-full rounded-lg px-4 py-2.5 transition-all focus:outline-none bg-black/30 backdrop-blur border border-white/10 text-gray-200 placeholder:text-gray-500 focus:border-blue-400/50"
                  />
                </div>
                <div>
                  <label className="label-game">Coordinates</label>
                  <input
                    value={delivery.coordinates}
                    onChange={e => setDelivery(d => ({ ...d, coordinates: e.target.value }))}
                    placeholder="e.g. 512:384"
                    className="w-full rounded-lg px-4 py-2.5 transition-all focus:outline-none bg-black/30 backdrop-blur border border-white/10 text-gray-200 placeholder:text-gray-500 focus:border-blue-400/50"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="label-game">WhatsApp Number</label>
                  <input
                    value={delivery.whatsapp_number}
                    onChange={e => setDelivery(d => ({ ...d, whatsapp_number: e.target.value }))}
                    placeholder="countrycode-number (e.g. 91-9876543210)"
                    className="w-full rounded-lg px-4 py-2.5 transition-all focus:outline-none bg-black/30 backdrop-blur border border-white/10 text-gray-200 placeholder:text-gray-500 focus:border-blue-400/50"
                  />
                </div>
                {deliveryTouched && !deliveryValid && (
                  <p className="sm:col-span-2 text-xs text-red-400">Please fill in all delivery fields.</p>
                )}
              </div>
            </details>

            {/* Dropdown 3: Payment Methods */}
            <details className="rounded-2xl p-6 group backdrop-blur-xl bg-gradient-to-br from-black/70 via-slate-900/60 to-blue-950/50 border border-white/10 shadow-lg" open>
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 backdrop-blur flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-300" />
                  </div>
                  <h3 className="heading-display text-lg font-bold text-white">Payment Method</h3>
                </div>
                <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-open:bg-blue-500/10 group-open:border-blue-400/30 transition-colors">
                  <ChevronDown className="w-4 h-4 text-gray-400 group-open:text-blue-300 group-open:rotate-180 transition-transform" />
                </div>
              </summary>
              <div className="mt-4 space-y-3">
                <select
                  value={selectedMethod}
                  onChange={e => setSelectedMethod(e.target.value)}
                  className="w-full rounded-lg px-4 py-2.5 transition-all focus:outline-none bg-black/30 backdrop-blur border border-white/10 text-gray-200 placeholder:text-gray-500 focus:border-blue-400/50"
                >
                  <option value="" style={{ backgroundColor: '#0f172a', color: '#d1d5db' }}>Select a payment method...</option>
                  {paymentMethods.map(m => (
                    <option key={m.id} value={m.id} style={{ backgroundColor: '#0f172a', color: '#d1d5db' }}>{m.name}</option>
                  ))}
                </select>

                {selectedPayment && (
                  <div className="bg-black/30 rounded-lg p-4 border border-white/10 space-y-3">
                    <p className="text-sm font-semibold text-blue-300">{selectedPayment.name}</p>
                    <p className="text-sm text-gray-400 whitespace-pre-line leading-relaxed">
                      {(PAYMENT_INSTRUCTIONS[selectedPayment.name] ?? DEFAULT_PAYMENT_INSTRUCTIONS).text}
                    </p>

                    {PAYMENT_INSTRUCTIONS[selectedPayment.name]?.payButtonUrl && (
                      <div className="flex justify-center py-1">
                        <a
                          href={PAYMENT_INSTRUCTIONS[selectedPayment.name]!.payButtonUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 pl-3 pr-2 py-2 rounded-full bg-blue-400 hover:bg-blue-300 transition-colors duration-200 active:scale-95"
                        >
                          {PAYMENT_INSTRUCTIONS[selectedPayment.name]?.payButtonIcon && (
                            <img
                              src={PAYMENT_INSTRUCTIONS[selectedPayment.name]!.payButtonIcon}
                              alt={selectedPayment.name}
                              className="h-6 w-auto rounded"
                            />
                          )}
                          <span className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center flex-shrink-0">
                            <ArrowUpRight className="w-4 h-4 text-white" />
                          </span>
                        </a>
                      </div>
                    )}

                    {PAYMENT_INSTRUCTIONS[selectedPayment.name]?.guideUrl && (
                      <a
                        href={PAYMENT_INSTRUCTIONS[selectedPayment.name]!.guideUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200 active:scale-95 bg-green-500 hover:bg-green-400 text-slate-950"
                        style={{ fontFamily: '"Cinzel", Georgia, serif' }}
                      >
                        Open Guide
                      </a>
                    )}
                    <PicturePlaceholder
                      label={`${selectedPayment.name}-instructions.png`}
                      src={PAYMENT_INSTRUCTIONS[selectedPayment.name]?.image}
                    />
                  </div>
                )}
              </div>
            </details>

            {/* Receipt upload & confirmation */}
            <form onSubmit={handleCheckout} className="rounded-2xl p-6 space-y-5 backdrop-blur-xl bg-gradient-to-br from-black/70 via-slate-900/60 to-blue-950/50 border border-white/10 shadow-lg">
              <div>
                <h3 className="heading-display text-lg font-bold text-white mb-2">Upload Payment Receipt</h3>
                <p className="text-sm text-gray-500 mb-4 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-300 flex-shrink-0 mt-0.5" />
                  <span>You are required to upload the payment receipt/screenshot for the order to be generated.</span>
                </p>

                <label className="block">
                  <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${receiptFile ? 'border-green-600/50 bg-green-500/5' : 'border-white/10 bg-black/30 hover:border-blue-400/40 hover:bg-blue-500/5'}`}>
                    {receiptFile ? (
                      <div className="flex flex-col items-center gap-2">
                        <Check className="w-8 h-8 text-green-400" />
                        <p className="text-sm text-green-400 font-medium">{receiptFile.name}</p>
                        <p className="text-xs text-gray-500">Click to change file</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-blue-400" />
                        <p className="text-sm text-gray-400">Click to upload receipt/screenshot</p>
                        <p className="text-xs text-gray-600">PNG, JPG up to 10MB</p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => setReceiptFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>

              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-colors">
                <input
                  type="checkbox"
                  checked={paidConfirmed}
                  onChange={e => setPaidConfirmed(e.target.checked)}
                  className="mt-0.5 w-5 h-5 rounded accent-blue-500 flex-shrink-0"
                />
                <span className="text-sm text-gray-300">
                  I have paid the amount using the payment method I selected above.
                </span>
              </label>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-600/30">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full inline-flex items-center justify-center gap-3 pl-6 pr-2 py-2 rounded-full font-semibold transition-all duration-200 active:scale-95 bg-blue-400 hover:bg-blue-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-400"
              >
                <span className="text-sm text-slate-950" style={{ fontFamily: '"Cinzel", Georgia, serif' }}>
                  {submitting ? 'Processing...' : 'Payment Completed — Generate Order'}
                </span>
                <span className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center flex-shrink-0">
                  {submitting ? <Loader className="w-4 h-4 text-white animate-spin" /> : <Check className="w-4 h-4 text-white" />}
                </span>
              </button>

              {!canSubmit && !submitting && (
                <p className="text-xs text-gray-600 text-center">
                  {!deliveryValid ? 'Fill in all delivery details' : !selectedMethod ? 'Select a payment method' : !paidConfirmed ? 'Confirm you have paid' : !receiptFile ? 'Upload your receipt' : ''}
                </p>
              )}
            </form>
          </div>

          {/* Sidebar summary */}
          <div className="rounded-2xl p-6 h-fit sticky top-24 backdrop-blur-xl bg-gradient-to-br from-black/70 via-slate-900/60 to-blue-950/50 border border-white/10 shadow-lg">
            <h3 className="heading-display text-lg font-bold text-white mb-4">Summary</h3>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">{item.name}</p>
                    <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-gray-400 flex-shrink-0">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between text-white font-semibold text-base">
              <span>Total</span>
              <span className="heading-display text-blue-300">${total.toFixed(2)}</span>
            </div>
            {exchangeRates.filter(r => r.currency_code !== 'USD').map(r => (
              <div key={r.id} className="flex justify-between text-sm text-gray-400 pt-1">
                <span>≈ {r.currency_code} (1 USD = {r.rate_per_usd} {r.currency_code})</span>
                <span className="font-medium">{r.symbol}{(total * Number(r.rate_per_usd)).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}