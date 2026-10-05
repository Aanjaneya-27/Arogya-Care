"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Pharmacy & Devices", href: "/pharmacy" },
  { label: "Doctor Consultation", href: "/doctors" },
  { label: "My Appointments", href: "/appointments" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount, toggleCart } = useCartStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B0F19] border-b border-slate-800/80 shadow-2xl transition-all">
      <div className="max-w-[1440px] w-full mx-auto flex items-center justify-between gap-4 px-6 h-20">
        {/* ── LEFT: Brand Logo Box ── */}
        <div className="flex items-center bg-slate-900/90 border border-slate-800/90 shadow-lg shadow-black/20 rounded-2xl px-4 py-2.5 hover:border-slate-700 transition-all shrink-0">
          <Link className="flex items-center gap-3 group cursor-pointer text-left" href="/">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0A74DA] to-[#00D2B4] p-0.5 flex items-center justify-center shadow-md shadow-[#0A74DA]/25 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#00D2B4] text-[20px]">vital_signs</span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline leading-none">
                <span className="text-white font-extrabold text-[18px] tracking-tight">Arogya</span>
                <span className="text-[#0A74DA] font-bold text-[18px] tracking-tight">Care</span>
                <span className="text-[#10B981] font-black text-[18px] ml-0.5">+</span>
              </div>
              <span className="text-slate-400 text-[9px] font-semibold tracking-widest uppercase mt-1">
                Health Platform
              </span>
            </div>
          </Link>
        </div>

        {/* ── CENTER: 4 Clean Boxed Links ── */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/90 border border-slate-800/90 shadow-lg shadow-black/20 rounded-2xl p-1.5 backdrop-blur-md">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive
                    ? "px-4 py-2 bg-gradient-to-r from-[#0A74DA] to-[#0066cc] text-white font-semibold rounded-xl text-sm shadow-md shadow-[#0A74DA]/20 transition-all flex items-center gap-1.5"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/80 px-4 py-2 rounded-xl font-medium text-sm transition-all"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* ── RIGHT: Clean Action Box (Cart + Profile Only) ── */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800/90 shadow-lg shadow-black/20 rounded-2xl px-3.5 py-2 backdrop-blur-md shrink-0">
          {/* Cart Icon with Real-Time Item Badge */}
          <button
            onClick={toggleCart}
            aria-label="Open Cart Drawer"
            className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#0A74DA] text-white text-[10px] font-bold shadow-md shadow-[#0A74DA]/40 animate-in zoom-in-50 duration-200">
                {itemCount}
              </span>
            )}
          </button>

          <div className="h-6 w-px bg-slate-800"></div>

          {/* User Profile Avatar with Label -> /profile */}
          <Link
            href="/profile"
            className="flex items-center gap-2.5 pl-1 pr-2 py-0.5 hover:bg-slate-800/60 rounded-xl cursor-pointer transition-all group"
          >
            <div className="relative w-8 h-8 rounded-full ring-2 ring-[#00D2B4]/50 overflow-hidden shrink-0 group-hover:ring-[#00D2B4] transition-all">
              <img
                alt="Aanjaneya"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida/AEtjO1WXN5QFNpLThaeLKW_3164QY1KWVZVcZ3sX17UvmqrfXN8VoPfrgUtPZcXJNF6rnZBp2aE9UeFF7cQKnDhuw5uBUzPQ2xLg_C2_wa5Rk1ItUqd0wACwjJM4rEehLJmrVXgB20zo_jNfsv-v5-WvPtZhUqhbHEu-qpkjFmO0lXZV2MonmlOc94zd2RsMdDLbBL8vg2Ch1aGVY-BkL95SXmxGt2IaMlt9d-qcAerfCZxYAFmMTPwQGGaggw"
              />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-white leading-tight">Aanjaneya</span>
                <span className="material-symbols-outlined text-[13px] text-[#0A74DA]">verified</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 leading-none">Plus Member</span>
            </div>
          </Link>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-[20px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-6 py-4 space-y-2">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#0A74DA] text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white border-t border-slate-800/80 mt-2 pt-2"
          >
            My Profile (Aanjaneya)
          </Link>
        </div>
      )}
    </header>
  );
}
