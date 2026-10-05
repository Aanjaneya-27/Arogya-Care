"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { INITIAL_PRODUCTS, INITIAL_DOCTORS } from "@/data/mockData";
import { Product, Doctor } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { useToastStore } from "@/store/useToastStore";

interface GlobalSearchBarProps {
  placeholder?: string;
  className?: string;
  isHero?: boolean;
}

export default function GlobalSearchBar({
  placeholder = "Search medicines, lab tests, blood pressure monitors, or doctors...",
  className = "",
  isHero = false,
}: GlobalSearchBarProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { addToCart } = useCartStore();
  const { addToast } = useToastStore();

  // 300ms Debounce implementation
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm.trim());
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Global ⌘K / Ctrl+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Live filtered products & doctors
  const matchedProducts: Product[] = debouncedTerm
    ? INITIAL_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
          p.brand.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
          p.tag1.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(debouncedTerm.toLowerCase())
      ).slice(0, 4)
    : [];

  const matchedDoctors: Doctor[] = debouncedTerm
    ? INITIAL_DOCTORS.filter(
        (d) =>
          d.name.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
          d.specialty.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
          d.specialtyCategory.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
          d.hospital.toLowerCase().includes(debouncedTerm.toLowerCase())
      ).slice(0, 3)
    : [];

  const hasResults = matchedProducts.length > 0 || matchedDoctors.length > 0;

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    addToast({
      type: "success",
      title: "Added to Cart",
      message: `${product.name} added. View in Cart drawer.`,
    });
  };

  const openMediBot = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-medibot"));
  };

  return (
    <>
      {/* Backdrop overlay for clean click-outside dismissal */}
      {isOpen && debouncedTerm.length > 0 && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-[1px] transition-opacity animate-in fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div ref={containerRef} className={`relative w-full ${className} z-40`}>
        <div
          className={`relative flex items-center bg-white rounded-2xl transition-all border ${
            isHero
              ? "shadow-xl p-1.5 sm:p-2.5 border-slate-200"
              : "p-2 border-slate-200 shadow-sm"
          } ${isOpen ? "ring-2 ring-primary/30 border-primary" : ""}`}
        >
          <div className="flex items-center justify-center pl-3.5 pr-2.5 text-slate-400">
            <span className="material-symbols-outlined text-[24px]">search</span>
          </div>

          <input
            ref={inputRef}
            id="global-search-input"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className={`w-full bg-transparent text-slate-900 placeholder:text-slate-400 outline-none ${
              isHero ? "text-base sm:text-lg py-2.5 px-2" : "text-sm py-1.5 px-2"
            }`}
            placeholder={placeholder}
            type="text"
          />

          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setDebouncedTerm("");
              }}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 mr-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}

          <div className="flex items-center gap-2 pr-1.5 shrink-0">
            {isHero && (
              <button
                onClick={openMediBot}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-container hover:opacity-95 text-white font-medium text-sm shadow-md shadow-[#0A74DA]/20 transition-all cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary-container">
                  auto_awesome
                </span>
                <span>Ask AI</span>
              </button>
            )}

            <button
              onClick={() => {
                if (debouncedTerm) {
                  router.push(`/pharmacy?search=${encodeURIComponent(debouncedTerm)}`);
                  setIsOpen(false);
                }
              }}
              aria-label="Search Submit"
              className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Live Debounced Search Dropdown - Fixed Overflow & Explicit Styles */}
        {isOpen && debouncedTerm.length > 0 && (
          <div
            className="absolute top-full left-0 right-0 mt-3 z-50 bg-white rounded-2xl shadow-2xl border border-slate-100 max-h-[420px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200"
            style={{
              boxShadow: "0 25px 50px -12px rgba(10, 116, 218, 0.25), 0 10px 25px -5px rgba(15, 23, 42, 0.15)",
            }}
          >
            {hasResults ? (
              <div className="divide-y divide-slate-100">
                {/* Category 1: Products & Devices */}
                {matchedProducts.length > 0 && (
                  <div className="p-3">
                    <div className="px-2 py-1.5 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5 text-primary">
                        <span className="material-symbols-outlined text-[16px]">medical_services</span>
                        PRODUCTS &amp; VITALS DEVICES ({matchedProducts.length})
                      </span>
                      <Link
                        href={`/pharmacy?search=${encodeURIComponent(debouncedTerm)}`}
                        onClick={() => setIsOpen(false)}
                        className="text-primary hover:underline lowercase font-normal"
                      >
                        view all
                      </Link>
                    </div>

                    <div className="space-y-1 mt-1">
                      {matchedProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
                          onClick={() => {
                            router.push(`/pharmacy?search=${encodeURIComponent(product.name)}`);
                            setIsOpen(false);
                          }}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-12 h-12 rounded-lg bg-slate-50 p-1 shrink-0 border border-slate-200 flex items-center justify-center">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="min-w-0 text-left">
                              <h4 className="font-label-md text-sm font-bold text-slate-900 truncate group-hover:text-primary transition-colors">
                                {product.name}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span>{product.brand}</span>
                                <span>•</span>
                                <span className="text-secondary font-semibold">15-min delivery</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 ml-2">
                            <div className="text-right">
                              <div className="font-label-md text-sm font-bold text-primary font-mono">
                                ₹{product.price.toLocaleString("en-IN")}
                              </div>
                              <div className="text-[10px] text-slate-400 line-through">
                                ₹{product.mrp.toLocaleString("en-IN")}
                              </div>
                            </div>
                            <button
                              onClick={(e) => handleQuickAdd(e, product)}
                              className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[14px]">add_shopping_cart</span>
                              <span>Add</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category 2: Doctors & Verified Specialists */}
                {matchedDoctors.length > 0 && (
                  <div className="p-3 bg-slate-50/70">
                    <div className="px-2 py-1.5 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5 text-secondary">
                        <span className="material-symbols-outlined text-[16px]">stethoscope</span>
                        VERIFIED DOCTORS &amp; SPECIALISTS ({matchedDoctors.length})
                      </span>
                      <Link
                        href="/doctors"
                        onClick={() => setIsOpen(false)}
                        className="text-primary hover:underline lowercase font-normal"
                      >
                        view all
                      </Link>
                    </div>

                    <div className="space-y-1 mt-1">
                      {matchedDoctors.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white transition-colors group cursor-pointer border border-transparent hover:border-slate-200"
                          onClick={() => {
                            router.push(`/doctors?doc=${doc.id}`);
                            setIsOpen(false);
                          }}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                              <img
                                src={doc.image}
                                alt={doc.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0 text-left">
                              <div className="flex items-center gap-1">
                                <h4 className="font-label-md text-sm font-bold text-slate-900 truncate group-hover:text-primary transition-colors">
                                  {doc.name}
                                </h4>
                                <span className="material-symbols-outlined text-primary text-[15px]">
                                  verified
                                </span>
                              </div>
                              <p className="text-xs text-primary font-medium truncate">
                                {doc.specialty}
                              </p>
                              <span className="text-[11px] text-slate-500 truncate block">
                                {doc.hospital} · {doc.experience}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 ml-2">
                            <div className="text-right">
                              <div className="font-label-md text-sm font-bold text-slate-900 font-mono">
                                ₹{doc.consultFee}
                              </div>
                              <div className="text-[10px] text-secondary font-semibold">
                                ★ {doc.rating}
                              </div>
                            </div>
                            <Link
                              href={`/doctors?doc=${doc.id}`}
                              onClick={() => setIsOpen(false)}
                              className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/90 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                            >
                              <span>Book</span>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center space-y-2">
                <span className="material-symbols-outlined text-[36px] text-slate-300">search_off</span>
                <h4 className="font-label-lg text-sm font-bold text-slate-900">
                  No exact matches for &quot;{debouncedTerm}&quot;
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Try searching for &quot;Omron&quot;, &quot;Cardiologist&quot;, &quot;Glucometer&quot;, or launch our AI assistant.
                </p>
                <button
                  onClick={openMediBot}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-container text-white text-xs font-bold hover:bg-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
                  Ask MediBot AI Assistant
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
