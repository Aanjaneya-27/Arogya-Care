export interface Product {
  id: string;
  name: string;
  tag1: string;
  tag2: string;
  tag2Icon?: string;
  discount: string;
  rating: number;
  reviews: string;
  desc: string;
  price: number;
  mrp: number;
  image: string;
  category: "devices" | "diabetes" | "wellness" | "medicines" | "ayurveda";
  rx: boolean;
  brand: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  mrp: number;
  image: string;
  quantity: number;
  tag1?: string;
  brand?: string;
  category?: string;
}

export interface DoctorSlot {
  day: string; // "Mon", "Tue", etc.
  date: string; // "24", "25", etc.
  avail: boolean;
  slots: string[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  specialtyCategory: "cardio" | "derma" | "pediatric" | "neuro" | "ortho" | "diabetes";
  degree: string;
  experience: string;
  rating: number;
  reviews: string;
  hospital: string;
  consultFee: number;
  image: string;
  mode: "video" | "in-clinic" | "both";
  registrationNo: string;
  bio: string;
  schedule: DoctorSlot[];
}

export interface Appointment {
  id: string;
  refId: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  hospital: string;
  day: string;
  date: string;
  slot: string;
  fee: number;
  mode: "video" | "in-clinic";
  status: "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export interface Transaction {
  id: string;
  refId: string;
  title: string;
  description: string;
  amount: number;
  type: "credit" | "debit";
  timestamp: string;
  status: "success" | "pending" | "failed";
}

export interface ToastMessage {
  id: string;
  type: "success" | "info" | "warning" | "error";
  title: string;
  message?: string;
}
