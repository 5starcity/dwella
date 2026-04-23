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
          <HiOutlineMapPin />
          <span>Port Harcourt, Nigeria</span>
          <span className="hero__eyebrow-dot" />
          <span>No hidden fees</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 {...fadeUp(0.08)}>
          Find your next home
          <span className="hero__headline-accent"> with confidence</span>
        </motion.h1>

        {/* Sub */}
        <motion.p className="hero__text" {...fadeUp(0.16)}>
          Browse verified properties in Port Harcourt with transparent pricing,
          real photos, and direct landlord contact. No agents, no surprises.
        </motion.p>

        {/* CTAs */}
        <motion.div className="hero__actions" {...fadeUp(0.24)}>
          <Link href="/listings" className="hero__btn hero__btn--primary">
            Explore Listings
          </Link>
          {!user && (
            <Link href="/signup" className="hero__btn hero__btn--secondary">
              List Your Property
            </Link>
          )}
          {userRole === "landlord" && (
            <Link href="/add-listing" className="hero__btn hero__btn--secondary">
              Post Property
            </Link>
          )}
          {userRole === "student" && (
            <Link href="/roommates" className="hero__btn hero__btn--secondary">
              Find a Roommate
            </Link>
          )}
        </motion.div>

        {/* Feature pills */}
        <motion.div className="hero__pills" {...fadeUp(0.32)}>
          {[
            { icon: <HiOutlineShieldCheck />,              label: "Verified listings" },
            { icon: <HiOutlineBanknotes />,                label: "Transparent pricing" },
            { icon: <HiOutlineUserGroup />,                label: "Roommate matching" },
            { icon: <HiOutlineClipboardDocumentCheck />,   label: "Book inspections" },
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
            <strong>100%</strong>
            <span>Transparent fees</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <strong>Port Harcourt</strong>
            <span>Student housing focus</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <strong>Direct contact</strong>
            <span>WhatsApp landlords</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}