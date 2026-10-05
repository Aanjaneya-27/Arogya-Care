"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { INITIAL_PRODUCTS } from "@/data/mockData";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import { useCartStore } from "@/store/useCartStore";
import { useToastStore } from "@/store/useToastStore";

function PharmacyContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCat = searchParams.get("category") || "all";

  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [rxFilter, setRxFilter] = useState<"all" | "otc" | "rx">("all");
  const [priceBracket, setPriceBracket] = useState<string>("all");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("popularity");
  const [expressDelivery, setExpressDelivery] = useState(true);
  const [rxModalOpen, setRxModalOpen] = useState(false);
  const [rxSuccess, setRxSuccess] = useState(false);

  const { itemCount, totalAmount, setIsCartOpen } = useCartStore();
  const { addToast } = useToastStore();

  const handleUploadRx = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRxSuccess(true);
      setTimeout(() => {
        setRxModalOpen(false);
        setRxSuccess(false);
        useCartStore.getState().applyDiscountCode("RX15OFF");
        addToast({
          type: "success",
          title: "Prescription Verified & 15% OFF Applied",
          message: "Coupon code RX15OFF is now applied to your active cart.",
        });
      }, 1800);
    }
  };

  const handleToggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const filteredProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter((p) => {
      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.desc.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesTag = p.tag1.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesBrand && !matchesTag) {
          return false;
        }
      }

      // Category filter
      if (activeCategory !== "all" && p.category !== activeCategory) {
        return false;
      }

      // Rx filter
      if (rxFilter === "otc" && p.rx) return false;
      if (rxFilter === "rx" && !p.rx) return false;

      // Price filter
      if (priceBracket === "under-500" && p.price >= 500) return false;
      if (priceBracket === "500-1000" && (p.price < 500 || p.price > 1000)) return false;
      if (priceBracket === "1000-2500" && (p.price < 1000 || p.price > 2500)) return false;
      if (priceBracket === "2500-plus" && p.price < 2500) return false;

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // popularity / default
    });
  }, [searchQuery, activeCategory, rxFilter, priceBracket, selectedBrands, sortBy]);

  const allAvailableBrands = Array.from(new Set(INITIAL_PRODUCTS.map((p) => p.brand)));

  return (
    <div className="flex flex-col w-full pb-36">
      <div className="w-full px-margin-sm md:px-margin max-w-7xl mx-auto flex flex-col gap-space-lg">
        {/* ── Breadcrumb & Page Header ── */}
        <section className="flex flex-col gap-space-sm pt-space-md">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant"
          >
            <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
              <span className="material-symbols-outlined text-[16px]">home</span>
              Home
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface-variant">Pharmacy &amp; Devices</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface font-semibold">Smart Vitals &amp; Medicine Store</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md mt-space-xs">
            <div className="max-w-3xl space-y-space-xs">
              <div className="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold">
                <span className="material-symbols-outlined text-[15px]">verified</span>
                Direct Pharmaceutical Fulfillment
              </div>
              <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
                Pharmacy &amp; Smart Vitals Store
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Order 100% genuine medicines, lab testing kits, and clinical health hardware with express delivery.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-space-sm">
              <div className="flex items-center gap-space-xs px-space-md py-space-xs rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
                <span className="material-symbols-outlined text-secondary text-[20px]">verified_user</span>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface font-bold">CDSCO Licensed</span>
                  <span className="font-label-sm text-[10px] text-on-surface-variant leading-none">Compliant Hub</span>
                </div>
              </div>
              <div className="flex items-center gap-space-xs px-space-md py-space-xs rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
                <span className="material-symbols-outlined text-primary text-[20px]">award_star</span>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface font-bold">100% Authentic</span>
                  <span className="font-label-sm text-[10px] text-on-surface-variant leading-none">Batch Verified</span>
                </div>
              </div>
              <div className="flex items-center gap-space-xs px-space-md py-space-xs rounded-xl bg-secondary-container/30 text-on-secondary-container shadow-sm border border-secondary-container/50">
                <span className="material-symbols-outlined text-secondary text-[20px]">bolt</span>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface font-bold">15-Min Express</span>
                  <span className="font-label-sm text-[10px] text-on-surface-variant leading-none">Bengaluru Hubs</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Promotional Hero Banner Card ── */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-container via-primary to-tertiary text-on-primary shadow-xl p-space-lg lg:p-space-xl">
          <div className="absolute -right-12 -bottom-16 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
          <div className="absolute right-1/4 -top-16 w-48 h-48 rounded-full bg-secondary-fixed/20 blur-2xl pointer-events-none"></div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
            <div className="lg:col-span-8 space-y-space-md">
              <div className="flex flex-wrap items-center gap-space-sm">
                <span className="px-space-sm py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">local_offer</span>
                  CODE: RX15OFF
                </span>
                <span className="px-space-sm py-1 rounded-full bg-white/20 text-on-primary font-label-sm text-label-sm font-medium">
                  Registered Pharmacist Review
                </span>
              </div>
              <div>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-primary tracking-tight">
                  Upload Doctor Prescription &amp; Get 15% OFF on your first medicine order.
                </h2>
                <p className="font-body-md text-body-md text-on-primary-container mt-space-xs max-w-2xl opacity-90">
                  Instant verification by registered clinical pharmacists within 10 minutes. Legally compliant digital refills with auto-schedule options.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
                <button
                  onClick={() => setRxModalOpen(true)}
                  className="h-11 px-space-lg bg-surface-container-lowest text-primary hover:bg-surface-container-low font-label-lg text-label-lg rounded-xl shadow-md transition-all flex items-center gap-space-xs cursor-pointer font-bold"
                >
                  <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
                  Upload Prescription
                </button>
                <button
                  onClick={() => {
                    useCartStore.getState().applyDiscountCode("RX15OFF");
                    addToast({
                      type: "success",
                      title: "Coupon Activated",
                      message: "Code RX15OFF applied to your current checkout.",
                    });
                  }}
                  className="h-11 px-space-lg bg-white/15 hover:bg-white/25 text-on-primary font-label-lg text-label-lg rounded-xl backdrop-blur transition-all flex items-center gap-space-xs cursor-pointer font-medium"
                >
                  <span className="material-symbols-outlined text-[20px]">content_copy</span>
                  <span>Apply RX15OFF</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 hidden lg:flex justify-center">
              <div className="w-56 h-56 rounded-full bg-white/10 backdrop-blur-md p-4 flex items-center justify-center border border-white/20">
                <span className="material-symbols-outlined text-[100px] text-white/90">
                  prescriptions
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Category Pill Filters ── */}
        <section className="space-y-space-xs">
          <div className="flex items-center gap-2 overflow-x-auto pb-2" id="pharmacy-category-pills">
            {[
              { id: "all", label: "All Items", icon: "widgets" },
              { id: "devices", label: "Vitals Devices", icon: "monitor_heart", iconColor: "text-primary" },
              { id: "diabetes", label: "Diabetes Care", icon: "bloodtype", iconColor: "text-error" },
              { id: "medicines", label: "Medicines & Rx", icon: "medication", iconColor: "text-secondary" },
              { id: "wellness", label: "Wellness & Immunity", icon: "spa", iconColor: "text-secondary" },
              { id: "ayurveda", label: "Ayurveda & Herbal", icon: "eco", iconColor: "text-emerald-500" },
            ].map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-xl font-label-lg text-label-lg shadow-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${isActive
                      ? "bg-primary text-white font-bold shadow-md shadow-primary/20 scale-[1.02]"
                      : "bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container border border-outline-variant/30"
                    }`}
                >
                  <span className={`material-symbols-outlined text-[18px] ${isActive ? "text-white" : cat.iconColor || ""}`}>
                    {cat.icon}
                  </span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Main Content Layout (Sidebar Filters + Products Grid) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          {/* Left Column: Interactive Sidebar Filters */}
          <aside className="lg:col-span-4 xl:col-span-3 space-y-space-md">
            {/* Express Hub Pinning Card */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 space-y-space-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs text-secondary font-label-md text-label-md font-bold">
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                  Express 15-Min Delivery
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={expressDelivery}
                    onChange={(e) => setExpressDelivery(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                </label>
              </div>
              <div className="flex items-center gap-2 p-space-xs bg-surface-container-low rounded-xl">
                <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold truncate">
                    Deliver to Koramangala
                  </span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">
                    PIN: 560034 • Hub active
                  </span>
                </div>
              </div>
            </div>

            {/* Filter Controls Container */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/30 space-y-space-lg">
              <div className="flex items-center justify-between pb-space-xs">
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[20px] text-primary">tune</span>
                  Filters
                </span>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                    setRxFilter("all");
                    setPriceBracket("all");
                    setSelectedBrands([]);
                  }}
                  className="font-label-sm text-label-sm text-primary hover:text-on-primary-fixed-variant font-semibold cursor-pointer"
                >
                  Reset All
                </button>
              </div>

              {/* In-category search */}
              <div className="space-y-space-xs">
                <label className="font-label-md text-label-md text-on-surface font-medium">Search Catalog</label>
                <div className="flex items-center gap-space-xs px-3 py-2 bg-surface-container-low rounded-xl border border-outline-variant/40">
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-on-surface font-body-sm text-body-sm w-full outline-none placeholder:text-outline"
                    placeholder="e.g. Omron, Metformin..."
                    type="text"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="text-outline hover:text-on-surface">
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Prescription Filter */}
              <div className="space-y-space-xs">
                <label className="font-label-md text-label-md text-on-surface font-semibold">Prescription Type</label>
                <div className="space-y-space-xs">
                  <label className="flex items-center justify-between p-2 rounded-xl hover:bg-surface-container-low cursor-pointer">
                    <span className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface">
                      <input
                        checked={rxFilter === "all"}
                        onChange={() => setRxFilter("all")}
                        className="accent-primary w-4 h-4 cursor-pointer"
                        name="rx_filter"
                        type="radio"
                      />
                      All Products
                    </span>
                    <span className="font-label-sm text-xs text-on-surface-variant">
                      {INITIAL_PRODUCTS.length}
                    </span>
                  </label>
                  <label className="flex items-center justify-between p-2 rounded-xl hover:bg-surface-container-low cursor-pointer">
                    <span className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface">
                      <input
                        checked={rxFilter === "otc"}
                        onChange={() => setRxFilter("otc")}
                        className="accent-primary w-4 h-4 cursor-pointer"
                        name="rx_filter"
                        type="radio"
                      />
                      Over The Counter (OTC)
                    </span>
                    <span className="font-label-sm text-xs text-on-surface-variant">
                      {INITIAL_PRODUCTS.filter((p) => !p.rx).length}
                    </span>
                  </label>
                  <label className="flex items-center justify-between p-2 rounded-xl hover:bg-surface-container-low cursor-pointer">
                    <span className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface">
                      <input
                        checked={rxFilter === "rx"}
                        onChange={() => setRxFilter("rx")}
                        className="accent-primary w-4 h-4 cursor-pointer"
                        name="rx_filter"
                        type="radio"
                      />
                      Prescription Required (Rx)
                    </span>
                    <span className="font-label-sm text-xs text-on-surface-variant">
                      {INITIAL_PRODUCTS.filter((p) => p.rx).length}
                    </span>
                  </label>
                </div>
              </div>

              {/* Price Brackets */}
              <div className="space-y-space-xs">
                <label className="font-label-md text-label-md text-on-surface font-semibold">Price Bracket</label>
                <div className="grid grid-cols-2 gap-space-xs">
                  {[
                    { id: "all", label: "All Prices" },
                    { id: "under-500", label: "Under ₹500" },
                    { id: "500-1000", label: "₹500 - ₹1,000" },
                    { id: "1000-2500", label: "₹1,000 - ₹2,500" },
                    { id: "2500-plus", label: "₹2,500+" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPriceBracket(p.id)}
                      className={`px-2.5 py-1.5 rounded-xl font-label-sm text-xs text-center transition-colors cursor-pointer ${priceBracket === p.id
                          ? "bg-primary text-white font-bold shadow-xs"
                          : "bg-surface-container-low hover:bg-surface-container text-on-surface"
                        }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="space-y-space-xs">
                <label className="font-label-md text-label-md text-on-surface font-semibold">Clinically Certified Brands</label>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {allAvailableBrands.map((b) => {
                    const isChecked = selectedBrands.includes(b);
                    const count = INITIAL_PRODUCTS.filter((p) => p.brand === b).length;
                    return (
                      <label
                        key={b}
                        className="flex items-center justify-between p-1.5 rounded-lg hover:bg-surface-container-low cursor-pointer"
                      >
                        <span className="flex items-center gap-2 font-body-sm text-xs text-on-surface truncate">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleBrand(b)}
                            className="rounded accent-primary w-3.5 h-3.5 cursor-pointer"
                          />
                          <span className="truncate">{b}</span>
                        </span>
                        <span className="text-[11px] text-outline ml-2">{count}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Product Grid */}
          <section className="lg:col-span-8 xl:col-span-9 space-y-space-md">
            {/* Controls Bar (Results Count & Sort) */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {filteredProducts.length} Items Available
                </span>
                {activeCategory !== "all" && (
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-xs font-semibold capitalize">
                    {activeCategory}
                  </span>
                )}
                {searchQuery && (
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface font-label-sm text-xs">
                    &quot;{searchQuery}&quot;
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="font-label-sm text-xs text-on-surface-variant">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-9 pl-3 pr-8 rounded-xl bg-surface-container-low text-on-surface font-label-sm text-xs border border-outline-variant/40 appearance-none outline-none cursor-pointer"
                  >
                    <option value="popularity">Most Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <span className="material-symbols-outlined text-[16px] text-outline absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            {/* Product Cards Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="p-12 rounded-3xl bg-surface-container-lowest text-center space-y-4 border border-outline-variant/30 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-surface-container-low text-outline flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-[36px]">inventory_2</span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    No matching products found
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
                    Try clearing filters or searching for another term like &quot;BP&quot;, &quot;Glucometer&quot;, or &quot;Cipla&quot;.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                    setRxFilter("all");
                    setPriceBracket("all");
                    setSelectedBrands([]);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white font-label-md text-label-md font-bold hover:bg-primary-container transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Trust & Quality Strip */}
            <div className="p-space-lg rounded-2xl bg-surface-container-low grid grid-cols-1 md:grid-cols-3 gap-space-md border border-outline-variant/30">
              <div className="flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-primary text-[24px] shrink-0">inventory_2</span>
                <div className="space-y-0.5">
                  <h4 className="font-label-lg text-label-lg text-on-surface font-bold">Sterile Tamper-Proof Seals</h4>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    Every medical device &amp; OTC medicine is double boxed with verified batch safety seals.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-secondary text-[24px] shrink-0">
                  assignment_turned_in
                </span>
                <div className="space-y-0.5">
                  <h4 className="font-label-lg text-label-lg text-on-surface font-bold">Doctor-Approved Refills</h4>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    Seamless link with your ArogyaCare+ electronic consultations and clinical health vault.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-tertiary text-[24px] shrink-0">cached</span>
                <div className="space-y-0.5">
                  <h4 className="font-label-lg text-label-lg text-on-surface font-bold">Hassle-Free Returns</h4>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    7-day replacement warranty on all electronics, vital monitors, and glucometers.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ── Sticky Floating Cart / Express Checkout Bar (Synced with useCartStore) ── */}
      {itemCount > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-4xl animate-in slide-in-from-bottom-3 duration-300">
          <div className="bg-inverse-surface/95 backdrop-blur-xl text-inverse-on-surface rounded-2xl p-space-md shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-space-md border border-slate-700/60">
            <div className="flex items-center gap-space-md w-full sm:w-auto">
              <div className="relative p-2.5 rounded-xl bg-surface-container-lowest/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px] text-secondary-fixed">shopping_cart</span>
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-lg text-label-lg font-bold">
                    Cart: {itemCount} {itemCount === 1 ? "item" : "items"} (₹{totalAmount.toLocaleString("en-IN")})
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-xs font-semibold">
                    <span className="material-symbols-outlined text-[13px] mr-0.5">bolt</span>
                    Express Eligible
                  </span>
                </div>
                <span className="font-body-sm text-body-sm text-inverse-on-surface/70">
                  Delivering to Koramangala 560034 • Estimated arrival 18 mins
                </span>
              </div>
            </div>

            <div className="flex items-center gap-space-xs w-full sm:w-auto justify-end">
              <button
                onClick={() => setIsCartOpen(true)}
                className="h-10 px-space-md rounded-xl font-label-md text-label-md text-inverse-on-surface hover:bg-white/10 transition-colors flex items-center cursor-pointer"
              >
                View Cart
              </button>
              <button
                onClick={() => setIsCartOpen(true)}
                className="h-10 px-space-lg rounded-xl font-label-md text-label-md bg-secondary text-white hover:bg-secondary/90 transition-colors font-bold shadow-md flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <span>Proceed to 15-Min Checkout</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Prescription Upload Modal ── */}
      {rxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-outline-variant/40 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-on-surface font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">cloud_upload</span>
                Upload Prescription
              </h3>
              <button
                onClick={() => setRxModalOpen(false)}
                className="p-1 rounded-lg hover:bg-surface-container text-outline cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            {rxSuccess ? (
              <div className="p-4 rounded-2xl bg-secondary-container text-on-secondary-container text-center space-y-2">
                <span className="material-symbols-outlined text-[36px] text-secondary">check_circle</span>
                <p className="font-bold">Prescription Uploaded Successfully!</p>
                <p className="text-xs opacity-80">Our registered clinical pharmacist is verifying it. 15% discount code applied.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <label className="border-2 border-dashed border-outline-variant hover:border-primary rounded-2xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-surface-container-low">
                  <span className="material-symbols-outlined text-[40px] text-primary">add_photo_alternate</span>
                  <span className="font-label-md font-semibold text-on-surface text-center">
                    Click to select prescription image or PDF
                  </span>
                  <span className="text-xs text-outline">Supported: JPG, PNG, PDF up to 10MB</span>
                  <input type="file" accept="image/*,.pdf" onChange={handleUploadRx} className="hidden" />
                </label>
                <p className="text-xs text-on-surface-variant text-center">
                  Prescription is protected under HIPAA-compliant 256-bit encryption.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PharmacyPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-outline">Loading Arogya Pharmacy...</div>}>
      <PharmacyContent />
    </Suspense>
  );
}
