"use client";

import { useState } from "react";
import Link from "next/link";
import { Doctor } from "@/types";
import { useHealthStore } from "@/store/useHealthStore";
import { useToastStore } from "@/store/useToastStore";

interface DoctorBookingModalProps {
  doctor: Doctor;
  day: string;
  date: string;
  slot: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (refId: string) => void;
}

export default function DoctorBookingModal({
  doctor,
  day,
  date,
  slot,
  isOpen,
  onClose,
  onSuccess,
}: DoctorBookingModalProps) {
  const { walletBalance, bookAppointment, addMoneyToWallet } = useHealthStore();
  const { addToast } = useToastStore();

  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "gateway">("wallet");
  const [isProcessing, setIsProcessing] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("1000");
  const [showTopUp, setShowTopUp] = useState(false);
  const [confirmedRef, setConfirmedRef] = useState<string | null>(null);

  if (!isOpen) return null;

  const fee = doctor.consultFee;
  const isWalletSufficient = walletBalance >= fee;

  const handleConfirm = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const result = bookAppointment({
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        doctorImage: doctor.image,
        hospital: doctor.hospital,
        day,
        date: `Oct ${date}, 2026`,
        slot,
        fee,
        mode: doctor.mode === "in-clinic" ? "in-clinic" : "video",
        paymentMethod,
      });

      setIsProcessing(false);

      if (result.success && result.refId) {
        setConfirmedRef(result.refId);
        addToast({
          type: "success",
          title: "Appointment Confirmed!",
          message: `Scheduled with ${doctor.name} on ${day} ${slot}. Ref: ${result.refId}`,
        });
        if (onSuccess) onSuccess(result.refId);
      } else {
        addToast({
          type: "error",
          title: "Booking Failed",
          message: result.error || "Unable to reserve slot.",
        });
      }
    }, 900);
  };

  const handleInstantTopUp = () => {
    const val = parseInt(topUpAmount, 10);
    if (!isNaN(val) && val > 0) {
      addMoneyToWallet(val, "Instant UPI Desk");
      addToast({
        type: "success",
        title: "Wallet Recharged",
        message: `₹${val.toLocaleString("en-IN")} credited to your Care Wallet.`,
      });
      setShowTopUp(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={() => {
          if (!isProcessing) onClose();
        }}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-lg rounded-3xl bg-surface-container-lowest p-space-lg shadow-2xl border border-outline-variant/30 text-on-surface animate-in zoom-in-95 duration-200"
          id="doctor-booking-modal"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          {confirmedRef ? (
            /* Success confirmation screen */
            <div className="text-center space-y-space-md py-4">
              <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mx-auto shadow-md">
                <span className="material-symbols-outlined text-[36px]">check_circle</span>
              </div>
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary font-label-sm text-label-sm font-bold uppercase">
                  Confirmed &amp; Tele-Link Active
                </span>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                  Consultation Reserved!
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Your appointment with <strong className="text-on-surface">{doctor.name}</strong> has been secured and logged in your digital health ledger.
                </p>
              </div>

              {/* Summary card */}
              <div className="p-space-md rounded-2xl bg-surface-container-low text-left space-y-2 text-body-sm font-body-sm">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Specialist:</span>
                  <span className="font-semibold text-on-surface">{doctor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Date &amp; Time:</span>
                  <span className="font-semibold text-primary">{day}, Oct {date} • {slot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Consultation Fee:</span>
                  <span className="font-bold text-on-surface">₹{fee} (Deducted from Wallet)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Reference ID:</span>
                  <span className="font-mono font-bold text-on-surface">{confirmedRef}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <Link
                  href="/appointments"
                  onClick={onClose}
                  className="flex-1 h-11 rounded-xl bg-primary text-white font-label-md text-label-md font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                  <span>View in My Appointments</span>
                </Link>
                <button
                  onClick={onClose}
                  className="px-5 h-11 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Booking confirmation form */
            <div className="space-y-space-md">
              <div className="flex items-start gap-space-sm pr-8">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-surface-container shadow-sm">
                  <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1">
                    <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      {doctor.name}
                    </h3>
                    <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                  </div>
                  <p className="font-label-md text-label-md text-primary font-medium">
                    {doctor.specialty}
                  </p>
                  <p className="font-body-sm text-[12px] text-on-surface-variant">
                    {doctor.hospital}
                  </p>
                </div>
              </div>

              {/* Slot pill info */}
              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/40 space-y-2">
                <span className="font-label-sm text-label-sm font-semibold uppercase text-on-surface-variant tracking-wider">
                  Appointment Schedule
                </span>
                <div className="flex items-center justify-between text-body-sm font-body-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">calendar_today</span>
                    <span className="font-bold text-on-surface">{day}, Oct {date}, 2026</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary-container text-white font-bold font-mono text-xs">
                    <span className="material-symbols-outlined text-[15px]">schedule</span>
                    <span>{slot}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant pt-1 border-t border-outline-variant/30">
                  <span className="material-symbols-outlined text-secondary text-[16px]">videocam</span>
                  <span>End-to-End Encrypted Telehealth Room • 7-Day Free Follow-up Chat</span>
                </div>
              </div>

              {/* Fee & Payment Method */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/40 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="font-label-md text-label-md font-bold text-on-surface">
                    Consultation Fee
                  </span>
                  <span className="font-headline-md text-headline-md font-bold text-primary font-mono">
                    ₹{fee}
                  </span>
                </div>

                {/* Wallet Balance Banner */}
                <div
                  className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                    isWalletSufficient
                      ? "bg-secondary-container/20 border-secondary-container/60 text-on-surface"
                      : "bg-error-container/20 border-error-container/60 text-error"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                    <div>
                      <div className="font-label-sm text-xs font-bold">
                        Arogya Care Wallet Balance
                      </div>
                      <div className="font-mono text-xs text-on-surface-variant">
                        ₹{walletBalance.toLocaleString("en-IN")}.00 available
                      </div>
                    </div>
                  </div>

                  {!isWalletSufficient && (
                    <button
                      onClick={() => setShowTopUp(!showTopUp)}
                      className="px-2.5 py-1 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-container transition-colors cursor-pointer"
                    >
                      + Top Up
                    </button>
                  )}
                </div>

                {/* Top Up inline field if opened */}
                {showTopUp && (
                  <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant space-y-2">
                    <label className="font-label-sm text-xs text-on-surface font-semibold">
                      Add Money to Wallet (Instant UPI)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(e.target.value)}
                        className="flex-1 bg-surface-container-low rounded-lg px-3 py-1.5 text-xs font-mono outline-none border border-outline-variant"
                        placeholder="Amount"
                      />
                      <button
                        onClick={handleInstantTopUp}
                        className="px-3 py-1.5 rounded-lg bg-secondary text-white text-xs font-bold cursor-pointer"
                      >
                        Recharge
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Confirmation Buttons */}
              <div className="space-y-2 pt-1">
                {isWalletSufficient ? (
                  <button
                    disabled={isProcessing}
                    onClick={handleConfirm}
                    className="w-full h-12 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[20px]">lock</span>
                        <span>Confirm &amp; Deduct ₹{fee} from Wallet</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setPaymentMethod("gateway");
                        handleConfirm();
                      }}
                      className="w-full h-12 rounded-xl bg-primary hover:bg-primary-container text-white font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-[0.98]"
                    >
                      <span className="material-symbols-outlined text-[20px]">credit_card</span>
                      <span>Pay ₹{fee} via Card / UPI Gateway</span>
                    </button>
                    <p className="text-[11px] text-center text-outline">
                      Insufficient wallet balance. You can pay via alternative gateway or recharge above.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
