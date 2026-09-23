import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";
import BeamBorder from "@/components/ui/borderbeamcard";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Upload,
  AlertCircle,
  ArrowUpRight,
  Tag,
  X,
  CreditCard,
  Landmark,
  Smartphone,
  DollarSign,
  Coins,
  AlertTriangle,
} from "lucide-react";
import PicturePlaceholder from "../components/PicturePlaceholder";
import type { Coupon } from "../lib/types";
import {
  validateCoupon,
  computeDiscount,
  isItemEligibleForCoupon,
} from "../lib/coupons";
import { Loader } from "../components/LoadingSpinner";
import InputField from "../components/ui/input field"; // <-- Imported custom input

type PaymentMethod = {
  id: string;
  name: string;
  instructions: string;
  sort_order: number;
};

type PaymentInstruction = {
  text: string;
  image?: string;
  guideUrl?: string;
  payButtonUrl?: string;
  payButtonIcon?: string;
};

const PAYMENT_INSTRUCTIONS: Record<string, PaymentInstruction> = {
  "Bank Transfer [Wise](Recommended)": {
    text: `Send to Country: India
    Account Holder Name: Aman Maan 
    Account Number: 41331050755
Bank: State Bank of India
IFSC Code : SBIN0010314
    State : Maharashtra
    City : Nagpur
    Postcode : 440023
     
Send the exact total shown above and upload the receipt below.`,
    guideUrl: "/wise.pdf",
    image: "/re.png",
  },
  "Bank Transfer [Revolut](Recommended)": {
    text: `Send to Country: India
    Account Holder Name: Aman Maan 
    Account Number: 41331050755
Bank: State Bank of India
IFSC Code : SBIN0010314
    State : Maharashtra
    City : Nagpur
    Postcode : 440023
     
Send the exact total shown above and upload the receipt below.`,
    guideUrl: "/r1.pdf",
    image: "/re1.png",
  },
  "UPI (only for indian users)": {
    text: `UPI ID: castlep5kannon@oksbi 
   

Scan the QR code or send to the UPI ID above, then upload a screenshot of the successful payment.`,
    image: "/qr.jpeg",
  },
  PayPal: {
    text: `PayPal link : https://www.paypal.me/RHaeflinger

Send the exact total shown above as Friends & Family, then upload the payment screenshot.`,
    image: "/paypal.png",
    payButtonUrl: "https://www.paypal.me/RHaeflinger",
    payButtonIcon: "/paypal2.png",
  },
  Crypto: {
    text: "Only USDT is accepted. Please select your network/chain below and send only USDT to the corresponding address.",
  },
  "Crypto (USDT)": {
    text: "Only USDT is accepted. Please select your network/chain below and send only USDT to the corresponding address.",
  },
};

const DEFAULT_PAYMENT_INSTRUCTIONS: PaymentInstruction = {
  text: "Instructions for this payment method are coming soon. Please open a Discord ticket if you need help completing this payment.",
};

type ExchangeRate = {
  id: number;
  currency_code: string;
  rate_per_usd: number;
  symbol: string;
};

type CryptoNetwork = {
  id: string;
  name: string;
  badge: string;
  image: string;
  description: string;
};

const CRYPTO_NETWORKS: CryptoNetwork[] = [
  {
    id: "plasma",
    name: "Plasma",
    badge: "Plasma",
    image: "/plasma.jpeg",
    description: "Send USDT on the Plasma network to the address or QR code below:",
  },
  {
    id: "ton",
    name: "TON (TheOpenNetwork)",
    badge: "TON",
    image: "/TON.jpeg",
    description: "Send USDT on TON (TheOpenNetwork) to the address or QR code below:",
  },
  {
    id: "bep20",
    name: "Binance Smart Chain (BEP20)",
    badge: "BEP20",
    image: "/bep20.jpeg",
    description: "Send USDT on Binance Smart Chain (BEP20) to the address or QR code below:",
  },
];

const isCryptoPayment = (name: string) => {
  const lower = name.toLowerCase();
  return (
    lower.includes("crypto") ||
    lower.includes("usdt") ||
    lower.includes("bitcoin") ||
    lower.includes("ton") ||
    lower.includes("binance") ||
    lower.includes("plasma") ||
    lower.includes("bep20")
  );
};

const getPaymentIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (
    lower.includes("bank") ||
    lower.includes("wise") ||
    lower.includes("revolut")
  )
    return <Landmark className="w-5 h-5 text-gray-800" />;
  if (lower.includes("paypal"))
    return <DollarSign className="w-5 h-5 text-blue-800" />;
  if (lower.includes("upi"))
    return <Smartphone className="w-5 h-5 text-gray-800" />;
  if (isCryptoPayment(name))
    return <Coins className="w-5 h-5 text-amber-500" />;
  return <CreditCard className="w-5 h-5 text-gray-800" />;
};

export default function Checkout() {
  const { items, clearCart } = useCart();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [selectedCryptoNetwork, setSelectedCryptoNetwork] =
    useState<string>("plasma");
  const [paidConfirmed, setPaidConfirmed] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const [delivery, setDelivery] = useState({
    customer_name: "",
    castle_name: "",
    castle_level: "",
    kingdom: "",
    coordinates: "",
    whatsapp_number: "",
  });
  const [deliveryTouched, setDeliveryTouched] = useState(false);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponChecking, setCouponChecking] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponNotice, setCouponNotice] = useState<string | null>(null);

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
        .from("payment_methods")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (data) setPaymentMethods(data as PaymentMethod[]);

      const { data: rates } = await supabase
        .from("exchange_rates")
        .select("*")
        .order("id");
      if (rates) setExchangeRates(rates as ExchangeRate[]);
    })();
  }, []);

  const selectedPayment = paymentMethods.find((m) => m.id === selectedMethod);
  const { subtotal, discountAmount, finalTotal } = computeDiscount(
    appliedCoupon,
    items,
  );

  useEffect(() => {
    if (!appliedCoupon) return;
    const result = validateCoupon(appliedCoupon, items);
    if (!result.ok) {
      setAppliedCoupon(null);
      setCouponNotice(
        "Your coupon was removed: " +
          result.reason.charAt(0).toLowerCase() +
          result.reason.slice(1),
      );
    }
  }, [items]);

  const handleApplyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponError("Enter a coupon code.");
      return;
    }

    setCouponChecking(true);
    setCouponError(null);
    setCouponNotice(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", code)
        .maybeSingle();

      if (fetchError)
        throw new Error(
          "Could not validate that coupon right now. Please try again.",
        );
      if (!data) {
        setCouponError("Invalid coupon code.");
        return;
      }

      const coupon = data as Coupon;
      const result = validateCoupon(coupon, items);
      if (!result.ok) {
        setCouponError(result.reason);
        return;
      }

      setAppliedCoupon(coupon);
      setCouponInput("");
    } catch (err) {
      setCouponError(
        err instanceof Error
          ? err.message
          : "Something went wrong validating the coupon.",
      );
    } finally {
      setCouponChecking(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(null);
    setCouponNotice(null);
  };

  const canSubmit =
    !!selectedMethod &&
    paidConfirmed &&
    !!receiptFile &&
    !!deliveryValid &&
    !submitting;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);

    try {
      let couponToRecord: Coupon | null = null;
      if (appliedCoupon) {
        const { data: freshCoupon, error: couponFetchError } = await supabase
          .from("coupons")
          .select("*")
          .eq("code", appliedCoupon.code)
          .maybeSingle();

        if (couponFetchError || !freshCoupon) {
          setAppliedCoupon(null);
          throw new Error(
            "Your coupon is no longer available. Please review your total and try again.",
          );
        }

        const revalidation = validateCoupon(freshCoupon as Coupon, items);
        if (!revalidation.ok) {
          setAppliedCoupon(null);
          throw new Error(
            revalidation.reason + " Please review your total and try again.",
          );
        }

        couponToRecord = freshCoupon as Coupon;
      }

      const {
        discountAmount: finalDiscountAmount,
        finalTotal: amountDue,
        subtotal: preDiscountTotal,
      } = computeDiscount(couponToRecord, items);

      const fileExt = receiptFile!.name.split(".").pop();
      const fileName = `receipt-${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("receipts")
        .upload(fileName, receiptFile!);

      if (uploadError)
        throw new Error("Failed to upload receipt. Please try again.");

      const { data: publicUrlData } = supabase.storage
        .from("receipts")
        .getPublicUrl(fileName);

      const receiptUrl = publicUrlData.publicUrl;

      const activeCryptoNet = CRYPTO_NETWORKS.find(
        (n) => n.id === selectedCryptoNetwork,
      );
      const recordedPaymentMethod = selectedPayment
        ? isCryptoPayment(selectedPayment.name) && activeCryptoNet
          ? `${selectedPayment.name} (${activeCryptoNet.name})`
          : selectedPayment.name
        : null;

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          total: amountDue,
          subtotal: preDiscountTotal,
          discount_amount: finalDiscountAmount,
          coupon_code: couponToRecord?.code ?? null,
          status: "pending",
          receipt_url: receiptUrl,
          payment_method: recordedPaymentMethod,
          customer_name: delivery.customer_name.trim(),
          castle_name: delivery.castle_name.trim(),
          castle_level: delivery.castle_level.trim(),
          kingdom: delivery.kingdom.trim(),
          coordinates: delivery.coordinates.trim(),
          whatsapp_number: delivery.whatsapp_number.trim(),
        })
        .select("*")
        .single();

      if (orderError || !order) throw new Error("Failed to create order.");

      const orderItems = items.map((i) => {
        const discounted =
          !!couponToRecord &&
          isItemEligibleForCoupon(couponToRecord, i.item_type);
        return {
          order_id: order.id,
          item_type: i.item_type,
          item_id: i.item_id,
          name: i.name,
          description: i.description,
          price: Number(i.price),
          quantity: i.quantity,
          metadata: discounted
            ? {
                ...i.metadata,
                coupon_code: couponToRecord!.code,
                coupon_discount_percent: Number(
                  couponToRecord!.discount_percent,
                ),
              }
            : i.metadata,
        };
      });

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);
      if (itemsError) throw new Error("Failed to create order items.");

      if (couponToRecord) {
        try {
          await supabase.rpc("redeem_coupon", {
            coupon_code_input: couponToRecord.code,
          });
        } catch {
          // Silently fail best-effort redemption
        }
      }

      await clearCart();
      setAppliedCoupon(null);
      setOrderNumber(order.order_number);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (orderNumber) {
    return (
      <div className="pt-24 pb-24 min-h-screen bg-black text-white flex items-center justify-center font-sans">
        <div className="w-full max-w-lg mx-auto p-8 rounded-xl bg-[#161616] text-center shadow-2xl border border-white/5">
          <div className="w-16 h-16 rounded-full bg-[#1e2e1e] flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-[#4ade80]" />
          </div>
          <h1 className="text-2xl font-bold mb-3 tracking-tight">
            Order Created
          </h1>
          <p className="text-[#a3a3a3] mb-8">
            Your order has been submitted. We'll verify your payment and update
            the status shortly.
          </p>

          <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg p-5 mb-8">
            <p className="text-sm text-[#a3a3a3] mb-1 font-medium">
              Order Number
            </p>
            <p className="text-2xl font-bold text-white tracking-widest">
              {orderNumber}
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              to={`/track?order=${orderNumber}`}
              className="flex-1 py-3.5 rounded font-bold transition-all bg-white hover:bg-gray-200 text-black text-center"
            >
              Track Order
            </Link>
            <Link
              to="/"
              className="flex-1 py-3.5 rounded font-bold transition-all bg-[#2a2a2a] hover:bg-[#333] text-white text-center"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-24 min-h-screen bg-black text-white flex items-center justify-center font-sans">
        <div className="text-center">
          <p className="text-[#a3a3a3] mb-6 text-lg">Your cart is empty.</p>
          <Link
            to="/packages"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded font-bold transition-all bg-white hover:bg-gray-200 text-black"
          >
            Browse Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-32 min-h-screen bg-black font-sans text-white">
      <div className="w-full max-w-[640px] mx-auto px-4 md:px-0">
        <div className="text-center mb-12">
          <h1 className="text-[32px] font-bold text-white mb-2 tracking-tight">
            Choose How to Pay
          </h1>
          <p className="text-[#a3a3a3] text-sm font-medium">
            Review your order and select a payment method.
          </p>
        </div>

        <h2 className="text-base font-bold text-white mb-3 text-center tracking-wide">
          Cart Summary
        </h2>

        <BeamBorder
          size="pulse-outside"
          colorVariant="mono"
          theme="dark"
          active={true}
          strength={1}
          duration={1.1}
          beamWidth={2}
          className="w-full max-w-3xl mb-9"
        >
          <div
            className="relative flex flex-col gap-4 rounded-2xl p-8 text-white"
            style={{ backgroundColor: "transparent" }}
          >
            {/* Inner box 1: cart items */}
            <div
              className="relative flex flex-col gap-4 rounded-2xl p-8 text-white"
              style={{ backgroundColor: "transparent" }}
            >
              <div className="space-y-5">
                {items.map((item, idx) => {
                  const eligible =
                    !!appliedCoupon &&
                    isItemEligibleForCoupon(appliedCoupon, item.item_type);
                  return (
                    <div key={item.id}>
                      {idx > 0 && (
                        <div className="border-t border-white/10 mb-5" />
                      )}
                      <div className="flex items-center gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-white font-bold text-[15px] truncate">
                            {item.name}
                          </p>
                          {item.color_label && (
                            <p className="text-[#a3a3a3] text-sm mt-0.5 flex items-center gap-1.5">
                              Color:
                              {item.color_swatch && (
                                <span
                                  className="w-2 h-2 rounded-full inline-block"
                                  style={{ backgroundColor: item.color_swatch }}
                                />
                              )}
                              {item.color_label}
                            </p>
                          )}
                          {eligible && (
                            <div className="inline-flex mt-1.5 px-2 py-0.5 bg-[#c3e0ff] rounded text-[#003c80] text-xs font-bold tracking-tight">
                              Save {Number(appliedCoupon!.discount_percent)}%
                            </div>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-[#a3a3a3] text-sm">
                            {item.quantity}x
                          </p>
                          <p className="text-white font-bold">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inner box 2: shopping cart summary + coupon */}
            <div className="rounded-2xl bg-gradient-to-b from-[#111111]/80 to-[#1c1c1c]/80 p-5">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[13px] font-bold text-[#a3a3a3] uppercase tracking-wider"></span>
                <Link
                  to="/skins"
                  className="text-[#3e95ff] text-sm font-bold hover:underline tracking-wide"
                >
                  Add More Items
                </Link>
              </div>

              <div className="space-y-2 mb-3">
                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-[#4ade80] font-medium">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-lg">Total</span>
                  <span className="text-white font-bold text-xl">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
                {exchangeRates
                  .filter((r) => r.currency_code !== "USD")
                  .map((r) => (
                    <div
                      key={r.id}
                      className="flex justify-end text-xs text-[#a3a3a3] mt-1 font-medium"
                    >
                      <span>
                        ≈ {r.symbol}
                        {(finalTotal * Number(r.rate_per_usd)).toFixed(2)}{" "}
                        {r.currency_code}
                      </span>
                    </div>
                  ))}
                {/* Coupon Code Inline Input — logic untouched */}
                <div className="mt-5 pt-5 border-t border-white/10">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-[#1f1f1f] rounded-lg p-3 border border-[#333]">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#4ade80]" />
                        <span className="text-sm font-bold text-white">
                          {appliedCoupon.code} Applied
                        </span>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-[#a3a3a3] hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-5">
                        <div className="flex-1">
                          <InputField
                            label="Have a promo code?"
                            value={couponInput}
                            onChange={(e) => {
                              setCouponInput(e.target.value);
                              setCouponError(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleApplyCoupon();
                              }
                            }}
                            style={{ textTransform: "uppercase" }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={couponChecking || !couponInput.trim()}
                          className="px-5 rounded-[25px] font-bold text-sm bg-white hover:bg-gray-200 text-black disabled:opacity-80 disabled:hover:bg-white transition-colors"
                        >
                          {couponChecking ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            "Apply"
                          )}
                        </button>
                      </div>
                      {couponError && (
                        <p className="text-xs text-red-400 mt-2 font-medium">
                          {couponError}
                        </p>
                      )}
                      {couponNotice && !couponError && (
                        <p className="text-xs text-yellow-400 mt-2 font-medium">
                          {couponNotice}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </BeamBorder>

        <h2 className="text-base font-bold text-white mb-3 text-center tracking-wide">
          Delivery Details
        </h2>

        <div className="bg-[#161616] rounded-[38px] p-9 mb-10 shadow-lg border border-[#2a2a2a] grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
          <div className="sm:col-span-2">
            <InputField
              label="Your Name (Who makes the payment)"
              value={delivery.customer_name}
              onChange={(e) =>
                setDelivery((d) => ({ ...d, customer_name: e.target.value }))
              }
              onBlur={() => setDeliveryTouched(true)}
            />
          </div>
          <div>
            <InputField
              label="Castle Name"
              value={delivery.castle_name}
              onChange={(e) =>
                setDelivery((d) => ({ ...d, castle_name: e.target.value }))
              }
            />
          </div>
          <div>
            <InputField
              label="Castle Level (e.g. p2, p6)"
              value={delivery.castle_level}
              onChange={(e) =>
                setDelivery((d) => ({ ...d, castle_level: e.target.value }))
              }
            />
          </div>
          <div>
            <InputField
              label="Kingdom"
              value={delivery.kingdom}
              onChange={(e) =>
                setDelivery((d) => ({ ...d, kingdom: e.target.value }))
              }
            />
          </div>
          <div>
            <InputField
              label="Coordinates (e.g. 512:384)"
              value={delivery.coordinates}
              onChange={(e) =>
                setDelivery((d) => ({ ...d, coordinates: e.target.value }))
              }
            />
          </div>
          <div className="sm:col-span-2">
            <InputField
              label="WhatsApp Number (with country code)"
              value={delivery.whatsapp_number}
              onChange={(e) =>
                setDelivery((d) => ({ ...d, whatsapp_number: e.target.value }))
              }
            />
          </div>
          {deliveryTouched && !deliveryValid && (
            <p className="sm:col-span-2 text-sm text-red-400 font-medium mt-1">
              Please fill in all fields to continue.
            </p>
          )}
        </div>

        <h2 className="text-base font-bold text-white mb-3 text-center tracking-wide">
          Select Your Payment Method
        </h2>

        <BeamBorder
          size="pulse-outside"
          colorVariant="mono"
          theme="dark"
          active={true}
          strength={1}
          duration={1.1}
          beamWidth={2}
          className="w-full max-w-3xl mb-9"
        >
          <div
            className="relative flex flex-col gap-4 rounded-2xl p-8 text-white"
            style={{ backgroundColor: "transparent" }}
          >
            {/* Inner box 1: Payment Methods Dropdown */}
            <div className="rounded-2xl bg-gradient-to-b from-[#111111]/80 to-[#1c1c1c]/80 p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[13px] font-bold text-[#a3a3a3] uppercase tracking-wider">
                  Payment Options
                </span>
                {selectedPayment && (
                  <span className="text-xs text-[#4ade80] font-medium">
                    {selectedPayment.name} selected
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {paymentMethods.map((m) => {
                  const isSelected = selectedMethod === m.id;

                  return (
                    <div
                      key={m.id}
                      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                        isSelected
                          ? "border-white/30 bg-[#1f1f1f]/90 shadow-md"
                          : "border-[#2a2a2a] bg-[#141414]/90 hover:border-[#3a3a3a] hover:bg-[#1a1a1a]/90"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedMethod(isSelected ? "" : m.id)}
                        className="w-full flex justify-between items-center px-5 py-4 outline-none transition-colors"
                      >
                        <div className="flex items-center gap-3 text-left">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                              isSelected
                                ? "border-white bg-white"
                                : "border-[#555] bg-transparent"
                            }`}
                          >
                            {isSelected && (
                              <div className="w-1.5 h-1.5 rounded-full bg-black" />
                            )}
                          </div>
                          <span className="font-bold text-[15px] text-white">
                            {m.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-9 h-6 bg-white rounded flex items-center justify-center shadow-sm">
                            {getPaymentIcon(m.name)}
                          </div>
                          {isSelected ? (
                            <ChevronUp className="w-5 h-5 text-[#a3a3a3]" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-[#a3a3a3]" />
                          )}
                        </div>
                      </button>

                      {isSelected && (
                        <div className="px-5 pb-5 pt-1 border-t border-white/10 bg-[#111111]/90">
                          <div className="bg-[#1a1a1a] rounded-lg p-4 mt-3 border border-[#2a2a2a]">
                            {isCryptoPayment(m.name) ? (
                              <div className="space-y-4">
                                {/* USDT Warning Message */}
                                <div className="flex items-start gap-3 p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300">
                                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                  <div className="text-sm">
                                    <p className="font-bold text-amber-200 text-[14px]">
                                      Only USDT is Accepted
                                    </p>
                                    <p className="text-xs text-amber-300/90 mt-1 leading-relaxed">
                                      Please note that <strong>only USDT</strong> is accepted. Only send USDT to the following addresses on your chosen network.
                                    </p>
                                  </div>
                                </div>

                                {/* Network Selection Options */}
                                <div>
                                  <label className="block text-xs font-bold text-[#a3a3a3] uppercase tracking-wider mb-2.5">
                                    Select Your Network / Chain:
                                  </label>
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                    {CRYPTO_NETWORKS.map((network) => {
                                      const isNetworkActive =
                                        selectedCryptoNetwork === network.id;
                                      return (
                                        <button
                                          key={network.id}
                                          type="button"
                                          onClick={() =>
                                            setSelectedCryptoNetwork(network.id)
                                          }
                                          className={`px-3 py-3 rounded-lg text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 border ${
                                            isNetworkActive
                                              ? "bg-white text-black border-white shadow-md scale-[1.01]"
                                              : "bg-[#141414] text-[#a3a3a3] border-[#333] hover:text-white hover:border-[#555] hover:bg-[#1f1f1f]"
                                          }`}
                                        >
                                          <span>{network.name}</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Network Details & QR Image */}
                                {(() => {
                                  const activeNet =
                                    CRYPTO_NETWORKS.find(
                                      (n) => n.id === selectedCryptoNetwork,
                                    ) ?? CRYPTO_NETWORKS[0];
                                  return (
                                    <div className="pt-3 border-t border-[#2a2a2a] space-y-3">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                                          Network: {activeNet.name}
                                        </span>
                                        <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                                          USDT ({activeNet.badge})
                                        </span>
                                      </div>

                                      <p className="text-[13px] text-gray-300 leading-relaxed font-medium">
                                        {activeNet.description}
                                      </p>

                                      <div className="mt-3">
                                        <PicturePlaceholder
                                          label={`${activeNet.name} USDT Deposit Address & QR`}
                                          src={activeNet.image}
                                        />
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            ) : (
                              <div>
                                <p className="text-[14px] text-gray-300 whitespace-pre-line leading-relaxed font-medium">
                                  {
                                    (
                                      PAYMENT_INSTRUCTIONS[m.name] ??
                                      DEFAULT_PAYMENT_INSTRUCTIONS
                                    ).text
                                  }
                                </p>

                                <div className="flex flex-wrap gap-3 mt-4">
                                  {PAYMENT_INSTRUCTIONS[m.name]?.payButtonUrl && (
                                    <a
                                      href={PAYMENT_INSTRUCTIONS[m.name]!.payButtonUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 px-4 py-2 rounded bg-white hover:bg-gray-200 text-black font-bold text-sm transition-colors"
                                    >
                                      Pay Now <ArrowUpRight className="w-4 h-4" />
                                    </a>
                                  )}
                                  {PAYMENT_INSTRUCTIONS[m.name]?.guideUrl && (
                                    <a
                                      href={PAYMENT_INSTRUCTIONS[m.name]!.guideUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#333] hover:bg-[#444] text-white font-bold text-sm transition-colors"
                                    >
                                      View Guide
                                    </a>
                                  )}
                                </div>

                                {PAYMENT_INSTRUCTIONS[m.name]?.image && (
                                  <div className="mt-4 pt-4 border-t border-[#2a2a2a]">
                                    <PicturePlaceholder
                                      label="Payment Details"
                                      src={PAYMENT_INSTRUCTIONS[m.name]?.image}
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inner box 2: Upload Receipt & Submit Section */}
            <div className="rounded-2xl bg-gradient-to-b from-[#111111]/80 to-[#1c1c1c]/80 p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[13px] font-bold text-[#a3a3a3] uppercase tracking-wider">
                  Upload Payment Receipt
                </span>
                <span className="text-xs text-[#a3a3a3]">
                  PNG, JPG up to 10MB
                </span>
              </div>

              <form onSubmit={handleCheckout} className="space-y-5">
                <div>
                  <label className="block w-full">
                    <div
                      className={`border border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                        receiptFile
                          ? "border-[#4ade80] bg-[#4ade80]/10"
                          : "border-[#444] bg-[#141414] hover:bg-[#1a1a1a]"
                      }`}
                    >
                      {receiptFile ? (
                        <div className="flex flex-col items-center gap-2">
                          <Check className="w-6 h-6 text-[#4ade80]" />
                          <p className="text-sm text-[#4ade80] font-bold">
                            {receiptFile.name}
                          </p>
                          <p className="text-xs text-[#a3a3a3]">
                            Click to change receipt
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="w-6 h-6 text-[#a3a3a3]" />
                          <p className="text-sm text-white font-bold">
                            Upload Payment Receipt
                          </p>
                          <p className="text-xs text-[#a3a3a3]">
                            Click or drag file to attach proof
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setReceiptFile(e.target.files?.[0] ?? null)
                      }
                    />
                  </label>
                </div>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5 mt-0.5">
                    <input
                      type="checkbox"
                      checked={paidConfirmed}
                      onChange={(e) => setPaidConfirmed(e.target.checked)}
                      className="peer appearance-none w-5 h-5 border-2 border-[#555] rounded-sm bg-transparent checked:bg-white checked:border-white transition-colors cursor-pointer"
                    />
                    <Check
                      className="w-3.5 h-3.5 text-black absolute opacity-0 peer-checked:opacity-100 pointer-events-none font-bold"
                      strokeWidth={4}
                    />
                  </div>
                  <span className="text-[14px] text-[#a3a3a3] font-medium leading-snug group-hover:text-white transition-colors">
                    I confirm I have successfully transferred exactly{" "}
                    <strong className="text-white">
                      ${finalTotal.toFixed(2)}
                    </strong>{" "}
                    via{" "}
                    {selectedPayment
                      ? `${selectedPayment.name}${
                          isCryptoPayment(selectedPayment.name)
                            ? ` (${
                                (
                                  CRYPTO_NETWORKS.find(
                                    (n) => n.id === selectedCryptoNetwork,
                                  ) ?? CRYPTO_NETWORKS[0]
                                ).name
                              })`
                            : ""
                        }`
                      : "the selected payment method"}
                    .
                  </span>
                </label>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-900/30 border border-red-900/50">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-200 font-medium">
                      {error}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded font-bold text-[15px] transition-all bg-white hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-white text-black mt-2"
                >
                  {submitting ? "Processing..." : "Submit Order"}
                  {submitting && (
                    <Loader className="w-4 h-4 border-black" />
                  )}
                </button>

                {!canSubmit && !submitting && (
                  <p className="text-xs text-[#777] text-center font-medium">
                    {!selectedMethod
                      ? "Select a payment method above to submit."
                      : !deliveryValid
                        ? "Complete delivery details above to submit."
                        : !receiptFile
                          ? "Upload your receipt to submit."
                          : !paidConfirmed
                            ? "Confirm your payment to submit."
                            : ""}
                  </p>
                )}
              </form>
            </div>
          </div>
        </BeamBorder>

        <div className="text-center text-xs text-[#666] font-medium pb-8">
          <p>© 2026 Castle Kings. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
