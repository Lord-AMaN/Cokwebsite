import type { Coupon } from './types';
import type { CartItem } from '../context/CartContext';

/**
 * Whether a given cart item type is covered by a coupon's category flags.
 * `applies_to_all` short-circuits everything else. Item types with no
 * corresponding checkbox (packages, consultations) are only ever eligible
 * through `applies_to_all` — there is intentionally no dedicated flag for them.
 */
export function isItemEligibleForCoupon(coupon: Coupon, itemType: CartItem['item_type']): boolean {
  if (coupon.applies_to_all) return true;

  switch (itemType) {
    case 'resource':
      return coupon.applies_to_resources;
    case 'skin':
      return coupon.applies_to_skins;
    case 'castle':
      return coupon.applies_to_castles;
    case 'bot_farm':
      return coupon.applies_to_bot_farms;
    case 'package':
    case 'consultation':
    default:
      return false;
  }
}

/** Human-readable summary of what a coupon covers, e.g. "Skins, Castles" or "all items". */
export function couponCategoryLabel(coupon: Coupon): string {
  if (coupon.applies_to_all) return 'all items';
  const labels: string[] = [];
  if (coupon.applies_to_resources) labels.push('Resources');
  if (coupon.applies_to_skins) labels.push('Skins');
  if (coupon.applies_to_castles) labels.push('Castles');
  if (coupon.applies_to_bot_farms) labels.push('Bot Farms');
  return labels.length > 0 ? labels.join(', ') : 'nothing (misconfigured coupon)';
}

export type CouponValidationResult =
  | { ok: true }
  | { ok: false; reason: string };

/**
 * Pure, side-effect-free validity check for a coupon at a given moment in time,
 * against a given cart. Used both when the customer clicks "Apply" and again
 * right before the order is actually submitted (cart contents or the clock may
 * have moved between the two).
 *
 * Supabase's `numeric` columns come back from the JS client as strings, so every
 * numeric field is explicitly coerced with Number(...) before comparison — treating
 * them as numbers without doing so is a real bug (e.g. string "5" >= string "10" is
 * true, which would silently defeat max_redemptions checks).
 */
export function validateCoupon(coupon: Coupon, items: CartItem[], now: Date = new Date()): CouponValidationResult {
  if (!coupon.is_active) {
    return { ok: false, reason: 'This coupon is no longer active.' };
  }

  const startsAt = new Date(coupon.starts_at);
  const expiresAt = new Date(coupon.expires_at);

  if (now < startsAt) {
    return { ok: false, reason: 'This coupon is not active yet.' };
  }
  if (now > expiresAt) {
    return { ok: false, reason: 'This coupon has expired.' };
  }

  if (coupon.max_redemptions !== null) {
    const max = Number(coupon.max_redemptions);
    const used = Number(coupon.times_redeemed);
    if (Number.isFinite(max) && Number.isFinite(used) && used >= max) {
      return { ok: false, reason: 'This coupon has reached its usage limit.' };
    }
  }

  const hasEligibleItem = items.some(i => isItemEligibleForCoupon(coupon, i.item_type));
  if (!hasEligibleItem) {
    return {
      ok: false,
      reason: `This coupon only applies to ${couponCategoryLabel(coupon)}, and your cart doesn't have any of those items.`,
    };
  }

  return { ok: true };
}

export type DiscountBreakdown = {
  subtotal: number;
  discountAmount: number;
  finalTotal: number;
};

/**
 * Computes the discount, applied only to eligible line items — ineligible items
 * (e.g. resources in the cart when a skins-only coupon is applied) are counted
 * at full price, per line, not just excluded from an "any eligible item" check.
 * Rounds to 2 decimal places at the end to avoid floating-point artifacts
 * (e.g. 19.999999999998) leaking into what's charged or displayed.
 */
export function computeDiscount(coupon: Coupon | null, items: CartItem[]): DiscountBreakdown {
  const subtotal = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);

  if (!coupon) {
    return { subtotal: round2(subtotal), discountAmount: 0, finalTotal: round2(subtotal) };
  }

  const percent = Math.min(100, Math.max(0, Number(coupon.discount_percent)));

  const discountAmount = items.reduce((sum, i) => {
    if (!isItemEligibleForCoupon(coupon, i.item_type)) return sum;
    const lineTotal = Number(i.price) * i.quantity;
    return sum + lineTotal * (percent / 100);
  }, 0);

  const finalTotal = Math.max(0, subtotal - discountAmount);

  return {
    subtotal: round2(subtotal),
    discountAmount: round2(discountAmount),
    finalTotal: round2(finalTotal),
  };
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}