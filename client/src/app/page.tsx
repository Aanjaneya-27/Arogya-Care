"use client";

import Link from "next/link";
import { useState } from "react";
import GlobalSearchBar from "@/components/GlobalSearchBar";
import ProductCard from "@/components/ProductCard";
import DoctorBookingModal from "@/components/DoctorBookingModal";
import { INITIAL_PRODUCTS, INITIAL_DOCTORS } from "@/data/mockData";
import { Doctor } from "@/types";

const DAYS = [
  { tag: "TODAY", day: "Mon", date: "24", label: "Mon, 24" },
  { tag: "TOMORROW", day: "Tue", date: "25", label: "Tue, 25" },
  { tag: "DAY 3", day: "Wed", date: "26", label: "Wed, 26" },
  { tag: "DAY 4", day: "Thu", date: "27", label: "Thu, 27" },
  { tag: "DAY 5", day: "Fri", date: "28", label: "Fri, 28" },
  { tag: "WEEKEND", day: "Sat", date: "29", label: "Sat, 29" },
  { tag: "WEEKEND", day: "Sun", date: "30", label: "Sun, 30" },
];

export default function HomePage() {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [doctorSelectedSlots, setDoctorSelectedSlots] = useState<Record<string, string>>({});

  const [bookingModalData, setBookingModalData] = useState<{
    doctor: Doctor;
    day: string;
    date: string;
    slot: string;
  } | null>(null);

  const currentDay = DAYS[selectedDayIndex];

  const availableDoctors = INITIAL_DOCTORS.filter((doc) => {
    const s = doc.schedule.find((slot) => slot.day === currentDay.day);
    return s && s.avail;
  });

  const handleBookDoctor = (doctor: Doctor) => {
    const daySchedule = doctor.schedule.find((s) => s.day === currentDay.day);
    const activeSlot =
      doctorSelectedSlots[doctor.id] ||
      (daySchedule && daySchedule.slots.length > 0 ? daySchedule.slots[0] : "10:00 AM");

    setBookingModalData({
      doctor,
      day: currentDay.day,
      date: currentDay.date,
      slot: activeSlot,
    });
  };

  return (
    <div className="flex flex-col w-full">
      {/* ── Top Notification / Live Dispatch Strip ── */}
      <section className="w-full px-margin pt-space-md">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-space-sm bg-surface-container-low px-space-md py-space-xs rounded-xl shadow-sm border border-outline-variant/30">
          <div className="flex items-center gap-space-sm">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container">
              <span className="material-symbols-outlined text-[16px]">bolt</span>
            </span>
            <span className="font-label-md text-label-md text-on-surface font-semibold">
              Instant Telehealth &amp; Medical Hardware Despatch:
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Guaranteed 15-min delivery active in Koramangala &amp; Indiranagar hub zones.
            </span>
          </div>
          <div className="flex items-center gap-space-md">
            <span className="inline-flex items-center gap-space-xs font-label-sm text-label-sm text-secondary font-bold">
              <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              24x7 Clinical Desk Live
            </span>
            <Link
              className="font-label-sm text-label-sm text-primary hover:underline font-semibold flex items-center gap-space-xs"
              href="/appointments"
            >
              Track Live Prescription{" "}
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Hero Banner Section with Debounced Real-Time Search ── */}
      <section className="w-full px-margin pt-space-lg pb-space-xl">
        <div className="max-w-[1440px] mx-auto rounded-3xl relative bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-tertiary-fixed/30 p-space-xl shadow-md border border-outline-variant/30">
          {/* Ambient Glow Elements */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-secondary-container/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container text-primary font-label-md text-label-md mb-space-md shadow-sm">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>NABH Accredited Integrated Care Platform</span>
            </div>

            <h1 className="font-display-lg text-display-lg text-on-surface font-bold tracking-tight mb-space-sm text-center">
              Complete Healthcare, Delivered &amp; Booked Instantly.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-space-xl text-center">
              Order authentic medicines &amp; certified medical hardware, consult verified multi-specialty doctors across 7 days, and chat with your AI health companion.
            </p>

            {/* Debounced Global Real-Time Search Input with Live Dropdown */}
            <div className="w-full max-w-3xl mx-auto">
              <GlobalSearchBar isHero={true} />
            </div>

            {/* Quick Filter Chips */}
            <div className="flex flex-wrap items-center justify-center gap-space-xs mt-space-md">
              <span className="font-label-sm text-label-sm text-on-surface-variant mr-space-xs uppercase tracking-wider font-semibold">
                Quick Suggestions:
              </span>
              <Link
                href="/pharmacy?search=blood+pressure"
                className="px-space-md py-space-xs rounded-full bg-surface-container-lowest text-on-surface hover:bg-primary hover:text-white font-label-sm text-label-sm transition-all shadow-sm border border-outline-variant/30"
              >
                Blood Pressure Monitors
              </Link>
              <Link
                href="/pharmacy?category=diabetes"
                className="px-space-md py-space-xs rounded-full bg-surface-container-lowest text-on-surface hover:bg-primary hover:text-white font-label-sm text-label-sm transition-all shadow-sm border border-outline-variant/30"
              >
                Diabetes Care
              </Link>
              <Link
                href="/doctors"
                className="px-space-md py-space-xs rounded-full bg-surface-container-lowest text-on-surface hover:bg-primary hover:text-white font-label-sm text-label-sm transition-all shadow-sm border border-outline-variant/30"
              >
                Cardiologists
              </Link>
              <Link
                href="/doctors"
                className="px-space-md py-space-xs rounded-full bg-surface-container-lowest text-on-surface hover:bg-primary hover:text-white font-label-sm text-label-sm transition-all shadow-sm border border-outline-variant/30"
              >
                Dermatologists
              </Link>
              <span className="px-space-md py-space-xs rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold flex items-center gap-space-xs shadow-sm">
                <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                Instant 15-Min Delivery
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 1: Health Store (Medicines & Smart Vitals Devices) ── */}
      <section className="w-full px-margin py-space-lg">
        <div className="max-w-[1440px] mx-auto">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-space-md mb-space-lg">
            <div>
              <div className="inline-flex items-center gap-space-xs text-primary font-label-md text-label-md mb-space-xs font-semibold">
                <span className="material-symbols-outlined text-[18px]">medical_services</span>
                <span>Clinically Approved &amp; Calibrated</span>
              </div>
              <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
                Health Store: Medicines &amp; Smart Vitals Devices
              </h2>
            </div>
            <Link
              className="inline-flex items-center gap-space-xs font-label-lg text-label-lg text-primary hover:text-on-primary-fixed-variant transition-colors font-semibold group"
              href="/pharmacy"
            >
              Explore All Products
              <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>
          </div>

          {/* Featured Products Grid using ProductCard component */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {INITIAL_PRODUCTS.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2: 7-Day Multi-Specialty Doctor Appointment System ── */}
      <section className="w-full px-margin py-space-lg mb-space-xl">
        <div className="max-w-[1440px] mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-space-md mb-space-lg">
            <div>
              <div className="inline-flex items-center gap-space-xs text-primary font-label-md text-label-md mb-space-xs font-semibold">
                <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                <span>Pre-screened Top 1% Clinicians</span>
              </div>
              <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
                Multi-Specialty Doctors Available This Week
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Book certified doctors spanning multiple expertise fields with advance online Care Wallet payment.
              </p>
            </div>
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-secondary text-[20px]">security</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                100% Free Cancellation with instant Care Wallet refund
              </span>
            </div>
          </div>

          {/* 7-Day Horizontal Pill Selector */}
          <div className="w-full overflow-x-auto pb-space-sm mb-space-md">
            <div className="flex items-center gap-space-sm min-w-max">
              {DAYS.map((item, idx) => {
                const isActive = selectedDayIndex === idx;
                const countDocs = INITIAL_DOCTORS.filter((d) => {
                  const s = d.schedule.find((slot) => slot.day === item.day);
                  return s && s.avail;
                }).length;

                return (
                  <button
                    key={item.day}
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`px-space-lg py-space-sm rounded-2xl font-label-md text-label-md font-semibold shadow-sm flex flex-col items-center min-w-[108px] transition-all cursor-pointer ${
                      isActive
                        ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105 ring-2 ring-primary"
                        : "bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/30"
                    }`}
                  >
                    <span
                      className={`font-label-sm text-xs ${
                        isActive ? "text-primary-fixed" : "text-on-surface-variant"
                      }`}
                    >
                      {item.tag}
                    </span>
                    <span className="text-base font-bold">{item.label}</span>
                    <span
                      className={`text-xs ${
                        isActive ? "text-white/90 font-medium" : "text-secondary font-bold"
                      }`}
                    >
                      {countDocs} Doctors
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Day Availability Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs mb-space-lg p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/30">
            <div className="flex items-center gap-space-xs text-body-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px] text-primary">event_available</span>
              <span>
                Showing <strong className="text-on-surface">{availableDoctors.length} verified doctors</strong> available on <strong className="text-primary">{currentDay.label}</strong>
              </span>
            </div>
            <Link
              href="/doctors"
              className="font-label-sm text-primary hover:underline font-semibold flex items-center gap-1 text-xs"
            >
              Open Full Clinical Roster <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>

          {/* Doctor Profiles Grid (Filtered dynamically by selected day) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
            {availableDoctors.length > 0 ? (
              availableDoctors.map((doctor) => {
                const daySchedule = doctor.schedule.find((s) => s.day === currentDay.day);
                const slots = daySchedule?.slots || [];
                const activeSlot = doctorSelectedSlots[doctor.id] || slots[0] || "10:00 AM";
                const weeklyAvailableDays = doctor.schedule
                  .filter((s) => s.avail)
                  .map((s) => s.day)
                  .join(", ");

                return (
                  <article
                    key={doctor.id}
                    className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-outline-variant/30"
                  >
                    <div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-md mb-space-md">
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-surface-container-low shrink-0 border border-outline-variant/30">
                          <img
                            alt={doctor.name}
                            className="w-full h-full object-cover"
                            src={doctor.image}
                          />
                          <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-secondary rounded-full border-2 border-surface-container-lowest"></span>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-space-xs mb-1">
                            <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                              {doctor.name}
                            </h3>
                            <span className="inline-flex items-center gap-0.5 px-space-xs py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-xs font-semibold">
                              <span className="material-symbols-outlined text-[14px]">verified</span>
                              Verified Specialist
                            </span>
                          </div>
                          <p className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                            {doctor.experience} • {doctor.hospital}
                          </p>
                          <div className="flex flex-wrap items-center gap-space-xs mt-space-xs">
                            <span className="px-space-xs py-0.5 rounded bg-surface-container text-primary font-label-sm text-xs font-medium">
                              {doctor.specialty}
                            </span>
                            <span className="flex items-center text-amber-500 font-label-sm text-xs font-bold ml-space-xs">
                              <span className="material-symbols-outlined text-[15px]">star</span>
                              {doctor.rating}
                              <span className="text-on-surface-variant font-normal ml-0.5">
                                ({doctor.reviews})
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Schedule & Slots for Current Selected Day */}
                      <div className="bg-surface-container-low rounded-xl p-space-md mb-space-md border border-outline-variant/30">
                        <div className="flex items-center justify-between mb-space-xs">
                          <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                            Weekly Roster:
                          </span>
                          <span className="font-label-sm text-xs text-primary font-bold">
                            {weeklyAvailableDays}
                          </span>
                        </div>
                        <div className="mt-space-sm">
                          <span className="font-label-sm text-xs text-on-surface font-medium block mb-space-xs">
                            Select Slot for {currentDay.label}:
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-xs">
                            {slots.map((slot) => {
                              const isSlotActive = activeSlot === slot;
                              return (
                                <button
                                  key={slot}
                                  onClick={() =>
                                    setDoctorSelectedSlots((prev) => ({
                                      ...prev,
                                      [doctor.id]: slot,
                                    }))
                                  }
                                  className={`py-space-xs px-space-sm rounded-xl font-label-md text-xs font-semibold shadow-xs flex items-center justify-center gap-space-xs transition-all cursor-pointer font-mono ${
                                    isSlotActive
                                      ? "bg-primary text-white"
                                      : "bg-surface-container-lowest hover:bg-surface-container text-on-surface border border-outline-variant/40"
                                  }`}
                                >
                                  {isSlotActive && (
                                    <span className="material-symbols-outlined text-[16px]">
                                      check_circle
                                    </span>
                                  )}
                                  {slot}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-space-xs flex items-center justify-between gap-space-sm border-t border-outline-variant/30">
                      <div>
                        <div className="flex items-baseline gap-space-xs">
                          <span className="font-headline-md text-headline-md text-on-surface font-bold font-mono">
                            ₹{doctor.consultFee}
                          </span>
                          <span className="font-label-sm text-xs text-secondary font-semibold">
                            Online &amp; In-Clinic
                          </span>
                        </div>
                        <span className="font-body-sm text-xs text-on-surface-variant">
                          Includes 7-day free follow-up chat
                        </span>
                      </div>
                      <button
                        onClick={() => handleBookDoctor(doctor)}
                        className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded-xl bg-secondary text-white hover:bg-secondary/90 transition-all font-label-lg text-label-lg font-bold shadow-sm cursor-pointer active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[20px]">payments</span>
                        Pay &amp; Book Slot
                      </button>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="col-span-2 text-center py-12 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
                <span className="material-symbols-outlined text-[48px] text-outline mb-2">event_busy</span>
                <h4 className="font-headline-sm font-bold text-on-surface">No Specialists on this Day</h4>
                <p className="text-body-sm text-on-surface-variant mt-1">Please select another day from the 7-day strip above.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Interactive Vitals & Fast Prescription Refill Banner ── */}
      <section className="w-full px-margin pb-space-xl">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          {/* Vitals Sync Box */}
          <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col justify-between border border-outline-variant/30">
            <div>
              <div className="flex items-center justify-between mb-space-sm">
                <span className="font-label-md text-label-md text-primary font-bold flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[18px]">vital_signs</span>
                  Sync Health Devices
                </span>
                <span className="font-label-sm text-xs px-space-xs py-0.5 bg-secondary-container text-on-secondary-container rounded font-bold">
                  Bluetooth Active
                </span>
              </div>
              <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-xs">
                Automatic Readings
              </h4>
              <p className="font-body-sm text-xs text-on-surface-variant mb-space-md">
                Connect your Omron or Accu-Chek device directly to share clinical vitals instantly with Dr. Sharma.
              </p>
            </div>
            <div className="flex items-center justify-between bg-surface-container-low p-space-sm rounded-xl border border-outline-variant/30">
              <div>
                <span className="text-xs text-on-surface-variant block">Last BP Check (Yesterday)</span>
                <span className="font-headline-sm text-headline-sm font-bold text-on-surface font-mono">
                  118 / 78 <span className="text-xs font-normal text-on-surface-variant font-sans">mmHg</span>
                </span>
              </div>
              <Link
                href="/appointments"
                className="px-space-md py-space-xs rounded-lg bg-surface-container text-primary font-label-sm text-xs font-semibold hover:bg-primary hover:text-white transition-all"
              >
                Pair Device
              </Link>
            </div>
          </div>

          {/* Express Refill Box */}
          <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col justify-between border border-outline-variant/30">
            <div>
              <div className="flex items-center justify-between mb-space-sm">
                <span className="font-label-md text-label-md text-secondary font-bold flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[18px]">prescriptions</span>
                  Quick Refill Rx
                </span>
                <span className="font-label-sm text-xs px-space-xs py-0.5 bg-surface-container-high text-on-surface rounded font-bold">
                  Active Rx
                </span>
              </div>
              <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-xs">
                Telmisartan 40mg + Metformin
              </h4>
              <p className="font-body-sm text-xs text-on-surface-variant mb-space-md">
                Refill your prescribed monthly cycle in 1-tap. Delivered safely with temperature-controlled logistics.
              </p>
            </div>
            <div className="flex items-center justify-between bg-surface-container-low p-space-sm rounded-xl border border-outline-variant/30">
              <div>
                <span className="text-xs text-on-surface-variant block">Remaining Supply</span>
                <span className="font-headline-sm text-headline-sm font-bold text-error">
                  4 Days Left
                </span>
              </div>
              <Link
                href="/pharmacy"
                className="px-space-md py-space-xs rounded-xl bg-secondary text-white font-label-md text-xs font-bold hover:bg-secondary/90 transition-all"
              >
                One-Tap Refill
              </Link>
            </div>
          </div>

          {/* Family Vault Box */}
          <div className="bg-gradient-to-br from-primary to-primary-container p-space-lg rounded-2xl text-on-primary shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-space-sm">
                <span className="font-label-md text-label-md text-tertiary-fixed font-bold flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[18px]">family_restroom</span>
                  Family Health Vault
                </span>
                <span className="font-label-sm text-xs px-space-xs py-0.5 bg-white/20 text-white rounded font-bold">
                  ABHA Linked
                </span>
              </div>
              <h4 className="font-headline-sm text-headline-sm text-white font-bold mb-space-xs">
                Centralized Records for 4 Members
              </h4>
              <p className="font-body-sm text-xs text-white/80 mb-space-md">
                Never lose an ultrasound, blood report, or previous prescription. Secure cloud storage with end-to-end encryption.
              </p>
            </div>
            <Link
              href="/appointments"
              className="w-full py-space-sm bg-surface-container-lowest text-primary font-label-lg text-sm font-bold rounded-xl hover:bg-surface-container-low transition-all text-center block shadow-sm"
            >
              Open Digital Health Vault
            </Link>
          </div>
        </div>
      </section>

      {/* Doctor Booking Modal for Homepage */}
      {bookingModalData && (
        <DoctorBookingModal
          doctor={bookingModalData.doctor}
          day={bookingModalData.day}
          date={bookingModalData.date}
          slot={bookingModalData.slot}
          isOpen={true}
          onClose={() => setBookingModalData(null)}
        />
      )}
    </div>
  );
}
