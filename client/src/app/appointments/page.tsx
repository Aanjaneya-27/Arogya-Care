"use client";

import { useState } from "react";
import Link from "next/link";
import { useHealthStore } from "@/store/useHealthStore";
import { useToastStore } from "@/store/useToastStore";
import { Appointment } from "@/types";

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "past" | "transactions">("all");
  const [addMoneyModal, setAddMoneyModal] = useState(false);
  const [addAmount, setAddAmount] = useState("1000");
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [videoCallModal, setVideoCallModal] = useState(false);
  const [activeCallDoctor, setActiveCallDoctor] = useState<Appointment | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { walletBalance, appointments, transactions, addMoneyToWallet, cancelAppointment } =
    useHealthStore();
  const { addToast } = useToastStore();

  const handleAddMoney = () => {
    const val = parseInt(addAmount, 10);
    if (!isNaN(val) && val > 0) {
      const res = addMoneyToWallet(val, "UPI (Google Pay)");
      setAddedSuccess(true);
      addToast({
        type: "success",
        title: "Wallet Recharged",
        message: `₹${val.toLocaleString("en-IN")} credited. Txn Ref: ${res.refId}`,
      });
      setTimeout(() => {
        setAddMoneyModal(false);
        setAddedSuccess(false);
      }, 1500);
    }
  };

  const handleCancel = (apt: Appointment) => {
    if (confirm(`Are you sure you want to cancel appointment with ${apt.doctorName}? ₹${apt.fee} will be instantly refunded to your Care Wallet.`)) {
      const res = cancelAppointment(apt.id);
      if (res.success) {
        addToast({
          type: "info",
          title: "Appointment Cancelled",
          message: `₹${apt.fee} refunded to your Care Wallet balance.`,
        });
      }
    }
  };

  const handleJoinCall = (apt: Appointment) => {
    setActiveCallDoctor(apt);
    setVideoCallModal(true);
  };

  // Filtered lists
  const upcomingAppointments = appointments.filter(
    (a) => a.status === "confirmed" && (searchQuery ? a.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) || a.refId.toLowerCase().includes(searchQuery.toLowerCase()) : true)
  );

  const pastAppointments = appointments.filter(
    (a) => (a.status === "completed" || a.status === "cancelled") && (searchQuery ? a.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) || a.refId.toLowerCase().includes(searchQuery.toLowerCase()) : true)
  );

  const filteredTransactions = transactions.filter((t) =>
    searchQuery
      ? t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.refId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  const lastTxn = transactions[0];

  return (
    <div className="flex flex-col w-full pb-24">
      <div className="w-full max-w-[1440px] mx-auto px-margin py-space-lg space-y-space-xl">
        {/* ── Top Bar: Breadcrumb & Title Section ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div className="space-y-space-xs">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant"
            >
              <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
                <span className="material-symbols-outlined text-[16px]">home</span>
                <span>Home</span>
              </Link>
              <span className="text-outline-variant">/</span>
              <span className="text-primary font-medium">My Appointments &amp; Digital Wallet</span>
            </nav>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
              My Appointments &amp; Digital Wallet
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              Manage your verified doctor consultations, monitor active tele-health appointments, and review clinical ledger transactions seamlessly.
            </p>
          </div>

          {/* Trust Badges Bar */}
          <div className="flex items-center flex-wrap gap-space-xs shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm shadow-sm border border-outline-variant/30">
              <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
              <span>ABHA ID: 91-4029-1830-4921</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm shadow-sm border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary text-[16px]">lock</span>
              <span>256-Bit Encrypted Telemetry</span>
            </div>
          </div>
        </div>

        {/* ── Digital Wallet Master Card ── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-inverse-surface via-[#17253d] to-[#0d1c2f] text-on-primary shadow-xl p-space-lg md:p-space-xl border border-slate-700/60">
          <div className="absolute -right-20 -top-24 w-80 h-80 rounded-full bg-primary/20 blur-3xl pointer-events-none"></div>
          <div className="absolute right-40 -bottom-20 w-64 h-64 rounded-full bg-secondary-container/15 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
            {/* Balance Column */}
            <div className="lg:col-span-6 space-y-space-md">
              <div className="flex items-center gap-space-xs">
                <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest/15 backdrop-blur-sm text-primary-fixed font-label-sm text-xs uppercase tracking-wider flex items-center gap-1.5 font-bold">
                  <span className="material-symbols-outlined text-[14px]">account_balance_wallet</span>
                  Care Wallet Ledger
                </span>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container/20 text-secondary-fixed font-label-sm text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed animate-ping"></span>
                  Instant Checkout Active
                </span>
              </div>
              <div>
                <div className="font-body-sm text-sm text-primary-fixed-dim font-medium tracking-wide">
                  Available Care Balance (Consultations &amp; Pharmacy)
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-display-lg text-display-lg font-bold tracking-tight text-white font-mono">
                    ₹{walletBalance.toLocaleString("en-IN")}
                    <span className="text-headline-md font-body-md text-surface-container-highest">.00</span>
                  </span>
                  <span className="font-label-sm text-xs text-secondary-fixed bg-secondary/30 px-2 py-0.5 rounded-md flex items-center gap-0.5 font-bold">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span> +₹250 Loyalty Perk
                  </span>
                </div>
              </div>

              {/* Quick Action CTAs */}
              <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
                <button
                  onClick={() => setAddMoneyModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-container text-white font-label-lg text-label-lg shadow-md hover:bg-primary transition-all active:scale-[0.98] cursor-pointer font-bold"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  <span>+ Add Money</span>
                </button>
                <button
                  onClick={() => setActiveTab("transactions")}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 text-white font-label-md text-label-md backdrop-blur-sm transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                  <span>View Ledger ({transactions.length})</span>
                </button>
                <Link
                  href="/doctors"
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-primary-fixed hover:text-white font-label-md text-label-md transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                  <span>Book Consultation</span>
                </Link>
              </div>
            </div>

            {/* Wallet Diagnostic Stats / Live Activity Banner */}
            <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-space-md">
              {lastTxn && (
                <div className="p-space-md rounded-2xl bg-surface-container-lowest/10 backdrop-blur-md space-y-space-xs shadow-inner border border-white/10">
                  <div className="flex items-center justify-between font-label-sm text-xs text-primary-fixed-dim">
                    <span className="flex items-center gap-1.5 font-semibold text-white">
                      <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim">schedule</span>
                      Last Wallet Activity
                    </span>
                    <span className="text-tertiary-fixed font-mono font-medium">{lastTxn.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-body-md text-sm text-white font-medium">
                        {lastTxn.title}
                      </div>
                      <div className="font-body-sm text-xs text-outline-variant">
                        {lastTxn.description}
                      </div>
                    </div>
                    <div
                      className={`text-right font-mono font-bold text-headline-sm ${
                        lastTxn.type === "credit" ? "text-secondary-fixed" : "text-white"
                      }`}
                    >
                      {lastTxn.type === "credit" ? "+" : "-"}₹{lastTxn.amount.toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              )}

              {/* Feature Tag Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs pt-1">
                <div className="p-2.5 rounded-xl bg-surface-container-lowest/5 flex items-center gap-2 border border-white/5">
                  <div className="p-1.5 rounded-lg bg-primary-container/30 text-primary-fixed">
                    <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  </div>
                  <div className="leading-tight">
                    <div className="font-label-sm text-xs text-white font-semibold">ABHA Linked</div>
                    <div className="text-[10px] text-primary-fixed-dim">Direct Claim Track</div>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-container-lowest/5 flex items-center gap-2 border border-white/5">
                  <div className="p-1.5 rounded-lg bg-secondary/30 text-secondary-fixed">
                    <span className="material-symbols-outlined text-[16px]">autorenew</span>
                  </div>
                  <div className="leading-tight">
                    <div className="font-label-sm text-xs text-white font-semibold">Auto Rx Debits</div>
                    <div className="text-[10px] text-primary-fixed-dim">Smart Refill Enabled</div>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-container-lowest/5 flex items-center gap-2 border border-white/5">
                  <div className="p-1.5 rounded-lg bg-tertiary/40 text-tertiary-fixed-dim">
                    <span className="material-symbols-outlined text-[16px]">savings</span>
                  </div>
                  <div className="leading-tight">
                    <div className="font-label-sm text-xs text-white font-semibold">Loyalty Perk</div>
                    <div className="text-[10px] text-primary-fixed-dim">₹250 Ready to Use</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Segmented Filter & Interactive Controls Bar ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          {/* Tabs */}
          <div className="flex items-center p-1.5 bg-surface-container-low rounded-2xl shadow-sm overflow-x-auto border border-outline-variant/30">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-5 py-2.5 rounded-xl font-label-lg text-label-lg transition-all shrink-0 cursor-pointer ${
                activeTab === "all"
                  ? "bg-surface-container-lowest text-primary font-bold shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              All Care Records ({appointments.length})
            </button>
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-5 py-2.5 rounded-xl font-label-lg text-label-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === "upcoming"
                  ? "bg-surface-container-lowest text-primary font-bold shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span>Upcoming</span>
              <span className="px-2 py-0.5 rounded-full bg-primary-container text-white text-[11px] font-bold">
                {appointments.filter((a) => a.status === "confirmed").length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`px-5 py-2.5 rounded-xl font-label-lg text-label-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === "past"
                  ? "bg-surface-container-lowest text-primary font-bold shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span>Past &amp; History</span>
              <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-[11px] font-bold">
                {appointments.filter((a) => a.status !== "confirmed").length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`px-5 py-2.5 rounded-xl font-label-lg text-label-lg transition-all shrink-0 cursor-pointer ${
                activeTab === "transactions"
                  ? "bg-surface-container-lowest text-primary font-bold shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Wallet Transactions ({transactions.length})
            </button>
          </div>

          {/* Search & Filters Utility */}
          <div className="flex items-center gap-space-sm w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <span className="material-symbols-outlined text-outline absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px]">
                search
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-outline border border-outline-variant/40"
                placeholder="Search doctor or txn ID..."
                type="text"
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-3 h-11 rounded-xl bg-surface-container text-on-surface text-xs font-semibold cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ── Master Grid Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Left 8 Columns: Appointments & Transactions */}
          <div className="lg:col-span-8 space-y-space-lg">
            {/* UPCOMING APPOINTMENTS LIST */}
            {(activeTab === "all" || activeTab === "upcoming") && (
              <div className="space-y-space-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-secondary"></span>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                      Upcoming Consultations ({upcomingAppointments.length})
                    </h2>
                  </div>
                  <span className="font-label-sm text-xs text-secondary bg-secondary-container/40 px-3 py-1 rounded-full font-bold">
                    Telemedicine Link Ready
                  </span>
                </div>

                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm hover:shadow-md transition-shadow relative overflow-hidden space-y-space-md border border-outline-variant/30"
                      >
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-secondary via-secondary-container to-primary"></div>
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-space-md pt-space-xs">
                          <div className="flex items-start gap-space-md">
                            <div className="relative shrink-0">
                              <img
                                alt={apt.doctorName}
                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-sm bg-surface-container"
                                src={apt.doctorImage}
                              />
                              <span className="absolute -bottom-1.5 -right-1.5 bg-secondary text-white p-1 rounded-lg shadow-sm flex items-center justify-center">
                                <span className="material-symbols-outlined text-[14px]">videocam</span>
                              </span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                                  {apt.doctorName}
                                </h3>
                                <span className="px-2.5 py-0.5 rounded-full bg-secondary-container/50 text-on-secondary-container font-label-sm text-xs font-semibold flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[13px]">check_circle</span>
                                  Confirmed
                                </span>
                              </div>
                              <p className="font-body-md text-sm text-primary font-medium">
                                {apt.doctorSpecialty} · {apt.hospital}
                              </p>
                              <p className="font-body-sm text-xs text-on-surface-variant flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px] text-outline">schedule</span>
                                <span>{apt.day}, {apt.date} • {apt.slot}</span>
                              </p>
                              <p className="text-[11px] font-mono text-outline">
                                Ref: {apt.refId} • Fee: ₹{apt.fee} (Paid via Wallet)
                              </p>
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => handleJoinCall(apt)}
                              className="flex-1 sm:flex-none h-10 px-4 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-label-md text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px]">videocam</span>
                              <span>Join HD Room</span>
                            </button>
                            <button
                              onClick={() => handleCancel(apt)}
                              className="h-10 px-3 rounded-xl hover:bg-error-container/30 text-error font-label-md text-xs font-semibold transition-colors cursor-pointer"
                            >
                              Cancel &amp; Refund
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-surface-container-lowest text-center space-y-2 border border-outline-variant/30">
                    <p className="text-on-surface-variant text-sm">No upcoming appointments scheduled.</p>
                    <Link
                      href="/doctors"
                      className="inline-flex items-center gap-1.5 text-primary text-xs font-bold hover:underline"
                    >
                      <span className="material-symbols-outlined text-[16px]">calendar_add_on</span>
                      Book with a specialist today
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* PAST APPOINTMENTS LIST */}
            {(activeTab === "all" || activeTab === "past") && (
              <div className="space-y-space-md pt-space-md">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-outline"></span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                    Consultation History ({pastAppointments.length})
                  </h2>
                </div>

                <div className="space-y-3">
                  {pastAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="rounded-2xl bg-surface-container-lowest p-space-md shadow-sm border border-outline-variant/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          alt={apt.doctorName}
                          className="w-14 h-14 rounded-xl object-cover bg-surface-container shrink-0"
                          src={apt.doctorImage}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-label-lg font-bold text-on-surface">
                              {apt.doctorName}
                            </h4>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                apt.status === "completed"
                                  ? "bg-surface-container text-on-surface-variant"
                                  : "bg-error-container text-on-error-container"
                              }`}
                            >
                              {apt.status}
                            </span>
                          </div>
                          <p className="text-xs text-on-surface-variant">{apt.doctorSpecialty}</p>
                          <p className="text-[11px] text-outline font-mono">
                            {apt.date} • Ref: {apt.refId}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => {
                            addToast({
                              type: "info",
                              title: "Prescription Downloaded",
                              message: `Digital Rx for ${apt.refId} downloaded.`,
                            });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px] text-primary">receipt</span>
                          <span>Prescription</span>
                        </button>
                        <Link
                          href={`/doctors?doc=${apt.doctorId}`}
                          className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-white text-xs font-bold cursor-pointer"
                        >
                          Book Again
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TRANSACTIONS TABLE */}
            {(activeTab === "all" || activeTab === "transactions") && (
              <div className="space-y-space-md pt-space-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                      Recent Wallet Activity &amp; Billing
                    </h2>
                    <p className="font-body-sm text-xs text-on-surface-variant">
                      Real-time ledger of prepaid wallet debits, credits, and refunds.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      addToast({
                        type: "success",
                        title: "Statement Downloaded",
                        message: "Your complete Care Wallet PDF statement is saved.",
                      });
                    }}
                    className="flex items-center gap-1.5 text-primary hover:text-primary-container font-label-md text-xs font-semibold transition-colors self-start sm:self-auto cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    <span>Download Statement</span>
                  </button>
                </div>

                <div className="rounded-2xl bg-surface-container-lowest shadow-sm overflow-hidden border border-outline-variant/30">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-low font-label-sm text-xs text-on-surface-variant uppercase tracking-wider">
                          <th className="py-3 px-space-md font-semibold">Transaction Details</th>
                          <th className="py-3 px-space-md font-semibold">Date &amp; ID</th>
                          <th className="py-3 px-space-md font-semibold">Status</th>
                          <th className="py-3 px-space-md font-semibold text-right">Amount</th>
                          <th className="py-3 px-space-md font-semibold text-center">Receipt</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/20 font-body-sm text-xs">
                        {filteredTransactions.map((txn) => (
                          <tr key={txn.id} className="hover:bg-surface-container-low/50 transition-colors">
                            <td className="py-3.5 px-space-md">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                    txn.type === "credit"
                                      ? "bg-secondary-container/40 text-secondary"
                                      : "bg-primary-container/15 text-primary"
                                  }`}
                                >
                                  <span className="material-symbols-outlined text-[18px]">
                                    {txn.type === "credit" ? "add" : "remove"}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-label-md text-xs font-bold text-on-surface">
                                    {txn.title}
                                  </div>
                                  <div className="font-body-sm text-[11px] text-on-surface-variant">
                                    {txn.description}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-space-md">
                              <div className="font-label-sm text-xs text-on-surface">{txn.timestamp}</div>
                              <div className="font-mono text-[10px] text-outline">{txn.refId}</div>
                            </td>
                            <td className="py-3.5 px-space-md">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  txn.status === "success"
                                    ? "bg-secondary-container/50 text-secondary"
                                    : "bg-surface-container-high text-on-surface-variant"
                                }`}
                              >
                                {txn.status}
                              </span>
                            </td>
                            <td
                              className={`py-3.5 px-space-md text-right font-mono font-bold text-sm ${
                                txn.type === "credit" ? "text-secondary" : "text-on-surface"
                              }`}
                            >
                              {txn.type === "credit" ? "+" : "-"}₹{txn.amount.toLocaleString("en-IN")}.00
                            </td>
                            <td className="py-3.5 px-space-md text-center">
                              <button
                                onClick={() => {
                                  addToast({
                                    type: "info",
                                    title: "Invoice Downloaded",
                                    message: `Invoice for ${txn.refId} generated.`,
                                  });
                                }}
                                className="p-1 rounded-lg text-outline hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
                                title="Download Receipt"
                              >
                                <span className="material-symbols-outlined text-[18px]">receipt</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right 4 Columns: Side Sheet & Clinical Vitals Widget Matrix */}
          <div className="lg:col-span-4 space-y-space-md">
            {/* Synced Connected Devices Widget */}
            <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-sm border border-outline-variant/30 space-y-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">devices_wearables</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Connected Vitals</h3>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-container">
                  Live Sync
                </span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Data streams directly to your doctor's diagnostic console prior to video consultation.
              </p>

              {/* Vitals Metrics Grid */}
              <div className="grid grid-cols-2 gap-space-xs">
                {/* Blood Pressure Card */}
                <div className="p-space-sm rounded-xl bg-surface-container-low space-y-1">
                  <div className="flex items-center justify-between text-outline">
                    <span className="font-label-sm text-[11px] uppercase font-semibold">Blood Pressure</span>
                    <span className="material-symbols-outlined text-error text-[16px]">cardiology</span>
                  </div>
                  <div className="font-headline-md text-headline-md text-on-surface font-mono font-bold">118/78</div>
                  <div className="text-[10px] text-secondary font-medium">Optimal · 2h ago</div>
                </div>

                {/* Glucose Level Card */}
                <div className="p-space-sm rounded-xl bg-surface-container-low space-y-1">
                  <div className="flex items-center justify-between text-outline">
                    <span className="font-label-sm text-[11px] uppercase font-semibold">Blood Sugar</span>
                    <span className="material-symbols-outlined text-tertiary text-[16px]">bloodtype</span>
                  </div>
                  <div className="font-headline-md text-headline-md text-on-surface font-mono font-bold">
                    96 <span className="text-[12px] font-normal text-outline">mg/dL</span>
                  </div>
                  <div className="text-[10px] text-secondary font-medium">In Range · Today</div>
                </div>
              </div>

              <Link
                href="/pharmacy"
                className="w-full py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">add_link</span>
                <span>Pair Another Medical Device</span>
              </Link>
            </div>

            {/* Telemedicine Checklist Card */}
            <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-sm border border-outline-variant/30 space-y-space-sm">
              <div className="flex items-center gap-2 text-on-surface">
                <span className="material-symbols-outlined text-primary text-[20px]">checklist</span>
                <h3 className="font-headline-sm text-headline-sm font-bold">Consultation Readiness</h3>
              </div>
              <div className="space-y-space-xs font-body-sm text-xs">
                <label className="flex items-center gap-3 p-2 rounded-xl bg-surface-container-low cursor-pointer">
                  <input defaultChecked className="w-4 h-4 rounded text-primary" type="checkbox" />
                  <span className="text-on-surface font-medium">Digital Medical Vault auto-shared</span>
                </label>
                <label className="flex items-center gap-3 p-2 rounded-xl bg-surface-container-low cursor-pointer">
                  <input defaultChecked className="w-4 h-4 rounded text-primary" type="checkbox" />
                  <span className="text-on-surface font-medium">Camera &amp; Audio permissions granted</span>
                </label>
                <label className="flex items-center gap-3 p-2 rounded-xl bg-surface-container-low cursor-pointer">
                  <input defaultChecked className="w-4 h-4 rounded text-primary" type="checkbox" />
                  <span className="text-on-surface font-medium">Auto-Debit hold cleared from Care Wallet</span>
                </label>
              </div>
              <div className="pt-1">
                <button
                  onClick={() => setVideoCallModal(true)}
                  className="text-primary hover:underline font-label-sm text-xs flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">help_outline</span>
                  <span>Test audio &amp; video link in sandbox room</span>
                </button>
              </div>
            </div>

            {/* Care Concierge Tile */}
            <div className="rounded-2xl bg-gradient-to-br from-surface-container-high to-surface-container p-space-md space-y-space-sm shadow-sm border border-outline-variant/30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">support_agent</span>
                </div>
                <div>
                  <div className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight">
                    24/7 Care Concierge
                  </div>
                  <div className="font-body-sm text-xs text-on-surface-variant">
                    Instant tele-support &amp; insurance co-pay assist
                  </div>
                </div>
              </div>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-medibot"))}
                className="w-full py-2.5 rounded-xl bg-surface-container-lowest text-primary hover:bg-surface-container-lowest/80 font-label-md text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Ask MediBot AI</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Add Money Modal ── */}
      {addMoneyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 border border-outline-variant/40 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-on-surface font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">add_circle</span>
                Top-up Care Wallet
              </h3>
              <button
                onClick={() => setAddMoneyModal(false)}
                className="p-1 rounded-lg hover:bg-surface-container text-outline cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {addedSuccess ? (
              <div className="p-4 rounded-2xl bg-secondary-container text-on-secondary-container text-center space-y-1">
                <span className="material-symbols-outlined text-[36px] text-secondary">check_circle</span>
                <p className="font-bold">₹{addAmount} Added Successfully!</p>
                <p className="text-xs">Your new balance is ₹{walletBalance.toLocaleString("en-IN")}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="font-label-sm text-xs text-on-surface-variant block mb-1">Enter Amount (₹)</label>
                  <input
                    type="number"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-surface-container-low text-on-surface font-bold text-xl outline-none focus:ring-2 focus:ring-primary border border-outline-variant"
                  />
                </div>
                <div className="flex gap-2">
                  {["500", "1000", "2000", "5000"].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setAddAmount(amt)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        addAmount === amt
                          ? "bg-primary text-white border-primary"
                          : "border-outline-variant hover:bg-surface-container"
                      }`}
                    >
                      +₹{amt}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleAddMoney}
                  className="w-full h-11 bg-primary hover:bg-primary-container text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  Pay &amp; Add ₹{addAmount}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Test Room / Video Call Modal ── */}
      {videoCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#0B0F19] text-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-800 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                <h3 className="text-lg font-bold">Arogya TeleVault HD Video Room</h3>
              </div>
              <button
                onClick={() => setVideoCallModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="relative aspect-video rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden">
              <div className="text-center space-y-2 p-4">
                <div className="w-16 h-16 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-[32px]">videocam</span>
                </div>
                <p className="font-semibold text-sm">
                  Consultation with {activeCallDoctor ? activeCallDoctor.doctorName : "Dr. Rajesh Sharma, MD"}
                </p>
                <p className="text-xs text-slate-400">P2P 256-Bit Encrypted WebRTC Session Connected</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                  <span className="material-symbols-outlined text-[14px]">mic</span> Audio/Video Active
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">mic</span>
              </button>
              <button className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">videocam</span>
              </button>
              <button
                onClick={() => setVideoCallModal(false)}
                className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm cursor-pointer"
              >
                Leave Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
