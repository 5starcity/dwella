// app/my-reservations/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineShieldCheck,
  HiOutlineHomeModern,
  HiOutlineMapPin,
  HiOutlineCalendarDays,
  HiOutlineArrowLeft,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineXCircle,
  HiOutlineBanknotes,
} from "react-icons/hi2";
import { useAuth } from "@/context/AuthContext";
import {
  fetchReservationsByStudent,
  updateReservationStatus,
} from "@/lib/firestoreReservations";
import "@/styles/reserve.css";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp  = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.32 } } };

function StatusBadge({ status }) {
  const map = {
    pending:   { label: "⏳ Pending",   cls: "pending"   },
    confirmed: { label: "✅ Confirmed", cls: "confirmed" },
    declined:  { label: "❌ Declined",  cls: "declined"  },
    cancelled: { label: "🚫 Cancelled", cls: "cancelled" },
  };
  const s = map[status] || map.pending;
  return <span className={"my-reservations__status my-reservations__status--" + s.cls}>{s.label}</span>;
}

export default function MyReservationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState("all");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/login"); return; }
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const data = await fetchReservationsByStudent(user.uid);
        setReservations(data);
      } catch (e) {
        console.error("Failed to load reservations:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  async function handleCancel(id) {
    if (!window.confirm("Cancel this reservation?")) return;
    setCancellingId(id);
    try {
      await updateReservationStatus(id, "cancelled");
      setReservations((prev) => prev.map((r) => r.id === id ? { ...r, status: "cancelled" } : r));
    } catch (e) {
      console.error("Cancel error:", e);
    } finally {
      setCancellingId(null);
    }
  }

  const filtered = reservations.filter((r) => filter === "all" || r.status === filter);

  function formatDate(ts) {
    if (!ts) return "";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
  }

  if (authLoading || loading) {
    return (
      <main className="my-reservations-page">
        <div className="my-reservations-page__loading">
          <span className="reserve-page__spinner" />
        </div>
      </main>
    );
  }

  return (
    <main className="my-reservations-page">
      <motion.div
        className="my-reservations-page__header"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link href="/listings" className="reserve-page__back">
          <HiOutlineArrowLeft /> Back to listings
        </Link>
        <p className="reserve-page__eyebrow"><HiOutlineShieldCheck /> My Reservations</p>
        <h1>Your reserved rooms</h1>
        <p className="reserve-page__sub">Track the status of your room reservations.</p>
      </motion.div>

      {/* Summary */}
      {reservations.length > 0 && (
        <motion.div
          className="my-reservations-page__summary"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          {["all", "pending", "confirmed", "declined", "cancelled"].map((tab) => (
            <button
              key={tab}
              className={"my-reservations-page__tab" + (filter === tab ? " active" : "")}
              onClick={() => setFilter(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span className="my-reservations-page__tab-count">
                {tab === "all" ? reservations.length : reservations.filter((r) => r.status === tab).length}
              </span>
            </button>
          ))}
        </motion.div>
      )}

      {filtered.length === 0 ? (
        <motion.div
          className="my-reservations-page__empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <HiOutlineShieldCheck className="my-reservations-page__empty-icon" />
          <h2>{filter === "all" ? "No reservations yet" : "No " + filter + " reservations"}</h2>
          <p>{filter === "all" ? "Find a property you like and reserve it." : "Check another tab."}</p>
          {filter === "all" && (
            <Link href="/listings" className="reserve-page__btn">Browse Listings</Link>
          )}
        </motion.div>
      ) : (
        <motion.div
          className="my-reservations-page__list"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence>
            {filtered.map((res) => (
              <motion.div
                key={res.id}
                className={"my-reservations-page__card my-reservations-page__card--" + res.status}
                variants={fadeUp}
                exit={{ opacity: 0, x: -16 }}
              >
                <div className="my-reservations-page__card-header">
                  <div className="my-reservations-page__card-icon"><HiOutlineHomeModern /></div>
                  <div className="my-reservations-page__card-title-wrap">
                    <p className="my-reservations-page__card-title">{res.listingTitle}</p>
                    <StatusBadge status={res.status} />
                  </div>
                  <Link
                    href={"/listings/" + res.listingId}
                    className="my-reservations-page__card-link"
                    target="_blank"
                  >
                    <HiOutlineArrowTopRightOnSquare />
                  </Link>
                </div>

                <div className="my-reservations-page__card-details">
                  <div className="my-reservations-page__card-detail">
                    <HiOutlineMapPin />
                    <span>{res.listingLocation || "Port Harcourt"}</span>
                  </div>
                  <div className="my-reservations-page__card-detail">
                    <HiOutlineBanknotes />
                    <span>₦{Number(res.listingPrice || 0).toLocaleString()}/yr</span>
                  </div>
                  <div className="my-reservations-page__card-detail">
                    <HiOutlineCalendarDays />
                    <span>Move-in: {res.moveInDate}</span>
                  </div>
                </div>

                {/* Receipt strip */}
                <div className="my-reservations-page__receipt-strip">
                  <span>Tracking ID: <strong>VLN-{res.id?.slice(0, 8).toUpperCase()}</strong></span>
                  <span>Reserved: {formatDate(res.createdAt)}</span>
                  <span className="my-reservations-page__fee-free">Fee: Free</span>
                </div>

                {res.note && (
                  <p className="my-reservations-page__note">"{res.note}"</p>
                )}

                {res.status === "confirmed" && (
                  <div className="my-reservations-page__confirmed-msg">
                    ✅ Confirmed! Contact the landlord to arrange move-in.
                  </div>
                )}

                {res.status === "pending" && (
                  <div className="my-reservations-page__card-footer">
                    <p className="my-reservations-page__waiting">Waiting for landlord confirmation...</p>
                    <button
                      className="my-reservations-page__cancel-btn"
                      onClick={() => handleCancel(res.id)}
                      disabled={cancellingId === res.id}
                    >
                      <HiOutlineXCircle />
                      {cancellingId === res.id ? "Cancelling..." : "Cancel"}
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </main>
  );
}