// components/home/Hero.jsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  HiOutlineShieldCheck,
  HiOutlineMapPin,
  HiOutlineBanknotes,
  HiOutlineUserGroup,
  HiOutlineClipboardDocumentCheck,
  HiOutlineAcademicCap,
} from "react-icons/hi2";
import "@/styles/hero.css";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Hero() {
  const { user, userRole } = useAuth();

  return (
    <section className="hero">
      {/* Background layers */}
      <div className="hero__bg">
        <div className="hero__bg-glow hero__bg-glow--1" />
        <div className="hero__bg-glow hero__bg-glow--2" />
        <div className="hero__bg-glow hero__bg-glow--3" />
        <div className="hero__bg-grid" />
      </div>

      <div className="hero__content">

        {/* Eyebrow */}
        <motion.div className="hero__eyebrow" {...fadeUp(0)}>
          <HiOutlineAcademicCap />
          <span>Built for students in Port Harcourt</span>
          <span className="hero__eyebrow-dot" />
          <span>No agent fees</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 {...fadeUp(0.08)}>
          Student housing,
          <span className="hero__headline-accent"> done right</span>
        </motion.h1>

        {/* Sub */}
        <motion.p className="hero__text" {...fadeUp(0.16)}>
          Find verified rooms and apartments near your campus in Port Harcourt.
          See the full cost upfront, contact landlords directly, and split rent with a roommate —
          no agents, no surprises.
        </motion.p>

        {/* CTAs */}
        <motion.div className="hero__actions" {...fadeUp(0.24)}>
          <Link href="/listings" className="hero__btn hero__btn--primary">
            Find Housing
          </Link>
          {!user && (
            <Link href="/signup" className="hero__btn hero__btn--secondary">
              Create Free Account
            </Link>
          )}
          {userRole === "student" && (
            <Link href="/roommates" className="hero__btn hero__btn--secondary">
              Find a Roommate
            </Link>
          )}
          {userRole === "landlord" && (
            <Link href="/add-listing" className="hero__btn hero__btn--secondary">
              Post Property
            </Link>
          )}
        </motion.div>

        {/* Feature pills */}
        <motion.div className="hero__pills" {...fadeUp(0.32)}>
          {[
            { icon: <HiOutlineShieldCheck />,            label: "Verified listings" },
            { icon: <HiOutlineBanknotes />,              label: "No hidden fees" },
            { icon: <HiOutlineUserGroup />,              label: "Split rent" },
            { icon: <HiOutlineClipboardDocumentCheck />, label: "Book inspections" },
          ].map((pill) => (
            <div key={pill.label} className="hero__pill">
              {pill.icon}
              <span>{pill.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div className="hero__stats" {...fadeUp(0.4)}>
          <div className="hero__stat">
            <strong>RSU · UniPort</strong>
            <span>Near your campus</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <strong>Zero agent fees</strong>
            <span>Direct to landlord</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <strong>Split-ready</strong>
            <span>Roommate board included</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}