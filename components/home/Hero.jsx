"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import "@/styles/hero.css";

export default function Hero() {
  const { user, userRole } = useAuth();

  return (
    <section className="hero">
      <div className="hero__overlay" />
      <div className="hero__content">
        <motion.p
          className="hero__tag"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Verified housing in Port Harcourt — no hidden fees, no stress
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Find a place to live without the wahala
        </motion.h1>

        <motion.p
          className="hero__text"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18 }}
        >
          Browse verified listings in Port Harcourt with clear prices, real
          photos, and direct contact to landlords. No stress. No hidden fees.
        </motion.p>

        <motion.div
          className="hero__actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.26 }}
        >
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
        </motion.div>

        <motion.div
          className="hero__stats"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.36 }}
        >
          <div className="hero__stat">
            <strong>No Agents</strong>
            <span>Talk directly to landlords</span>
          </div>
          <div className="hero__stat">
            <strong>Verified Listings</strong>
            <span>Trusted properties only</span>
          </div>
          <div className="hero__stat">
            <strong>Port Harcourt</strong>
            <span>Built for easy housing</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}