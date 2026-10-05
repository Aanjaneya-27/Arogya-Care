"use client";

import { Product } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { useToastStore } from "@/store/useToastStore";

interface ProductCardProps {
  product: Product;
  onOpenCart?: () => void;
}

export default function ProductCard({ product, onOpenCart }: ProductCardProps) {
  const { items, addToCart, updateQuantity } = useCartStore();
  const { addToast } = useToastStore();

  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    addToast({
      type: "success",
      title: "Added to Cart",
      message: `${product.name} added to your prescription basket.`,
    });
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(product.id, 1);
    addToast({
      type: "info",
      title: "Quantity Updated",
      message: `${product.name} quantity increased to ${quantity + 1}.`,
    });
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(product.id, -1);
    if (quantity === 1) {
      addToast({
        type: "info",
        title: "Removed from Cart",
        message: `${product.name} removed from your cart.`,
      });
    }
  };

  return (
    <article className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 border border-outline-variant/30 hover:border-primary/30 group">
      <div className="space-y-space-md">
        {/* Header Tags */}
        <div className="flex items-center justify-between gap-space-xs">
          <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
            {product.tag1}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold flex items-center gap-0.5">
            {product.tag2Icon && (
              <span className="material-symbols-outlined text-[13px]">{product.tag2Icon}</span>
            )}
            {product.tag2}
          </span>
        </div>

        {/* Product Image & Discount Badge */}
        <div className="relative w-full h-44 rounded-xl overflow-hidden bg-surface-container-low flex items-center justify-center p-space-sm group-hover:bg-surface-container transition-colors">
          <img
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            src={product.image}
            loading="lazy"
          />
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm font-bold shadow-sm">
            {product.discount}
          </span>
          {product.rx && (
            <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-label-sm text-[10px] font-bold flex items-center gap-1 border border-outline-variant">
              <span className="material-symbols-outlined text-[12px] text-primary">prescriptions</span>
              Rx Required
            </span>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-space-xs">
          <div className="flex items-center gap-1 text-amber-500 font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[16px] text-amber-500 fill-amber-500">star</span>
            <span className="font-bold text-on-surface">{product.rating}</span>
            <span className="text-on-surface-variant font-normal">({product.reviews})</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 leading-relaxed">
            {product.desc}
          </p>
        </div>
      </div>

      {/* Pricing & Interactive Add-to-Cart / Quantity Controls */}
      <div className="pt-space-md space-y-space-sm border-t border-outline-variant/30 mt-space-sm">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-space-xs">
            <span className="font-headline-md text-headline-md font-bold text-on-surface">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant line-through">
              MRP ₹{product.mrp.toLocaleString("en-IN")}
            </span>
          </div>
          <span className="font-label-sm text-label-sm text-secondary font-semibold">
            Save ₹{(product.mrp - product.price).toLocaleString("en-IN")}
          </span>
        </div>

        {quantity === 0 ? (
          <button
            onClick={handleAdd}
            className="w-full h-11 bg-primary text-on-primary hover:bg-primary-container font-label-lg text-label-lg rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-space-xs cursor-pointer font-bold active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            <span>Add to Cart</span>
          </button>
        ) : (
          <div className="w-full h-11 bg-surface-container-low rounded-xl p-1 flex items-center justify-between border border-primary/40 shadow-sm animate-in fade-in duration-200">
            <button
              onClick={handleDecrement}
              className="w-9 h-9 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface flex items-center justify-center transition-colors cursor-pointer shadow-xs active:scale-95"
              aria-label="Decrease quantity"
            >
              <span className="material-symbols-outlined text-[18px]">
                {quantity === 1 ? "delete" : "remove"}
              </span>
            </button>
            <div className="flex flex-col items-center leading-none">
              <span className="font-headline-sm text-label-lg font-bold text-primary font-mono">
                {quantity}
              </span>
              <span className="text-[10px] text-on-surface-variant font-medium">in cart</span>
            </div>
            <button
              onClick={handleIncrement}
              className="w-9 h-9 rounded-lg bg-primary hover:bg-primary-container text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs active:scale-95"
              aria-label="Increase quantity"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
