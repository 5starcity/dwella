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
  HiOutlineMapPin,
  HiOutlineExclamationTriangle,
  HiOutlineAcademicCap,
} from "react-icons/hi2";
import "@/styles/featured.css";

const FEATURES = [
  {
    icon:  <HiOutlineShieldCheck />,
    title: "Verified listings",
    desc:  "Every property is checked before going live. No fake listings, no ghost apartments asking for upfront payment.",
    color: "blue",
  },
  {
    icon:  <HiOutlineBanknotes />,
    title: "Full cost upfront",
    desc:  "See rent, caution fee, legal fee and move-in total before you even contact a landlord. No surprises.",
    color: "green",
  },
  {
    icon:  <HiOutlineUserGroup />,
    title: "Split rent with a roommate",
    desc:  "Found a place you love but can't afford alone? Post on the roommate board and split the cost.",
    color: "purple",
  },
  {
    icon:  <HiOutlineMapPin />,
    title: "Near your campus",
    desc:  "Filter by school — RSU, UniPort, IAUE and more. Find housing close to your campus, not across town.",
    color: "teal",
  },
  {
    icon:  <HiOutlineChatBubbleLeftRight />,
    title: "Direct WhatsApp contact",
    desc:  "Chat straight with landlords on WhatsApp. No agents taking a cut, no middlemen slowing things down.",
    color: "amber",
  },
  {
    icon:  <HiOutlineExclamationTriangle />,
    title: "Scam protection",
    desc:  "Suspicious prices get flagged automatically. Report dodgy listings and keep the platform safe for everyone.",
    color: "red",
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
      {/* Features Section */}
      <section className="features">
        <motion.div
          className="features__header"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="features__eyebrow">Why students choose Velen</p>
          <h2>Everything a student renter needs</h2>
          <p className="features__sub">
            No agents. No hidden fees. No stress.
            Just verified housing close to your school.
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
            <motion.div
              key={f.title}
              className={"features__card features__card--" + f.color}
              variants={fadeUp}
            >
              <div className={"features__card-icon features__card-icon--" + f.color}>
                {f.icon}
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Featured Listings */}
      <section className="featured">
        <motion.div
          className="featured__header"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="featured__tag">Available Now</p>
          <h2>Rooms near your campus</h2>
          <p>
            Verified properties with transparent pricing, real photos,
            and direct contact to owners.
          </p>
        </motion.div>

        {loading ? (
          <div className="featured__loading">
            <div className="featured__skeleton-grid">
              {[1, 2, 3].map((n) => <div key={n} className="featured__skeleton" />)}
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
                Browse all listings <HiOutlineArrowRight />
              </Link>
            </motion.div>
          </>
        )}
      </section>

      {/* Student CTA — replaces landlord banner */}
      <section className="home-cta">
        <motion.div
          className="home-cta__inner"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="home-cta__icon">
            <HiOutlineAcademicCap />
          </div>
          <p className="home-cta__eyebrow">For students</p>
          <h2>Can't afford a place alone?</h2>
          <p>
            Use the roommate board to find someone in the same situation.
            Split the rent, share the space, halve the stress.
          </p>
          <div className="home-cta__actions">
            <Link href="/roommates" className="home-cta__btn">
              Find a Roommate
            </Link>
            <Link href="/listings" className="home-cta__btn home-cta__btn--ghost">
              Browse Listings
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}