// components/home/FeaturedListings.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fetchListings } from "@/lib/firestoreListings";
import ListingCard from "@/components/listings/ListingCard";
import {
  HiOutlineShieldCheck,
  HiOutlineBanknotes,
  HiOutlineChatBubbleLeftRight,
  HiOutlineUserGroup,
  HiOutlineClipboardDocumentCheck,
  HiOutlineBolt,
  HiOutlineArrowRight,
} from "react-icons/hi2";
import "@/styles/featured.css";

const FEATURES = [
  {
    icon:    <HiOutlineShieldCheck />,
    title:   "Verified listings",
    desc:    "Every property is checked before being listed. No fake listings, no ghost apartments.",
    color:   "blue",
  },
  {
    icon:    <HiOutlineBanknotes />,
    title:   "Transparent pricing",
    desc:    "See the full move-in cost upfront — rent, caution fee, legal fee, everything.",
    color:   "green",
  },
  {
    icon:    <HiOutlineUserGroup />,
    title:   "Roommate matching",
    desc:    "Find someone to split the rent with. Post a request or browse the board.",
    color:   "purple",
  },
  {
    icon:    <HiOutlineClipboardDocumentCheck />,
    title:   "Book inspections",
    desc:    "Schedule a visit directly with the landlord — no agent needed.",
    color:   "teal",
  },
  {
    icon:    <HiOutlineChatBubbleLeftRight />,
    title:   "WhatsApp contact",
    desc:    "Chat directly with landlords on WhatsApp. Fast, familiar, no middleman.",
    color:   "amber",
  },
  {
    icon:    <HiOutlineBolt />,
    title:   "Express interest",
    desc:    "One tap to notify a landlord you're interested. They get an instant alert.",
    color:   "red",
  },
];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp  = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } };

export default function FeaturedListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchListings();
        const sorted = data.sort((a, b) => {
          if (a.verified && !b.verified) return -1;
          if (!a.verified && b.verified) return 1;
          return 0;
        });
        setListings(sorted.slice(0, 6));
      } catch (error) {
        console.error("Error fetching featured listings:", error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <>
      {/* ── Features Section ── */}
      <section className="features">
        <motion.div
          className="features__header"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="features__eyebrow">Why Dwella</p>
          <h2>Everything you need to find a home</h2>
          <p className="features__sub">
            Built specifically for students and renters in Port Harcourt.
            No agency fees, no runaround.
          </p>
        </motion.div>

        <motion.div
          className="features__grid"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {FEATURES.map((f) => (
            <motion.div key={f.title} className={"features__card features__card--" + f.color} variants={fadeUp}>
              <div className={"features__card-icon features__card-icon--" + f.color}>
                {f.icon}
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Featured Listings ── */}
      <section className="featured">
        <motion.div
          className="featured__header"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="featured__tag">Featured Properties</p>
          <h2>Explore Available Homes</h2>
          <p>
            Verified properties with transparent pricing, real photos,
            and direct landlord contact.
          </p>
        </motion.div>

        {loading ? (
          <div className="featured__loading">
            <div className="featured__skeleton-grid">
              {[1,2,3].map((n) => <div key={n} className="featured__skeleton" />)}
            </div>
          </div>
        ) : listings.length === 0 ? (
          <div className="featured__empty">
            <p>No listings available yet.</p>
            <Link href="/listings" className="featured__empty-btn">Browse Listings</Link>
          </div>
        ) : (
          <>
            <motion.div
              className="featured__grid"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
            >
              {listings.map((listing) => (
                <motion.div key={listing.id} variants={fadeUp}>
                  <ListingCard listing={listing} />
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="featured__footer"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link href="/listings" className="featured__view-all">
                View All Listings <HiOutlineArrowRight />
              </Link>
            </motion.div>
          </>
        )}
      </section>

      {/* ── CTA Banner ── */}
      <section className="home-cta">
        <motion.div
          className="home-cta__inner"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="home-cta__eyebrow">For landlords</p>
          <h2>Have a property to rent out?</h2>
          <p>List for free. Reach students and young professionals actively looking for housing in Port Harcourt.</p>
          <Link href="/signup" className="home-cta__btn">
            List Your Property Free
          </Link>
        </motion.div>
      </section>
    </>
  );
}