"use client";

import { create } from "zustand";
import { Appointment, Transaction } from "@/types";
import { INITIAL_APPOINTMENTS, INITIAL_TRANSACTIONS } from "@/data/mockData";

interface BookAppointmentParams {
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  hospital: string;
  day: string;
  date: string;
  slot: string;
  fee: number;
  mode?: "video" | "in-clinic";
  paymentMethod?: "wallet" | "gateway";
}

interface HealthStore {
  walletBalance: number;
  transactions: Transaction[];
  appointments: Appointment[];

  // Actions
  bookAppointment: (params: BookAppointmentParams) => {
    success: boolean;
    refId?: string;
    error?: string;
  };
  addMoneyToWallet: (amount: number, method?: string) => { success: boolean; refId: string };
  payWithWallet: (amount: number, title: string, description: string) => {
    success: boolean;
    refId?: string;
    error?: string;
  };
  cancelAppointment: (appointmentId: string) => { success: boolean; refunded?: boolean };
}

export const useHealthStore = create<HealthStore>((set, get) => ({
  walletBalance: 4250,
  appointments: INITIAL_APPOINTMENTS,
  transactions: INITIAL_TRANSACTIONS,

  bookAppointment: (params) => {
    const { walletBalance, appointments, transactions } = get();
    const fee = params.fee;
    const paymentMethod = params.paymentMethod || "wallet";

    if (paymentMethod === "wallet" && walletBalance < fee) {
      return {
        success: false,
        error: `Insufficient wallet balance (₹${walletBalance.toLocaleString(
          "en-IN"
        )}). Please top up or choose an alternative payment method.`,
      };
    }

    const refNumber = Math.floor(1000 + Math.random() * 9000);
    const refId = `#AC-${refNumber}-TX`;
    const newAppointmentId = `apt-${Date.now()}`;

    const newAppointment: Appointment = {
      id: newAppointmentId,
      refId,
      doctorId: params.doctorId,
      doctorName: params.doctorName,
      doctorSpecialty: params.doctorSpecialty,
      doctorImage: params.doctorImage,
      hospital: params.hospital,
      day: params.day,
      date: params.date,
      slot: params.slot,
      fee,
      mode: params.mode || "video",
      status: "confirmed",
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    const newTxn: Transaction = {
      id: `txn-${Date.now()}`,
      refId,
      title: `Consultation Fee · ${params.doctorName}`,
      description: `${params.doctorSpecialty} (${newAppointment.mode === "video" ? "HD Video Room" : "In-Clinic"})`,
      amount: fee,
      type: "debit",
      timestamp: `${new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })} · ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
      status: "success",
    };

    set({
      walletBalance: paymentMethod === "wallet" ? walletBalance - fee : walletBalance,
      appointments: [newAppointment, ...appointments],
      transactions: [newTxn, ...transactions],
    });

    return { success: true, refId };
  },

  addMoneyToWallet: (amount, method = "UPI Instant Desk") => {
    const { walletBalance, transactions } = get();
    const refId = `#TXN-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const newTxn: Transaction = {
      id: `txn-${Date.now()}`,
      refId,
      title: `Added via ${method}`,
      description: "Top-up to Digital Care Wallet",
      amount,
      type: "credit",
      timestamp: `${new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })} · ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
      status: "success",
    };

    set({
      walletBalance: walletBalance + amount,
      transactions: [newTxn, ...transactions],
    });

    return { success: true, refId };
  },

  payWithWallet: (amount, title, description) => {
    const { walletBalance, transactions } = get();
    if (walletBalance < amount) {
      return {
        success: false,
        error: `Insufficient balance (₹${walletBalance.toLocaleString("en-IN")}). Total required is ₹${amount.toLocaleString("en-IN")}.`,
      };
    }

    const refId = `#TXN-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const newTxn: Transaction = {
      id: `txn-${Date.now()}`,
      refId,
      title,
      description,
      amount,
      type: "debit",
      timestamp: `${new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })} · ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
      status: "success",
    };

    set({
      walletBalance: walletBalance - amount,
      transactions: [newTxn, ...transactions],
    });

    return { success: true, refId };
  },

  cancelAppointment: (appointmentId) => {
    const { appointments, walletBalance, transactions } = get();
    const apt = appointments.find((a) => a.id === appointmentId);
    if (!apt) return { success: false };

    // If appointment was confirmed, issue instant refund back to Care Wallet
    let updatedBalance = walletBalance;
    const newTransactions = [...transactions];

    if (apt.status === "confirmed") {
      updatedBalance += apt.fee;
      newTransactions.unshift({
        id: `txn-${Date.now()}`,
        refId: `#REF-${Math.floor(1000000 + Math.random() * 9000000)}`,
        title: `Refund · ${apt.doctorName}`,
        description: `Consultation Cancellation Refund for ${apt.refId}`,
        amount: apt.fee,
        type: "credit",
        timestamp: `${new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })} · ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
        status: "success",
      });
    }

    const updatedAppointments = appointments.map((a) =>
      a.id === appointmentId ? { ...a, status: "cancelled" as const } : a
    );

    set({
      appointments: updatedAppointments,
      walletBalance: updatedBalance,
      transactions: newTransactions,
    });

    return { success: true, refunded: apt.status === "confirmed" };
  },
}));
