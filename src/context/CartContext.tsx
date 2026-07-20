import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';

export type CartItem = {
  id: string;
  item_type: 'package' | 'skin' | 'consultation' | 'resource' | 'castle' | 'bot_farm';
  item_id: string | null;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  metadata: Record<string, unknown>;
};

type AddItemInput = Omit<CartItem, 'id'>;

type CartContextValue = {
  items: CartItem[];
  loading: boolean;
  addItem: (item: AddItemInput) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = 'cok_cart';

function loadFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading] = useState(false);

  useEffect(() => {
    setItems(loadFromStorage());
  }, []);

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore quota errors */
    }
  }, []);

  const addItem = async (item: AddItemInput) => {
    const id = crypto.randomUUID();
    const next = [...items, { ...item, id }];
    persist(next);
  };

  const removeItem = async (id: string) => {
    persist(items.filter(i => i.id !== id));
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(id);
      return;
    }
    persist(items.map(i => (i.id === id ? { ...i, quantity } : i)));
  };

  const clearCart = async () => {
    persist([]);
  };

  const total = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, loading, addItem, removeItem, updateQuantity, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}