"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useHealthStore } from "@/store/useHealthStore";
import { useToastStore } from "@/store/useToastStore";

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    totalAmount,
    itemCount,
    discountCode,
    discountPercent,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyDiscountCode,
    removeDiscountCode,
  } = useCartStore();

  const { walletBalance, payWithWallet } = useHealthStore();
  const { addToast } = useToastStore();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "processing" | "success">("cart");
  const [orderReceipt, setOrderReceipt] = useState<{ orderId: string; totalPaid: number } | null>(null);

  if (!isCartOpen) return null;

  const discountAmount = discountPercent > 0 ? Math.round((totalAmount * discountPercent) / 100) : 0;
  const finalPayable = Math.max(0, totalAmount - discountAmount);
  const isWalletSufficient = walletBalance >= finalPayable;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    if (!couponInput.trim()) return;

    const res = applyDiscountCode(couponInput);
    if (res.success) {
      addToast({
        type: "success",
        title: "Coupon Applied!",
        message: res.message,
      });
      setCouponInput("");
    } else {
      setCouponError(res.message);
    }
  };

  const handleWalletCheckout = () => {
    if (items.length === 0) return;

    if (!isWalletSufficient) {
      addToast({
        type: "error",
        title: "Insufficient Wallet Balance",
        message: `Your balance is ₹${walletBalance.toLocaleString(
          "en-IN"
        )}, but total is ₹${finalPayable.toLocaleString("en-IN")}. Please top up.`,
      });
      return;
    }

    setCheckoutStep("processing");

    setTimeout(() => {
      const orderId = `#ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const result = payWithWallet(
        finalPayable,
        `Pharmacy Order ${orderId}`,
        `Prescription Delivery · ${items.length} items (${items.map((i) => i.name).slice(0, 2).join(", ")}...)`
      );

      if (result.success) {
        setOrderReceipt({
          orderId,
          totalPaid: finalPayable,
        });
        setCheckoutStep("success");
        clearCart();
        addToast({
          type: "success",
          title: "Order Placed Successfully!",
          message: `${orderId} paid via Care Wallet. Despatch in 15 mins!`,
        });
      } else {
        setCheckoutStep("cart");
        addToast({
          type: "error",
          title: "Payment Failed",
          message: result.error || "Unable to complete transaction.",
        });
      }
    }, 1000);
  };

  const handleStandardCheckout = () => {
    if (items.length === 0) return;
    setCheckoutStep("processing");

    setTimeout(() => {
      const orderId = `#ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderReceipt({
        orderId,
        totalPaid: finalPayable,
      });
      setCheckoutStep("success");
      clearCart();
      addToast({
        type: "success",
        title: "Order Placed Successfully!",
        message: `${orderId} confirmed via Mock Gateway. Express delivery active!`,
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside
          className="w-screen max-w-md bg-surface-container-lowest shadow-2xl flex flex-col justify-between border-l border-outline-variant/30 animate-in slide-in-from-right duration-300"
          id="cart-drawer-container"
        >
          {/* Header */}
          <div className="p-space-lg bg-[#0B0F19] text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0A74DA] to-[#00D2B4] p-0.5 flex items-center justify-center shadow-md shadow-[#0A74DA]/25">
                <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#00D2B4] text-[20px]">
                    shopping_bag
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="font-headline-sm text-headline-sm font-bold text-white tracking-tight">
                    Care Cart
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#0A74DA] text-white font-label-sm text-[11px] font-bold">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </span>
                </div>
                <span className="text-slate-400 text-[11px] font-medium">
                  Verified Pharmaceutical Fulfillment
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>

          {/* Body Content */}
          {checkoutStep === "success" && orderReceipt ? (
            <div className="flex-1 p-space-xl flex flex-col items-center justify-center text-center space-y-space-md">
              <div className="w-20 h-20 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-[44px]">verified</span>
              </div>
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full bg-secondary/15 text-secondary font-label-sm text-label-sm font-bold uppercase">
                  Order Dispatched
                </span>
                <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                  Payment Confirmed!
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-xs">
                  Your certified order <strong className="text-on-surface font-mono">{orderReceipt.orderId}</strong> is packed with batch safety seals.
                </p>
              </div>

              <div className="w-full p-space-md rounded-2xl bg-surface-container-low space-y-2 text-left">
                <div className="flex justify-between text-body-sm font-body-sm text-on-surface-variant">
                  <span>Order Total:</span>
                  <span className="text-on-surface font-bold">₹{orderReceipt.totalPaid.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-body-sm font-body-sm text-on-surface-variant">
                  <span>Delivery SLA:</span>
                  <span className="text-secondary font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">bolt</span> 15-Min Express Hub
                  </span>
                </div>
                <div className="flex justify-between text-body-sm font-body-sm text-on-surface-variant">
                  <span>Remaining Care Balance:</span>
                  <span className="text-primary font-bold font-mono">₹{walletBalance.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="w-full space-y-2 pt-2">
                <Link
                  href="/appointments"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full h-11 rounded-xl bg-primary text-white font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-sm font-bold hover:bg-primary-container transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                  <span>View Wallet Ledger</span>
                </Link>
                <button
                  onClick={() => {
                    setCheckoutStep("cart");
                    setIsCartOpen(false);
                  }}
                  className="w-full h-10 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : checkoutStep === "processing" ? (
            <div className="flex-1 p-space-xl flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Processing Care Settlement...
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Encrypting payment ledger and alerting Koramangala dispensary hub.
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex-1 p-space-xl flex flex-col items-center justify-center text-center space-y-space-md">
              <div className="w-20 h-20 rounded-full bg-surface-container-low text-on-surface-variant flex items-center justify-center">
                <span className="material-symbols-outlined text-[40px]">remove_shopping_cart</span>
              </div>
              <div className="space-y-1">
                <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  Your Cart is Empty
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">
                  Browse our certified vitals hardware, chronic diabetes care, and authentic pharmacy catalog.
                </p>
              </div>
              <Link
                href="/pharmacy"
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-primary text-white font-label-md text-label-md font-bold shadow-sm hover:bg-primary-container transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">storefront</span>
                Explore Pharmacy
              </Link>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-space-lg space-y-space-lg">
              {/* Delivery Hub Alert */}
              <div className="p-3 rounded-xl bg-secondary-container/30 border border-secondary-container/60 flex items-center gap-2.5">
                <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">bolt</span>
                <div className="flex flex-col min-w-0 text-left">
                  <span className="font-label-sm text-label-sm font-bold text-on-surface">
                    15-Minute Hyper-Local Despatch
                  </span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant truncate">
                    Delivering to Koramangala, Bengaluru (PIN 560034)
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-space-md">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface-variant font-semibold uppercase tracking-wider">
                    Prescription &amp; Devices ({items.length})
                  </span>
                  <button
                    onClick={clearCart}
                    className="font-label-sm text-label-sm text-error hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-surface-container-low/70 border border-outline-variant/40 flex items-center gap-3 group"
                    >
                      <div className="w-16 h-16 rounded-xl bg-surface-container-lowest p-1.5 shrink-0 flex items-center justify-center border border-outline-variant/40 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-label-md text-label-md font-bold text-on-surface truncate">
                          {item.name}
                        </h4>
                        {item.brand && (
                          <span className="font-body-sm text-[11px] text-on-surface-variant block">
                            {item.brand}
                          </span>
                        )}
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="font-label-lg text-label-lg font-bold text-primary font-mono">
                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                          </span>
                          <span className="font-body-sm text-[11px] text-on-surface-variant line-through">
                            MRP ₹{(item.mrp * item.quantity).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-outline hover:text-error transition-colors p-0.5 rounded cursor-pointer"
                          title="Remove item"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                        <div className="flex items-center bg-surface-container-lowest rounded-lg border border-outline-variant/60 shadow-xs">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
                            aria-label="Decrease"
                          >
                            <span className="material-symbols-outlined text-[14px]">remove</span>
                          </button>
                          <span className="w-6 text-center font-label-sm text-label-sm font-bold font-mono text-on-surface">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
                            aria-label="Increase"
                          >
                            <span className="material-symbols-outlined text-[14px]">add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coupon / Discount Code Box */}
              <div className="p-3.5 rounded-2xl bg-surface-container-low/70 border border-outline-variant/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md font-semibold text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">local_offer</span>
                    Promo Code (15% OFF)
                  </span>
                  {discountCode && (
                    <span className="font-label-sm text-label-sm text-secondary font-bold">
                      15% Applied
                    </span>
                  )}
                </div>

                {discountCode ? (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-secondary-container/40 border border-secondary-container">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
                      <span className="font-mono font-bold text-on-secondary-container text-xs">
                        {discountCode}
                      </span>
                    </div>
                    <button
                      onClick={removeDiscountCode}
                      className="text-error font-label-sm text-xs font-semibold hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter RX15OFF"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponError("");
                      }}
                      className="flex-1 bg-surface-container-lowest border border-outline-variant/60 rounded-xl px-3 py-1.5 text-xs font-mono uppercase text-on-surface outline-none focus:border-primary"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-error font-medium">{couponError}</p>
                )}
                <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                  <span>Try code: <strong className="font-mono text-primary cursor-pointer" onClick={() => setCouponInput("RX15OFF")}>RX15OFF</strong></span>
                  <span>Instant 15% discount</span>
                </div>
              </div>

              {/* Order Bill Summary */}
              <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-outline-variant/40 space-y-2">
                <h5 className="font-label-md text-label-md font-bold text-on-surface">
                  Payment Breakdown
                </h5>
                <div className="space-y-1.5 text-body-sm font-body-sm">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Items Subtotal:</span>
                    <span className="font-mono text-on-surface">₹{totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-secondary">
                      <span>Promo Discount (15%):</span>
                      <span className="font-mono font-bold">-₹{discountAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Packaging &amp; Sterilization:</span>
                    <span className="text-secondary font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>15-Min Express Despatch:</span>
                    <span className="text-secondary font-semibold">FREE</span>
                  </div>
                  <div className="pt-2 border-t border-outline-variant/40 flex justify-between items-baseline">
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      Total Payable:
                    </span>
                    <span className="font-headline-md text-headline-md font-bold text-primary font-mono">
                      ₹{finalPayable.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Checkout CTA Buttons */}
          {checkoutStep === "cart" && items.length > 0 && (
            <div className="p-space-lg bg-surface-container-lowest border-t border-outline-variant/30 space-y-space-sm shadow-xl">
              {/* Option A: One-Click Care Wallet Payment */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary-fixed text-[18px]">
                      account_balance_wallet
                    </span>
                    <span className="font-label-md text-label-md font-bold">
                      Arogya Care Wallet
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-secondary-fixed">
                    Bal: ₹{walletBalance.toLocaleString("en-IN")}
                  </span>
                </div>

                {isWalletSufficient ? (
                  <button
                    onClick={handleWalletCheckout}
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-[#006c49] to-[#00875a] hover:opacity-95 text-white font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined text-[18px]">bolt</span>
                    <span>1-Click Pay ₹{finalPayable.toLocaleString("en-IN")} via Wallet</span>
                  </button>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-amber-300">
                      <span>Insufficient wallet balance</span>
                      <Link
                        href="/appointments"
                        onClick={() => setIsCartOpen(false)}
                        className="text-secondary-fixed underline font-bold"
                      >
                        + Top Up Wallet
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Option B: Standard Gateway Checkout */}
              <button
                onClick={handleStandardCheckout}
                className="w-full h-11 rounded-xl bg-primary hover:bg-primary-container text-white font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-[0.98]"
              >
                <span>Proceed to Checkout</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
