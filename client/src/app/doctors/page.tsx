"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { INITIAL_DOCTORS } from "@/data/mockData";
import { Doctor } from "@/types";
import { useHealthStore } from "@/store/useHealthStore";
import DoctorBookingModal from "@/components/DoctorBookingModal";

const DAYS = [
  { day: "Mon", date: "24", tag: "TODAY", label: "Monday", fullDate: "Mon, 24 Oct" },
  { day: "Tue", date: "25", tag: "TOMORROW", label: "Tuesday", fullDate: "Tue, 25 Oct" },
  { day: "Wed", date: "26", tag: "DAY 3", label: "Wednesday", fullDate: "Wed, 26 Oct" },
  { day: "Thu", date: "27", tag: "DAY 4", label: "Thursday", fullDate: "Thu, 27 Oct" },
  { day: "Fri", date: "28", tag: "DAY 5", label: "Friday", fullDate: "Fri, 28 Oct" },
  { day: "Sat", date: "29", tag: "WEEKEND", label: "Saturday", fullDate: "Sat, 29 Oct" },
  { day: "Sun", date: "30", tag: "WEEKEND", label: "Sunday", fullDate: "Sun, 30 Oct" },
];

function DoctorsContent() {
  const searchParams = useSearchParams();
  const preselectedDocId = searchParams.get("doc");

  // Dynamic 7-day selection state
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [filterOnlyAvailableOnDay, setFilterOnlyAvailableOnDay] = useState(true);

  const [activeSpecialty, setActiveSpecialty] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("earliest");

  const currentDayObj = DAYS[selectedDayIndex];
  const currentDay = currentDayObj.day;

  // Per-doctor selected slot state
  const [selectedSlotMap, setSelectedSlotMap] = useState<Record<string, string>>({});

  // Modal State
  const [activeModalData, setActiveModalData] = useState<{
    doctor: Doctor;
    day: string;
    date: string;
    slot: string;
  } | null>(null);

  const { appointments, walletBalance } = useHealthStore();
  const latestAppointment = appointments[0];

  const handleSelectSlot = (doctorId: string, slot: string) => {
    setSelectedSlotMap((prev) => ({ ...prev, [doctorId]: slot }));
  };

  const handleOpenBooking = (doctor: Doctor) => {
    const dayObj = doctor.schedule.find((s) => s.day === currentDay) || doctor.schedule[0];
    const slot =
      selectedSlotMap[doctor.id] ||
      (dayObj && dayObj.slots.length > 0 ? dayObj.slots[0] : "10:00 AM");

    setActiveModalData({
      doctor,
      day: currentDay,
      date: currentDayObj.date,
      slot,
    });
  };

  const filteredDoctors = useMemo(() => {
    return INITIAL_DOCTORS.filter((doc) => {
      if (preselectedDocId && doc.id === preselectedDocId) {
        return true;
      }

      // Filter by selected day if enabled
      if (filterOnlyAvailableOnDay) {
        const scheduleForDay = doc.schedule.find((s) => s.day === currentDay);
        if (!scheduleForDay || !scheduleForDay.avail) {
          return false;
        }
      }

      if (activeSpecialty !== "all" && doc.specialtyCategory !== activeSpecialty) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = doc.name.toLowerCase().includes(q);
        const matchesSpec = doc.specialty.toLowerCase().includes(q);
        const matchesHosp = doc.hospital.toLowerCase().includes(q);
        const matchesBio = doc.bio.toLowerCase().includes(q);
        if (!matchesName && !matchesSpec && !matchesHosp && !matchesBio) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "fee-low") return a.consultFee - b.consultFee;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // earliest / default
    });
  }, [activeSpecialty, searchQuery, sortBy, preselectedDocId, filterOnlyAvailableOnDay, currentDay]);

  const openSymptomChecker = () => {
    window.dispatchEvent(new CustomEvent("open-medibot"));
  };

  return (
    <div className="flex flex-col w-full pb-20">
      {/* ── Top Breadcrumb & Trust Banner Section ── */}
      <section className="w-full px-margin py-space-md bg-surface-container-low/60 border-b border-outline-variant/30">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-space-sm">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant"
          >
            <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
              <span className="material-symbols-outlined text-[16px]">home</span>
              Home
            </Link>
            <span className="material-symbols-outlined text-[16px] text-outline">chevron_right</span>
            <span className="text-primary font-semibold">Doctor Consultation</span>
            <span className="material-symbols-outlined text-[16px] text-outline">chevron_right</span>
            <span className="text-on-surface font-medium">Verified Specialists</span>
          </nav>
          <div className="flex flex-wrap items-center gap-space-sm">
            <div className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-surface-container-lowest shadow-sm text-secondary font-label-sm text-label-sm font-semibold border border-outline-variant/30">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              100% Verified NMC Registered Clinicians
            </div>
            <div className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-surface-container-lowest shadow-sm text-primary font-label-sm text-label-sm font-semibold border border-outline-variant/30">
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              Avg. Connect in 10 Mins
            </div>
            <div className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-surface-container-lowest shadow-sm text-tertiary font-label-sm text-label-sm font-semibold border border-outline-variant/30">
              <span className="material-symbols-outlined text-[16px]">chat_bubble_outline</span>
              7-Day Free Follow-up
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Work Area ── */}
      <div className="w-full px-margin py-space-lg">
        <div className="max-w-[1440px] mx-auto space-y-space-lg">
          {/* Header Title & Stats Strip */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
            <div>
              <div className="inline-flex items-center gap-space-xs text-primary font-label-lg text-label-lg mb-1 font-semibold">
                <span className="material-symbols-outlined text-[20px]">medical_services</span>
                <span>CLINICAL TELE-HEALTH MATRIX</span>
              </div>
              <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
                Multi-Specialty Doctor Consultations
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-1 max-w-3xl">
                Consult certified specialists available across 7 days with instant slot selection, prescription synchronization, and Care Wallet settlements.
              </p>
            </div>

            {/* Quick Triage Metric Indicator */}
            <div className="flex items-center gap-space-sm p-space-sm bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 self-start lg:self-auto">
              <div className="w-10 h-10 rounded-xl bg-secondary-container/50 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[24px]">videocam</span>
              </div>
              <div>
                <div className="flex items-center gap-space-xs">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                  <span className="font-label-md text-label-md text-secondary font-bold">
                    42 Clinicians Online
                  </span>
                </div>
                <span className="font-body-sm text-xs text-on-surface-variant">
                  HD Video • Care Wallet Active: ₹{walletBalance.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* ── 7-Day Date Selector Strip ── */}
          <div className="p-space-md bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 space-y-space-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs pb-1">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">calendar_month</span>
                <span className="font-headline-sm text-sm uppercase tracking-wider font-bold text-on-surface">
                  Select Consultation Date (Next 7 Days)
                </span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-label-md text-on-surface-variant">
                <input
                  type="checkbox"
                  checked={filterOnlyAvailableOnDay}
                  onChange={(e) => setFilterOnlyAvailableOnDay(e.target.checked)}
                  className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <span>Only show doctors available on selected day</span>
              </label>
            </div>

            {/* Interactive 7-Day Matrix Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-space-xs">
              {DAYS.map((d, idx) => {
                const isSelected = selectedDayIndex === idx;
                const countDocs = INITIAL_DOCTORS.filter((doc) => {
                  const s = doc.schedule.find((slot) => slot.day === d.day);
                  return s && s.avail;
                }).length;

                return (
                  <button
                    key={d.day}
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`flex flex-col items-center py-3 px-2 rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary text-white shadow-md scale-[1.02] ring-2 ring-primary font-bold"
                        : "bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline-variant/40"
                    }`}
                  >
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${isSelected ? "text-primary-fixed" : "text-on-surface-variant"}`}>
                      {d.tag}
                    </span>
                    <span className="text-base font-bold my-0.5">
                      {d.day}, {d.date}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isSelected
                          ? "bg-white/20 text-white font-medium"
                          : "bg-surface-container-lowest text-secondary font-bold"
                      }`}
                    >
                      {countDocs} Doctors
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Day Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-space-xs pt-1 border-t border-outline-variant/20 text-xs text-on-surface-variant">
              <span className="flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                Active Date: <strong className="text-on-surface">{currentDayObj.fullDate}</strong> ({currentDayObj.label})
              </span>
              <span>
                Showing <strong className="text-primary">{filteredDoctors.length} doctors</strong> matching active filters
              </span>
            </div>
          </div>

          {/* Specialty Filter Bar & Search controls */}
          <div className="p-space-md bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 space-y-space-md">
            {/* Horizontal Specialty Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1" id="specialty-pills">
              {[
                { id: "all", label: "All Specialties" },
                { id: "cardio", label: "Cardiologist" },
                { id: "derma", label: "Dermatologist" },
                { id: "diabetes", label: "General Physician & Diabetologist" },
                { id: "pediatric", label: "Pediatrician" },
                { id: "ortho", label: "Orthopedic Surgeon" },
              ].map((spec) => {
                const isActive = activeSpecialty === spec.id;
                return (
                  <button
                    key={spec.id}
                    onClick={() => setActiveSpecialty(spec.id)}
                    className={`px-4 py-2 rounded-xl font-label-md text-sm whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? "bg-primary text-white shadow-sm font-bold"
                        : "bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                    }`}
                  >
                    {spec.label}
                  </button>
                );
              })}
            </div>

            {/* Search & Filter Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-space-sm pt-space-xs">
              <div className="md:col-span-8 lg:col-span-8 relative flex items-center">
                <span className="material-symbols-outlined absolute left-space-md text-on-surface-variant text-[22px]">
                  search
                </span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-11 pr-space-md bg-surface-container-low text-on-surface placeholder:text-outline text-body-md font-body-md rounded-xl focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/30 transition-all border border-outline-variant/40"
                  placeholder="Search by doctor name, medical council ID, hospital or specific symptoms..."
                  type="text"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 text-outline hover:text-on-surface"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                )}
              </div>

              <div className="md:col-span-4 lg:col-span-4">
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-space-md text-on-surface-variant text-[20px]">
                    sort
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full h-11 pl-10 pr-space-md bg-surface-container-low text-on-surface text-body-md font-body-md rounded-xl appearance-none focus:outline-none border border-outline-variant/40 cursor-pointer transition-all"
                  >
                    <option value="earliest">Earliest Available This Week</option>
                    <option value="rating">Top Patient Ratings (4.8+)</option>
                    <option value="fee-low">Consultation Fee: Low to High</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-space-md text-on-surface-variant text-[18px] pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Layout: Doctors Grid + Sticky Booking Preview Sidebar */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter items-start">
            {/* Doctors Schedule Cards List (8 Cols on xl) */}
            <div className="xl:col-span-8 flex flex-col gap-space-lg">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => {
                  const daySchedule = doctor.schedule.find((s) => s.day === currentDay);
                  const isAvailableToday = daySchedule?.avail || false;
                  const slots = daySchedule?.slots || [];
                  const activeSlot = selectedSlotMap[doctor.id] || slots[0] || "10:00 AM";

                  const weeklyAvailableDays = doctor.schedule
                    .filter((s) => s.avail)
                    .map((s) => s.day)
                    .join(", ");

                  const nextAvailableDay = !isAvailableToday
                    ? doctor.schedule.find((s) => s.avail)
                    : null;

                  return (
                    <div
                      key={doctor.id}
                      id={`doc-card-${doctor.id}`}
                      className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm hover:shadow-md transition-all border border-outline-variant/30 space-y-space-md"
                    >
                      {/* Doctor Info Row */}
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-space-md">
                        <div className="flex items-start gap-space-md">
                          <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-sm bg-surface-container border border-outline-variant/40">
                            <img
                              alt={doctor.name}
                              className="w-full h-full object-cover"
                              src={doctor.image}
                            />
                            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-full bg-secondary text-white font-label-sm text-xs font-bold flex items-center gap-0.5 shadow-xs">
                              <span className="material-symbols-outlined text-[12px]">star</span>
                              {doctor.rating}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-space-xs">
                              <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                                {doctor.name}
                              </h3>
                              <span
                                className="material-symbols-outlined text-primary text-[20px]"
                                title={`Verified (${doctor.registrationNo})`}
                              >
                                verified
                              </span>
                            </div>
                            <p className="font-label-lg text-label-lg text-primary font-semibold">
                              {doctor.specialty}
                            </p>
                            <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-2 flex-wrap">
                              <span>{doctor.hospital}</span>
                              <span>•</span>
                              <span className="font-medium text-on-surface">{doctor.experience}</span>
                              <span>•</span>
                              <span className="text-secondary font-medium">{doctor.reviews}</span>
                            </p>
                            <div className="flex flex-wrap items-center gap-space-xs pt-1">
                              <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-md bg-surface-container-low text-primary font-label-sm text-xs">
                                <span className="material-symbols-outlined text-[14px]">videocam</span> Video &amp; Telehealth
                              </span>
                              <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-md bg-secondary-container/40 text-on-secondary-container font-label-sm text-xs font-semibold">
                                <span className="material-symbols-outlined text-[14px]">shield</span> Care Wallet Accepted
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="sm:text-right shrink-0">
                          <span className="font-body-sm text-body-sm text-on-surface-variant">Consultation Fee</span>
                          <div className="font-headline-lg text-headline-lg font-bold text-on-surface font-mono">
                            ₹{doctor.consultFee}
                          </div>
                          <span className="font-label-sm text-xs text-secondary font-semibold">
                            Includes 7-Day Free Chat
                          </span>
                        </div>
                      </div>

                      {/* Doctor Weekly Schedule & Dynamic Slot Selector */}
                      <div className="p-space-md bg-surface-container-low/70 rounded-xl space-y-space-sm border border-outline-variant/30">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <div className="flex items-center gap-space-xs">
                            <span className="material-symbols-outlined text-[18px] text-primary">calendar_month</span>
                            <span className="font-label-md text-label-md text-on-surface font-semibold">
                              Weekly Roster: <span className="text-primary font-bold">{weeklyAvailableDays}</span>
                            </span>
                          </div>
                          <span className="font-label-sm text-xs text-on-surface-variant">
                            IST (UTC+05:30)
                          </span>
                        </div>

                        {/* Slot Time Selector Pills & CTA Row */}
                        <div className="pt-space-xs flex flex-col sm:flex-row sm:items-center justify-between gap-space-md border-t border-outline-variant/30">
                          <div className="flex items-center gap-space-xs flex-wrap">
                            <span className="font-label-sm text-xs text-on-surface-variant mr-1">
                              Open Slots ({currentDayObj.label}, Oct {currentDayObj.date}):
                            </span>

                            {isAvailableToday && slots.length > 0 ? (
                              slots.map((s) => {
                                const isSelected = activeSlot === s;
                                return (
                                  <button
                                    key={s}
                                    onClick={() => handleSelectSlot(doctor.id, s)}
                                    className={`px-3 py-1.5 rounded-lg font-label-md text-xs font-mono transition-all cursor-pointer ${
                                      isSelected
                                        ? "bg-primary text-white font-bold shadow-xs ring-2 ring-primary/40"
                                        : "bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/40"
                                    }`}
                                  >
                                    {s}
                                  </button>
                                );
                              })
                            ) : (
                              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-error-container/20 text-error text-xs font-medium">
                                <span className="material-symbols-outlined text-[16px]">event_busy</span>
                                <span>
                                  Off duty on {currentDayObj.fullDate}
                                  {nextAvailableDay ? ` • Next open: ${nextAvailableDay.day}, Oct ${nextAvailableDay.date}` : ""}
                                </span>
                              </div>
                            )}
                          </div>

                          <button
                            disabled={!isAvailableToday || slots.length === 0}
                            onClick={() => handleOpenBooking(doctor)}
                            className="h-11 px-space-lg rounded-xl bg-secondary hover:bg-secondary/90 text-white font-label-lg text-label-lg flex items-center justify-center gap-space-xs shadow-sm transition-all cursor-pointer font-bold active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="material-symbols-outlined text-[18px]">lock</span>
                            <span>
                              {isAvailableToday
                                ? `Pay ₹${doctor.consultFee} & Book Slot`
                                : "Unavailable on this day"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center text-outline mx-auto">
                    <span className="material-symbols-outlined text-[32px]">event_busy</span>
                  </div>
                  <h3 className="font-headline-md font-bold text-on-surface">No Doctors Found on {currentDayObj.fullDate}</h3>
                  <p className="font-body-md text-on-surface-variant max-w-md mx-auto">
                    No specialists are available with your current filter criteria on this date. Try selecting another date from the 7-day strip or uncheck &ldquo;Only show doctors available on selected day&rdquo;.
                  </p>
                  <button
                    onClick={() => {
                      setFilterOnlyAvailableOnDay(false);
                      setActiveSpecialty("all");
                      setSearchQuery("");
                    }}
                    className="px-4 py-2 bg-primary text-white font-label-md text-sm rounded-xl font-bold shadow-sm hover:bg-primary/90 transition-all cursor-pointer"
                  >
                    Reset Filters &amp; View All Specialists
                  </button>
                </div>
              )}
            </div>

            {/* Right Side: Booking Confirmed & Live Triage Flow (4 Cols on xl) */}
            <div className="xl:col-span-4 space-y-space-lg sticky top-24">
              {/* Active Booked Confirmation Preview Card */}
              {latestAppointment && (
                <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-md space-y-space-md relative overflow-hidden border border-outline-variant/30">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-secondary via-primary to-secondary"></div>
                  <div className="flex items-start gap-space-sm">
                    <div className="w-12 h-12 rounded-2xl bg-secondary-container/60 flex items-center justify-center text-secondary shrink-0">
                      <span className="material-symbols-outlined text-[28px]">check_circle</span>
                    </div>
                    <div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-label-sm text-xs font-bold uppercase tracking-wider">
                        Confirmed &amp; Telehealth Ready
                      </span>
                      <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold mt-1">
                        Active Consultation
                      </h4>
                    </div>
                  </div>

                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Slot reserved successfully with <strong className="text-on-surface">{latestAppointment.doctorName}</strong>. Encrypted video consult link has been synced with your health vault.
                  </p>

                  {/* Appointment Details Pill Container */}
                  <div className="p-space-md bg-surface-container-low rounded-xl space-y-space-xs border border-outline-variant/30">
                    <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant">
                      <span>Specialist:</span>
                      <span className="text-on-surface font-semibold">{latestAppointment.doctorName}</span>
                    </div>
                    <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant">
                      <span>Scheduled Time:</span>
                      <span className="text-primary font-semibold font-mono">
                        {latestAppointment.day}, {latestAppointment.date} • {latestAppointment.slot}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant">
                      <span>Consultation Mode:</span>
                      <span className="text-secondary font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">videocam</span> HD Video Room
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant">
                      <span>Ref ID:</span>
                      <span className="font-label-sm text-xs text-on-surface font-mono font-bold">
                        {latestAppointment.refId}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Link
                      className="w-full h-11 px-space-md rounded-xl bg-primary hover:bg-primary-container text-white font-label-lg text-label-lg flex items-center justify-center gap-space-xs shadow-sm transition-all font-bold"
                      href="/appointments"
                    >
                      <span className="material-symbols-outlined text-[20px]">sensors</span>
                      <span>Manage in Appointments</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Instant Symptom Triage Box */}
              <div className="bg-surface-container-low/80 rounded-2xl p-space-md space-y-space-sm border border-outline-variant/30">
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                  </div>
                  <div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold text-[16px]">
                      Unsure who to consult?
                    </h4>
                    <p className="font-body-sm text-xs text-on-surface-variant">
                      Let Arogya AI analyze your symptoms in 30 seconds.
                    </p>
                  </div>
                </div>
                <button
                  onClick={openSymptomChecker}
                  className="w-full py-2 px-space-md bg-surface-container-lowest hover:bg-surface-container text-primary font-label-md text-sm rounded-xl shadow-xs flex items-center justify-center gap-space-xs transition-all cursor-pointer font-bold border border-outline-variant/30"
                >
                  <span>Launch AI Symptom Checker</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>

              {/* ArogyaCare+ Guarantee Badge Box */}
              <div className="p-space-md bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 space-y-space-xs">
                <h5 className="font-label-md text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                  The ArogyaCare+ Promise
                </h5>
                <div className="flex items-start gap-space-xs pt-1">
                  <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">security</span>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    Full refund if doctor is delayed beyond 15 minutes without prior notice.
                  </p>
                </div>
                <div className="flex items-start gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">receipt_long</span>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    Legally compliant digital prescription accepted at all registered pharmacies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Booking Modal */}
      {activeModalData && (
        <DoctorBookingModal
          doctor={activeModalData.doctor}
          day={activeModalData.day}
          date={activeModalData.date}
          slot={activeModalData.slot}
          isOpen={true}
          onClose={() => setActiveModalData(null)}
        />
      )}
    </div>
  );
}

export default function DoctorsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-outline">Loading Arogya Doctors...</div>}>
      <DoctorsContent />
    </Suspense>
  );
}
