import { Trash2, Minus, Plus } from 'lucide-react';
import type { ReactNode } from 'react';
import type { CartItem } from '../context/CartContext';

export type ExchangeRate = {
  id: number;
  currency_code: string;
  rate_per_usd: number;
  symbol: string;
};

const ITEM_TYPE_LABELS: Record<CartItem['item_type'], string> = {
  package: 'Package',
  skin: 'Skin',
  consultation: 'Consultation',
  resource: 'Resources',
  castle: 'Castle',
  bot_farm: 'Bot Farm',
};

type CartItemsListProps = {
  items: CartItem[];
  /** When provided, quantity steppers are rendered and this is called on change. */
  onUpdateQuantity?: (id: string, quantity: number) => void;
  /** When provided, a remove button is rendered for every item. */
  onRemove?: (id: string) => void;
  /** Optional map of item id -> discount percent, rendered as a "Save X%" badge. */
  savingsByItemId?: Record<string, number>;
  /** Item types that can only be bought once render a static quantity instead of steppers. */
  singleQuantityItemTypes?: CartItem['item_type'][];
};

/**
 * The shared cart line-item list used by both the Cart and the Checkout page so
 * the two screens read as one continuous flow.
 *
 * Layout: on phones the identity block (type, name, description) stacks above a
 * full-width control row (steppers, price, remove). From `sm` up it returns to
 * the side-by-side row. Touch targets are 44px on phones and 32px on desktop.
 */
export function CartItemsList({
  items,
  onUpdateQuantity,
  onRemove,
  savingsByItemId,
  singleQuantityItemTypes = [],
}: CartItemsListProps) {
  return (
    <div className="space-y-4 sm:space-y-5">
      {items.map((item, idx) => {
        const isSingleQuantity = singleQuantityItemTypes.includes(item.item_type);
        const lineTotal = Number(item.price) * item.quantity;
        const savings = savingsByItemId?.[item.id];

        return (
          <div key={item.id}>
            {idx > 0 && <div className="border-t border-white/10 mb-4 sm:mb-5" />}

            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
              {/* Identity */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#3e95ff]">
                    {ITEM_TYPE_LABELS[item.item_type] ?? item.item_type}
                  </span>
                  {savings != null && (
                    <span className="inline-flex px-2 py-0.5 bg-[#c3e0ff] rounded text-[#003c80] text-[11px] font-bold tracking-tight">
                      Save {savings}%
                    </span>
                  )}
                </div>

                <p className="text-white font-bold text-[15px] sm:text-base mt-1 break-words">
                  {item.name}
                </p>

                {item.color_label && (
                  <p className="text-[#a3a3a3] text-sm mt-0.5 flex items-center gap-1.5">
                    Color:
                    {item.color_swatch && (
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
                        style={{ backgroundColor: item.color_swatch }}
                      />
                    )}
                    {item.color_label}
                  </p>
                )}

                {item.description && (
                  <p className="text-[#a3a3a3] text-sm mt-1 leading-relaxed break-words">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Controls + price */}
              <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 flex-shrink-0 w-full sm:w-auto">
                {onUpdateQuantity &&
                  (isSingleQuantity ? (
                    <span
                      className="text-[#a3a3a3] text-sm font-medium"
                      title="Only one of this item is available"
                    >
                      Qty 1
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        aria-label={`Decrease quantity of ${item.name}`}
                        className="w-11 h-11 sm:w-8 sm:h-8 rounded-lg border border-[#333] text-[#a3a3a3] hover:text-white hover:border-white/40 transition-colors flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-white font-bold text-sm">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        aria-label={`Increase quantity of ${item.name}`}
                        className="w-11 h-11 sm:w-8 sm:h-8 rounded-lg border border-[#333] text-[#a3a3a3] hover:text-white hover:border-white/40 transition-colors flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                <div className="text-right sm:ml-1">
                  <p className="text-[#a3a3a3] text-sm">
                    {item.quantity}x
                  </p>
                  <p className="text-white font-bold text-[15px] sm:text-base">
                    ${lineTotal.toFixed(2)}
                  </p>
                </div>

                {onRemove && (
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                    className="w-11 h-11 sm:w-8 sm:h-8 rounded-lg text-[#a3a3a3] hover:text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

type CartTotalsProps = {
  subtotal: number;
  discountAmount: number;
  finalTotal: number;
  /** When set, a "Discount (CODE)" row is shown above the total. */
  couponCode?: string | null;
  exchangeRates?: ExchangeRate[];
  /** When set, an "Items (n) / Subtotal" row is shown above the total. */
  itemCount?: number;
  /** Rendered below the total (coupon input, action buttons, ...). */
  children?: ReactNode;
};

/**
 * The shared money block: optional item-count + discount rows, the total, and
 * the approximate local-currency conversions.
 */
export function CartTotals({
  subtotal,
  discountAmount,
  finalTotal,
  couponCode,
  exchangeRates = [],
  itemCount,
  children,
}: CartTotalsProps) {
  return (
    <>
      <div className="space-y-2 mb-3">
        {itemCount != null && (
          <div className="flex justify-between text-sm text-[#a3a3a3]">
            <span>Items ({itemCount})</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        )}

        {couponCode && (
          <div className="flex justify-between text-sm text-[#4ade80] font-medium">
            <span>Discount ({couponCode})</span>
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

        {children}
      </div>
    </>
  );
}
