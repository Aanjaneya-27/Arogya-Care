"use client";

import { useState } from "react";
import Link from "next/link";
import { useHealthStore } from "@/store/useHealthStore";
import { useToastStore } from "@/store/useToastStore";

interface SavedAddress {
  id: string;
  type: "Home" | "Work" | "Other";
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

interface SavedUPI {
  id: string;
  vpa: string;
  bankName: string;
  isPrimary: boolean;
}

export default function ProfilePage() {
  const { walletBalance, appointments } = useHealthStore();
  const { addToast } = useToastStore();

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "Aanjaneya Mukherjee",
    phone: "+91 98452 19024",
    email: "aanjaneya.m@healthcare.in",
    bloodGroup: "O+",
    abhaId: "91-4029-1830-4921",
    dob: "14 Aug 1994",
    gender: "Male",
    height: "178 cm",
    weight: "74 kg",
    emergencyContactName: "Pooja Mukherjee (Sister)",
    emergencyContactPhone: "+91 98765 43210",
  });

  const [addresses, setAddresses] = useState<SavedAddress[]>([
    {
      id: "addr-1",
      type: "Home",
      name: "Aanjaneya Mukherjee",
      phone: "+91 98452 19024",
      addressLine: "Flat 402, Prestige Silver Springs, 18th Main, 4th Block, Koramangala",
      city: "Bengaluru, Karnataka",
      pincode: "560034",
      isDefault: true,
    },
    {
      id: "addr-2",
      type: "Work",
      name: "Aanjaneya Mukherjee",
      phone: "+91 98452 19024",
      addressLine: "Level 6, Tech Park Towers, Outer Ring Road, Bellandur",
      city: "Bengaluru, Karnataka",
      pincode: "560103",
      isDefault: false,
    },
  ]);

  const [savedUpis, setSavedUpis] = useState<SavedUPI[]>([
    {
      id: "upi-1",
      vpa: "aanjaneya@okhdfcbank",
      bankName: "HDFC Bank Ltd.",
      isPrimary: true,
    },
    {
      id: "upi-2",
      vpa: "aanjaneya.care@paytm",
      bankName: "Paytm Payments Bank",
      isPrimary: false,
    },
  ]);

  const [newUpiModal, setNewUpiModal] = useState(false);
  const [newUpiVpa, setNewUpiVpa] = useState("");
  const [newUpiBank, setNewUpiBank] = useState("");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    addToast({
      type: "success",
      title: "Profile Updated",
      message: "Your clinical identity and contact details were saved successfully.",
    });
  };

  const handleAddUpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpiVpa.trim()) return;
    const newEntry: SavedUPI = {
      id: `upi-${Date.now()}`,
      vpa: newUpiVpa.trim(),
      bankName: newUpiBank.trim() || "National Banking Node",
      isPrimary: savedUpis.length === 0,
    };
    setSavedUpis([...savedUpis, newEntry]);
    setNewUpiModal(false);
    setNewUpiVpa("");
    setNewUpiBank("");
    addToast({
      type: "success",
      title: "UPI Added",
      message: `${newEntry.vpa} linked for 1-click Care Wallet settlements.`,
    });
  };

  const handleRemoveUpi = (id: string) => {
    setSavedUpis((prev) => prev.filter((u) => u.id !== id));
    addToast({
      type: "info",
      title: "UPI Removed",
      message: "The payment address has been unlinked from your account.",
    });
  };

  const handleSetPrimaryUpi = (id: string) => {
    setSavedUpis((prev) =>
      prev.map((u) => ({
        ...u,
        isPrimary: u.id === id,
      }))
    );
  };

  const activeConsultations = appointments.filter((a) => a.status === "confirmed").length;

  return (
    <div className="flex flex-col w-full pb-28 bg-[#F4F7FC] min-h-screen">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ── Breadcrumb ── */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-medium text-slate-500"
        >
          <Link href="/" className="hover:text-primary flex items-center gap-1 transition-colors">
            <span className="material-symbols-outlined text-[16px]">home</span>
            <span>Home</span>
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900 font-semibold">User Health Profile</span>
        </nav>

        {/* ── Header: Profile Master Banner Card ── */}
        <div className="relative overflow-hidden rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5 sm:gap-6">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full ring-4 ring-[#00D2B4]/40 overflow-hidden shrink-0 shadow-lg">
              <img
                alt="Aanjaneya"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida/AEtjO1WXN5QFNpLThaeLKW_3164QY1KWVZVcZ3sX17UvmqrfXN8VoPfrgUtPZcXJNF6rnZBp2aE9UeFF7cQKnDhuw5uBUzPQ2xLg_C2_wa5Rk1ItUqd0wACwjJM4rEehLJmrVXgB20zo_jNfsv-v5-WvPtZhUqhbHEu-qpkjFmO0lXZV2MonmlOc94zd2RsMdDLbBL8vg2Ch1aGVY-BkL95SXmxGt2IaMlt9d-qcAerfCZxYAFmMTPwQGGaggw"
              />
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[12px] text-white">check</span>
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {profileData.fullName}
                </h1>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold shadow-xs">
                  <span className="material-symbols-outlined text-[14px] text-emerald-600">verified</span>
                  Plus Health Member
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-2 flex-wrap">
                <span>Member since Jan 2024</span>
                <span>•</span>
                <span className="font-mono text-slate-700 font-semibold">ABHA ID: {profileData.abhaId}</span>
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold font-mono">
                  Blood Group: {profileData.bloodGroup}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold">
                  Care Wallet: ₹{walletBalance.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex-1 sm:flex-none h-11 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isEditing ? "close" : "edit"}
              </span>
              <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
            </button>
            <Link
              href="/appointments"
              className="flex-1 sm:flex-none h-11 px-5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">account_balance_wallet</span>
              <span>Wallet Ledger</span>
            </Link>
          </div>
        </div>

        {/* ── Quick Health Diagnostics Summary Widgets ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Synced Hardware</span>
              <span className="material-symbols-outlined text-primary text-[20px]">devices_wearables</span>
            </div>
            <div className="text-xl font-bold text-slate-900">Omron HEM-7121</div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Bluetooth Synced • 118/78 mmHg</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Active Tele-Consults</span>
              <span className="material-symbols-outlined text-secondary text-[20px]">videocam</span>
            </div>
            <div className="text-xl font-bold text-slate-900">
              {activeConsultations} Upcoming
            </div>
            <Link
              href="/appointments"
              className="text-xs text-primary font-semibold hover:underline block"
            >
              View appointment roster →
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Active Prescriptions</span>
              <span className="material-symbols-outlined text-indigo-600 text-[20px]">prescriptions</span>
            </div>
            <div className="text-xl font-bold text-slate-900">2 Chronic Cycles</div>
            <div className="text-xs text-slate-500">
              Telmisartan 40mg + Metformin 500mg
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Emergency Contact</span>
              <span className="material-symbols-outlined text-rose-500 text-[20px]">emergency</span>
            </div>
            <div className="text-base font-bold text-slate-900 truncate">
              {profileData.emergencyContactName}
            </div>
            <div className="text-xs text-slate-500 font-mono">
              {profileData.emergencyContactPhone}
            </div>
          </div>
        </div>

        {/* ── Main Two-Column Dashboard Content ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Personal & Medical Information */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">badge</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Personal &amp; Medical Identity</h3>
                    <p className="text-xs text-slate-500">Encrypted in compliance with Ayushman Bharat Digital Mission (ABDM)</p>
                  </div>
                </div>
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Contact Number</label>
                      <input
                        type="text"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Blood Group</label>
                      <input
                        type="text"
                        value={profileData.bloodGroup}
                        onChange={(e) => setProfileData({ ...profileData, bloodGroup: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Height &amp; Weight</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={profileData.height}
                          onChange={(e) => setProfileData({ ...profileData, height: e.target.value })}
                          className="w-1/2 h-11 px-3 rounded-xl border border-slate-200 text-sm outline-none"
                        />
                        <input
                          type="text"
                          value={profileData.weight}
                          onChange={(e) => setProfileData({ ...profileData, weight: e.target.value })}
                          className="w-1/2 h-11 px-3 rounded-xl border border-slate-200 text-sm outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Emergency Contact</label>
                      <input
                        type="text"
                        value={profileData.emergencyContactPhone}
                        onChange={(e) => setProfileData({ ...profileData, emergencyContactPhone: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-sm hover:bg-primary-container cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Full Legal Name</span>
                    <span className="text-sm font-bold text-slate-900 mt-0.5 block">{profileData.fullName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Primary Mobile</span>
                    <span className="text-sm font-bold text-slate-900 mt-0.5 block font-mono">{profileData.phone}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Registered Email</span>
                    <span className="text-sm font-bold text-slate-900 mt-0.5 block">{profileData.email}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Blood Group &amp; Rhesus</span>
                    <span className="text-sm font-bold text-rose-600 mt-0.5 block font-mono">{profileData.bloodGroup} Positive</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Ayushman ABHA Health ID</span>
                    <span className="text-sm font-bold text-slate-900 mt-0.5 block font-mono">{profileData.abhaId}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Physical Metrics</span>
                    <span className="text-sm font-bold text-slate-900 mt-0.5 block">{profileData.height} • {profileData.weight}</span>
                  </div>
                  <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                    <span className="text-xs text-slate-400 font-medium block">Primary Emergency Care Contact</span>
                    <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                      {profileData.emergencyContactName} ({profileData.emergencyContactPhone})
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Saved Addresses Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">home_pin</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Saved Delivery Addresses</h3>
                    <p className="text-xs text-slate-500">For 15-minute hyper-local pharmaceutical &amp; device despatches</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 text-xs font-bold uppercase">
                          {addr.type}
                        </span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                            Default Hub
                          </span>
                        )}
                        <span className="text-xs font-bold text-slate-900">{addr.name}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed max-w-md">
                        {addr.addressLine}, {addr.city} - <strong className="font-mono text-slate-900">{addr.pincode}</strong>
                      </p>
                      <span className="text-[11px] text-slate-500 block font-mono">Mobile: {addr.phone}</span>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => {
                          addToast({
                            type: "info",
                            title: "Default Address Set",
                            message: `${addr.type} address is now primary.`,
                          });
                        }}
                        className="text-xs text-primary font-semibold hover:underline cursor-pointer"
                      >
                        Set Default
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Linked UPI IDs, Digital Vault & App Access */}
          <div className="lg:col-span-5 space-y-8">
            {/* Manage Saved UPIs Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">account_balance</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Saved UPI &amp; Bank Accounts</h3>
                    <p className="text-xs text-slate-500">For 1-click Care Wallet recharges &amp; refunds</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {savedUpis.map((upi) => (
                  <div
                    key={upi.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs font-mono">
                        UPI
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-900">{upi.vpa}</span>
                          {upi.isPrimary && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              Primary
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 block">{upi.bankName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {!upi.isPrimary && (
                        <button
                          onClick={() => handleSetPrimaryUpi(upi.id)}
                          className="text-[11px] text-primary hover:underline font-semibold cursor-pointer mr-1"
                        >
                          Make Primary
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveUpi(upi.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove UPI"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {newUpiModal ? (
                <form onSubmit={handleAddUpi} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="text-xs font-bold text-slate-900">Link New UPI ID</div>
                  <input
                    type="text"
                    placeholder="e.g. mobile@upi or name@bank"
                    value={newUpiVpa}
                    onChange={(e) => setNewUpiVpa(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-mono outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    placeholder="Bank Name (e.g. SBI, HDFC Bank)"
                    value={newUpiBank}
                    onChange={(e) => setNewUpiBank(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:border-primary"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setNewUpiModal(false)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-bold cursor-pointer"
                    >
                      Verify &amp; Link
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setNewUpiModal(true)}
                  className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-primary text-primary font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>+ Link Another UPI ID</span>
                </button>
              )}
            </div>

            {/* Quick Actions & Privacy Controls */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Clinical Health Actions
              </h4>
              <div className="space-y-2">
                <Link
                  href="/appointments"
                  className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-semibold text-slate-800 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">calendar_month</span>
                    Consultation History &amp; Test Room
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-slate-400">chevron_right</span>
                </Link>
                <Link
                  href="/pharmacy"
                  className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-semibold text-slate-800 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px]">medication</span>
                    Order Monthly Prescriptions &amp; Devices
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-slate-400">chevron_right</span>
                </Link>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("open-medibot"))}
                  className="w-full p-3 rounded-xl bg-blue-50/60 hover:bg-blue-100/60 flex items-center justify-between text-xs font-semibold text-primary transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">auto_awesome</span>
                    Chat with MediBot AI Health Companion
                  </span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
