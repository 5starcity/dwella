// app/my-inspections/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineClipboardDocumentCheck,
  HiOutlineCalendarDays,
  HiOutlineClock,
  HiOutlineMapPin,
  HiOutlineHomeModern,
  HiOutlineArrowLeft,
  HiOutlineXCircle,
  HiOutlineArrowTopRightOnSquare,
  HiOutlinePhone,
} from "react-icons/hi2";
import { useAuth } from "@/context/AuthContext";
import { fetchInspectionsByTenant, updateInspectionStatus } from "@/lib/firestoreInspections";
import "@/styles/my-inspections.css";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp  = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.32 } } };

function StatusBadge({ status }) {
  return (
    <span className={"my-inspections__status my-inspections__status--" + status}>
      {status === "pending"   && "⏳ Pending"}
      {status === "confirmed" && "✅ Confirmed"}
      {status === "cancelled" && "❌ Cancelled"}
    </span>
  );
}

export default function MyInspectionsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [inspections, setInspections] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState("all");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/login"); return; }
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const data = await fetchInspectionsByTenant(user.uid);
        setInspections(data);
      } catch (e) {
        console.error("Failed to load inspections:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  async function handleCancel(id) {
    if (!window.confirm("Cancel this inspection request?")) return;
    setCancellingId(id);
    try {
      await updateInspectionStatus(id, "cancelled");
      setInspections((prev) => prev.map((i) => i.id === id ? { ...i, status: "cancelled" } : i));
    } catch (e) {
      console.error("Cancel error:", e);
    } finally {
      setCancellingId(null);
    }
  }

  const filtered = inspections.filter((i) => filter === "all" || i.status === filter);

  const pendingCount   = inspections.filter((i) => i.status === "pending").length;
  const confirmedCount = inspections.filter((i) => i.status === "confirmed").length;

  if (authLoading || loading) {
    return (
      <main className="my-inspections-page">
        <div className="my-inspections-page__loading">
          <span className="my-inspections-page__spinner" />
        </div>
      </main>
    );
  }

  return (
    <main className="my-inspections-page">
      <motion.div className="my-inspections-page__header" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Link href="/listings" className="my-inspections-page__back">
          <HiOutlineArrowLeft /> Back to listings
        </Link>
        <p className="my-inspections-page__eyebrow">
          <HiOutlineClipboardDocumentCheck /> My Inspections
        </p>
        <h1>Your booked inspections</h1>
        <p className="my-inspections-page__sub">Track the status of your property visit requests.</p>
      </motion.div>

      {/* Summary cards */}
      {inspections.length > 0 && (
        <motion.div className="my-inspections-page__summary" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.08 }}>
          <div className="my-inspections-page__summary-card">
            <span className="my-inspections-page__summary-val">{inspections.length}</span>
            <span className="my-inspections-page__summary-label">Total</span>
          </div>
          <div className="my-inspections-page__summary-card my-inspections-page__summary-card--pending">
            <span className="my-inspections-page__summary-val">{pendingCount}</span>
            <span className="my-inspections-page__summary-label">Pending</span>
          </div>
          <div className="my-inspections-page__summary-card my-inspections-page__summary-card--confirmed">
            <span className="my-inspections-page__summary-val">{confirmedCount}</span>
            <span className="my-inspections-page__summary-label">Confirmed</span>
          </div>
        </motion.div>
      )}

      {/* Filter tabs */}
      <motion.div className="my-inspections-page__tabs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}>
        {["all", "pending", "confirmed", "cancelled"].map((tab) => (
          <button
            key={tab}
            className={"my-inspections-page__tab" + (filter === tab ? " active" : "")}
            onClick={() => setFilter(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span className="my-inspections-page__tab-count">
              {tab === "all" ? inspections.length : inspections.filter((i) => i.status === tab).length}
            </span>
          </button>
        ))}
      </motion.div>

      {/* List */}
      {filtered.length === 0 ? (
        <motion.div className="my-inspections-page__empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <HiOutlineClipboardDocumentCheck className="my-inspections-page__empty-icon" />
          <h2>{filter === "all" ? "No inspections yet" : "No " + filter + " inspections"}</h2>
          <p>{filter === "all" ? "Find a property you like and book an inspection." : "Check another tab."}</p>
          {filter === "all" && (
            <Link href="/listings" className="my-inspections-page__browse-btn">Browse Listings</Link>
          )}
        </motion.div>
      ) : (
        <motion.div className="my-inspections-page__list" variants={stagger} initial="hidden" animate="show">
          <AnimatePresence>
            {filtered.map((insp) => (
              <motion.div
                key={insp.id}
                className={"my-inspections-page__card my-inspections-page__card--" + insp.status}
                variants={fadeUp}
                exit={{ opacity: 0, x: -16 }}
              >
                <div className="my-inspections-page__card-header">
                  <div className="my-inspections-page__card-icon">
                    <HiOutlineHomeModern />
                  </div>
                  <div className="my-inspections-page__card-title-wrap">
                    <p className="my-inspections-page__card-title">{insp.listingTitle}</p>
                    <StatusBadge status={insp.status} />
                  </div>
                  <Link
                    href={"/listings/" + insp.listingId}
                    className="my-inspections-page__card-link"
                    title="View listing"
                    target="_blank"
                  >
                    <HiOutlineArrowTopRightOnSquare />
                  </Link>
                </div>

                <div className="my-inspections-page__card-details">
                  <div className="my-inspections-page__card-detail">
                    <HiOutlineCalendarDays />
                    <span>{insp.date}</span>
                  </div>
                  <div className="my-inspections-page__card-detail">
                    <HiOutlineClock />
                    <span>{insp.time}</span>
                  </div>
                  {insp.tenantPhone && (
                    <div className="my-inspections-page__card-detail">
                      <HiOutlinePhone />
                      <span>{insp.tenantPhone}</span>
                    </div>
                  )}
                </div>

                {insp.note && (
                  <p className="my-inspections-page__card-note">"{insp.note}"</p>
                )}

                {insp.status === "confirmed" && (
                  <div className="my-inspections-page__card-confirmed-msg">
                    ✅ The landlord has confirmed your visit. Make sure to be on time!
                  </div>
                )}

                {insp.status === "pending" && (
                  <div className="my-inspections-page__card-footer">
                    <p className="my-inspections-page__card-waiting">Waiting for landlord confirmation...</p>
                    <button
                      className="my-inspections-page__cancel-btn"
                      onClick={() => handleCancel(insp.id)}
                      disabled={cancellingId === insp.id}
                    >
                      <HiOutlineXCircle />
                      {cancellingId === insp.id ? "Cancelling..." : "Cancel"}
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