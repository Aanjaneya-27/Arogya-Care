"use client";

import { useState, useRef, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useHealthStore } from "@/store/useHealthStore";
import { useToastStore } from "@/store/useToastStore";
import { INITIAL_PRODUCTS, INITIAL_DOCTORS } from "@/data/mockData";
import { Product, Doctor } from "@/types";
import DoctorBookingModal from "@/components/DoctorBookingModal";

interface ChatActionProduct {
  type: "product";
  product: Product;
}

interface ChatActionDoctor {
  type: "doctor";
  doctor: Doctor;
  day: string;
  date: string;
  slot: string;
}

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  actionProduct?: ChatActionProduct;
  actionDoctor?: ChatActionDoctor;
  highlightBundle?: {
    item: string;
    doctor: string;
    price: string;
    savings: string;
  };
}

export default function AIChatbotWidget() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { addToCart, toggleCart } = useCartStore();
  const { addToast } = useToastStore();

  // Booking modal state for doctor action
  const [modalDoctor, setModalDoctor] = useState<{
    doctor: Doctor;
    day: string;
    date: string;
    slot: string;
  } | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Hello Aanjaneya! I am MediBot, your clinical health intelligence companion. How can I assist your medication orders, health monitoring, or specialist consults today?",
    },
    {
      id: "2",
      sender: "user",
      text: "Suggest a reliable BP monitor and check Dr. Sharma's availability.",
    },
    {
      id: "3",
      sender: "bot",
      text: "Based on your clinical telemetry profile, the Omron HEM-7121 with Intellisense cuff is the gold standard. Dr. Rajesh Sharma has an open cardiology slot this Wednesday at 10:00 AM.",
      actionProduct: {
        type: "product",
        product: INITIAL_PRODUCTS[0],
      },
      actionDoctor: {
        type: "doctor",
        doctor: INITIAL_DOCTORS[0],
        day: "Wed",
        date: "26",
        slot: "10:00 AM",
      },
      highlightBundle: {
        item: "Omron HEM-7121",
        doctor: "Dr. Sharma",
        price: "₹3,099",
        savings: "Save ₹500",
      },
    },
  ]);

  useEffect(() => {
    const handleTrigger = () => {
      setIsOpen(true);
      setIsMinimized(false);
    };
    window.addEventListener("open-medibot", handleTrigger);
    return () => window.removeEventListener("open-medibot", handleTrigger);
  }, []);

  useEffect(() => {
    if (!isMinimized && isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isMinimized, isOpen]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");

    setTimeout(() => {
      const lower = text.toLowerCase();
      let botResponse = `I have analyzed "${text}". Here is the recommended clinical guidance and verified available specialist.`;
      let actionProduct: ChatActionProduct | undefined;
      let actionDoctor: ChatActionDoctor | undefined;
      let highlightBundle = undefined;

      if (lower.includes("bp") || lower.includes("blood pressure") || lower.includes("monitor")) {
        botResponse =
          "The Omron HEM-7121 is clinically validated by the European Society of Hypertension with automatic irregular heartbeat alerts.";
        actionProduct = {
          type: "product",
          product: INITIAL_PRODUCTS[0],
        };
      } else if (lower.includes("sharma") || lower.includes("cardio") || lower.includes("heart")) {
        botResponse =
          "Dr. Rajesh Sharma, MD (AIIMS Alumnus, 16+ yrs exp) has verified slots available for tele-consultation.";
        actionDoctor = {
          type: "doctor",
          doctor: INITIAL_DOCTORS[0],
          day: "Wed",
          date: "26",
          slot: "10:00 AM",
        };
      } else if (lower.includes("sugar") || lower.includes("diabetes") || lower.includes("glucometer")) {
        botResponse =
          "Accu-Chek Instant provides ISO-compliant blood glucose measurements in under 4 seconds with no coding required.";
        actionProduct = {
          type: "product",
          product: INITIAL_PRODUCTS[1],
        };
        actionDoctor = {
          type: "doctor",
          doctor: INITIAL_DOCTORS[4], // Dr Sneha Kulkarni Diabetologist
          day: "Mon",
          date: "24",
          slot: "10:00 AM",
        };
      } else if (lower.includes("skin") || lower.includes("derma") || lower.includes("nair")) {
        botResponse =
          "Dr. Priya Nair, MS (Apollo Hospitals, 9+ yrs exp) specializes in clinical dermatology and pediatric skin health.";
        actionDoctor = {
          type: "doctor",
          doctor: INITIAL_DOCTORS[1],
          day: "Tue",
          date: "25",
          slot: "11:00 AM",
        };
      } else if (lower.includes("reserve both") || lower.includes("bundle")) {
        botResponse =
          "Added Omron HEM-7121 to your cart and prepared Dr. Sharma’s Wednesday 10:00 AM appointment slot for checkout.";
        addToCart(INITIAL_PRODUCTS[0]);
        actionDoctor = {
          type: "doctor",
          doctor: INITIAL_DOCTORS[0],
          day: "Wed",
          date: "26",
          slot: "10:00 AM",
        };
      } else {
        botResponse =
          "I have cataloged your query against 1,200+ clinical protocols. You can explore certified devices below or book a verified doctor consultation.";
        actionProduct = {
          type: "product",
          product: INITIAL_PRODUCTS[3], // multivitamin
        };
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: botResponse,
          actionProduct,
          actionDoctor,
          highlightBundle,
        },
      ]);
    }, 600);
  };

  const handleClear = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: "bot",
        text: "Conversation refreshed. Ask about symptoms, certified vital monitors, or specialist schedules.",
      },
    ]);
  };

  const handleProductAddToCart = (product: Product) => {
    addToCart(product);
    addToast({
      type: "success",
      title: "Added to Cart from MediBot",
      message: `${product.name} (₹${product.price}) added to cart.`,
    });
  };

  const handleBookDoctorAction = (docAction: ChatActionDoctor) => {
    setModalDoctor({
      doctor: docAction.doctor,
      day: docAction.day,
      date: docAction.date,
      slot: docAction.slot,
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className="fixed bottom-6 right-8 z-40 flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-semibold shadow-2xl hover:scale-105 transition-all cursor-pointer border border-white/20"
        style={{
          boxShadow: "0 20px 45px -10px rgba(10, 116, 218, 0.4)",
        }}
        aria-label="Open MediBot Assistant"
      >
        <span className="material-symbols-outlined text-[20px] text-tertiary-fixed">
          auto_awesome
        </span>
        <span>MediBot Assistant</span>
        <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
      </button>
    );
  }

  return (
    <>
      <aside
        className="fixed bottom-6 right-8 z-40 w-full max-w-[400px] bg-surface-container-lowest rounded-3xl shadow-2xl transition-all duration-300 border border-outline-variant/40 overflow-hidden"
        id="medibot-widget"
        style={{
          boxShadow:
            "0 20px 45px -10px rgba(10, 116, 218, 0.25), 0 8px 16px -4px rgba(15, 23, 42, 0.12)",
        }}
      >
        {/* Widget Header */}
        <div className="bg-gradient-to-r from-primary to-primary-container p-4 text-on-primary flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px] text-tertiary-fixed">
                auto_awesome
              </span>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary border border-surface-container-lowest animate-pulse"></span>
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-label-lg text-label-lg font-bold leading-tight text-white">
                  MediBot AI Assistant
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20 font-mono font-bold">
                  v2.4
                </span>
              </div>
              <span className="font-label-sm text-xs text-tertiary-fixed leading-tight">
                Online • Clinical Triage Companion
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              onClick={() => setIsMinimized(!isMinimized)}
              title={isMinimized ? "Expand Assistant" : "Minimize Assistant"}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isMinimized ? "expand_less" : "remove"}
              </span>
            </button>
            <button
              className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              onClick={handleClear}
              title="Clear Conversation"
            >
              <span className="material-symbols-outlined text-[20px]">refresh</span>
            </button>
            <button
              className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              onClick={() => setIsOpen(false)}
              title="Close Assistant"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Collapsible Chat Body */}
        {!isMinimized && (
          <div className="flex flex-col" id="medibot-body">
            {/* Chat Stream */}
            <div
              className="p-4 max-h-[360px] overflow-y-auto space-y-3 bg-surface-container-low/40"
              id="medibot-messages"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-start gap-2 ${m.sender === "user" ? "justify-end" : ""}`}
                >
                  {m.sender === "bot" && (
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <span className="material-symbols-outlined text-[14px] text-primary">
                        smart_toy
                      </span>
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-2xl font-body-sm text-body-sm shadow-sm max-w-[88%] space-y-2 ${
                      m.sender === "user"
                        ? "bg-primary text-on-primary rounded-tr-none text-right"
                        : "bg-surface-container-lowest text-on-surface rounded-tl-none text-left border border-outline-variant/30"
                    }`}
                  >
                    <p className="leading-relaxed">{m.text}</p>

                    {/* Mini Interactive Product Card */}
                    {m.actionProduct && (
                      <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 flex items-center justify-between gap-3 text-left">
                        <div className="w-12 h-12 rounded-lg bg-white p-1 shrink-0 flex items-center justify-center border border-outline-variant/30">
                          <img
                            src={m.actionProduct.product.image}
                            alt={m.actionProduct.product.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-label-sm text-xs font-bold text-on-surface truncate">
                            {m.actionProduct.product.name}
                          </h5>
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-mono font-bold text-primary text-xs">
                              ₹{m.actionProduct.product.price}
                            </span>
                            <span className="text-[10px] text-outline line-through">
                              ₹{m.actionProduct.product.mrp}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleProductAddToCart(m.actionProduct!.product)}
                          className="px-2.5 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-white font-label-sm text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer shrink-0"
                        >
                          <span className="material-symbols-outlined text-[13px]">add_shopping_cart</span>
                          <span>Add</span>
                        </button>
                      </div>
                    )}

                    {/* Actionable Doctor Booking Button */}
                    {m.actionDoctor && (
                      <div className="p-2.5 rounded-xl bg-secondary-container/20 border border-secondary-container/50 space-y-2 text-left">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0">
                            <img
                              src={m.actionDoctor.doctor.image}
                              alt={m.actionDoctor.doctor.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="font-label-sm text-xs font-bold text-on-surface truncate">
                              {m.actionDoctor.doctor.name}
                            </div>
                            <div className="text-[11px] text-secondary font-medium">
                              Fee: ₹{m.actionDoctor.doctor.consultFee} • HD Video
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleBookDoctorAction(m.actionDoctor!)}
                          className="w-full py-1.5 px-3 rounded-lg bg-secondary hover:bg-secondary/90 text-white font-label-sm text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[15px]">event_available</span>
                          <span>
                            Book {m.actionDoctor.day} {m.actionDoctor.slot} Slot
                          </span>
                        </button>
                      </div>
                    )}

                    {m.highlightBundle && (
                      <div className="p-2 bg-surface-container-low rounded-xl flex items-center justify-between text-xs">
                        <span className="text-on-surface-variant font-medium">Combined Bundle:</span>
                        <span className="text-primary font-bold">
                          {m.highlightBundle.price} ({m.highlightBundle.savings})
                        </span>
                      </div>
                    )}
                  </div>

                  {m.sender === "user" && (
                    <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center shrink-0 mt-1">
                      <span className="material-symbols-outlined text-[14px] text-on-surface-variant">
                        person
                      </span>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Interactive Prompt Suggestions */}
            <div className="px-3 py-2 bg-surface-container-lowest flex flex-wrap gap-1.5 border-t border-outline-variant/30">
              <button
                className="px-2.5 py-1 rounded-full bg-surface-container text-primary font-label-sm text-xs font-semibold hover:bg-surface-container-high transition-all cursor-pointer flex items-center gap-1"
                onClick={() => handleSend("Recommend a BP Monitor")}
              >
                <span className="material-symbols-outlined text-[13px]">monitor_heart</span>
                Recommend a BP Monitor
              </button>
              <button
                className="px-2.5 py-1 rounded-full bg-surface-container text-primary font-label-sm text-xs font-semibold hover:bg-surface-container-high transition-all cursor-pointer flex items-center gap-1"
                onClick={() => handleSend("Book Dr. Sharma")}
              >
                <span className="material-symbols-outlined text-[13px]">calendar_add_on</span>
                Book Dr. Sharma
              </button>
              <button
                className="px-2.5 py-1 rounded-full bg-secondary-container/50 text-on-secondary-container font-label-sm text-xs font-bold hover:opacity-90 transition-all flex items-center gap-1 cursor-pointer"
                onClick={() => handleSend("Reserve Both for ₹3,099")}
              >
                <span className="material-symbols-outlined text-[13px]">shopping_bag</span>
                Reserve Both (Save ₹500)
              </button>
              <button
                className="px-2.5 py-1 rounded-full bg-surface-container text-primary font-label-sm text-xs font-semibold hover:bg-surface-container-high transition-all cursor-pointer"
                onClick={() => handleSend("Check Blood Sugar")}
              >
                Check Blood Sugar
              </button>
            </div>

            {/* Chat Input Field */}
            <div className="p-3 bg-surface-container-lowest border-t border-outline-variant/20">
              <form
                className="flex items-center gap-2 bg-surface-container-low rounded-xl p-1.5 border border-outline-variant/40"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
              >
                <input
                  className="flex-1 bg-transparent border-none outline-none font-body-sm text-body-sm text-on-surface px-2 placeholder:text-outline"
                  id="medibot-user-text"
                  placeholder="Ask symptoms, doctors, or medicines..."
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button
                  className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-container transition-colors cursor-pointer shrink-0"
                  type="submit"
                  aria-label="Send message"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </aside>

      {/* Doctor Booking Modal when triggered from MediBot */}
      {modalDoctor && (
        <DoctorBookingModal
          doctor={modalDoctor.doctor}
          day={modalDoctor.day}
          date={modalDoctor.date}
          slot={modalDoctor.slot}
          isOpen={true}
          onClose={() => setModalDoctor(null)}
        />
      )}
    </>
  );
}
