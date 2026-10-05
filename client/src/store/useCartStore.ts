"use client";

import { create } from "zustand";
import { CartItem, Product } from "@/types";
import { INITIAL_PRODUCTS } from "@/data/mockData";

interface CartStore {
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
  isCartOpen: boolean;
  discountCode: string | null;
  discountPercent: number;

  // Actions
  addToCart: (product: Product | CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setIsCartOpen: (isOpen: boolean) => void;
  applyDiscountCode: (code: string) => { success: boolean; message: string };
  removeDiscountCode: () => void;
}

// Initial 2 items to match initial page mock data (Omron BP + Accu-Chek = ₹3,798)
const INITIAL_ITEMS: CartItem[] = [
  {
    id: INITIAL_PRODUCTS[0].id,
    name: INITIAL_PRODUCTS[0].name,
    price: INITIAL_PRODUCTS[0].price,
    mrp: INITIAL_PRODUCTS[0].mrp,
    image: INITIAL_PRODUCTS[0].image,
    quantity: 1,
    tag1: INITIAL_PRODUCTS[0].tag1,
    brand: INITIAL_PRODUCTS[0].brand,
    category: INITIAL_PRODUCTS[0].category,
  },
  {
    id: INITIAL_PRODUCTS[1].id,
    name: INITIAL_PRODUCTS[1].name,
    price: INITIAL_PRODUCTS[1].price,
    mrp: INITIAL_PRODUCTS[1].mrp,
    image: INITIAL_PRODUCTS[1].image,
    quantity: 1,
    tag1: INITIAL_PRODUCTS[1].tag1,
    brand: INITIAL_PRODUCTS[1].brand,
    category: INITIAL_PRODUCTS[1].category,
  },
];

const calculateTotals = (items: CartItem[]) => {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { itemCount, totalAmount };
};

const initialTotals = calculateTotals(INITIAL_ITEMS);

export const useCartStore = create<CartStore>((set, get) => ({
  items: INITIAL_ITEMS,
  itemCount: initialTotals.itemCount,
  totalAmount: initialTotals.totalAmount,
  isCartOpen: false,
  discountCode: null,
  discountPercent: 0,

  addToCart: (product) => {
    const { items } = get();
    const existingIndex = items.findIndex((i) => i.id === product.id);

    let updatedItems: CartItem[];
    if (existingIndex > -1) {
      updatedItems = items.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        mrp: product.mrp,
        image: product.image,
        quantity: 1,
        tag1: product.tag1,
        brand: product.brand,
        category: product.category,
      };
      updatedItems = [...items, newItem];
    }

    const { itemCount, totalAmount } = calculateTotals(updatedItems);
    set({ items: updatedItems, itemCount, totalAmount });
  },

  removeFromCart: (productId) => {
    const { items } = get();
    const updatedItems = items.filter((item) => item.id !== productId);
    const { itemCount, totalAmount } = calculateTotals(updatedItems);
    set({ items: updatedItems, itemCount, totalAmount });
  },

  updateQuantity: (productId, delta) => {
    const { items } = get();
    const updatedItems = items
      .map((item) => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter((item): item is CartItem => item !== null);

    const { itemCount, totalAmount } = calculateTotals(updatedItems);
    set({ items: updatedItems, itemCount, totalAmount });
  },

  clearCart: () => {
    set({
      items: [],
      itemCount: 0,
      totalAmount: 0,
      discountCode: null,
      discountPercent: 0,
    });
  },

  toggleCart: () => {
    set((state) => ({ isCartOpen: !state.isCartOpen }));
  },

  setIsCartOpen: (isOpen) => {
    set({ isCartOpen: isOpen });
  },

  applyDiscountCode: (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (normalized === "RX15OFF" || normalized === "AROGYA15") {
      set({ discountCode: normalized, discountPercent: 15 });
      return { success: true, message: "15% off applied successfully!" };
    }
    return { success: false, message: "Invalid promo code. Use RX15OFF for 15% discount." };
  },

  removeDiscountCode: () => {
    set({ discountCode: null, discountPercent: 0 });
  },
}));
