"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ListingCard from "@/components/listings/ListingCard";
import FilterBar from "@/components/listings/FilterBar";
import { fetchListings } from "@/lib/firestoreListings";
import "@/styles/listings-page.css";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function ListingsPage() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [type, setType] = useState("All");
  const [price, setPrice] = useState("All");
  const [verified, setVerified] = useState(false);
  const [availability, setAvailability] = useState("All");
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadListings() {
      try {
        const data = await fetchListings();
        setAllListings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setAllListings([]);
      } finally {
        setLoading(false);
      }
    }
    loadListings();
  }, []);

  const filteredListings = useMemo(() => {
    return allListings.filter((listing) => {
      const title = listing.title?.toLowerCase() || "";
      const listingLocation = listing.location?.toLowerCase() || "";
      const listingType = listing.type || "";
      const listingPrice = Number(listing.price) || 0;

      const matchesSearch =
        title.includes(search.toLowerCase()) ||
        listingLocation.includes(search.toLowerCase());
      const matchesLocation =
        location === "All" || listing.location === location;
      const matchesType =
        type === "All" || listingType === type;
      const matchesPrice =
        price === "All" || listingPrice <= Number(price);
      const matchesVerified =
        !verified || listing.verified === true;
      const matchesAvailability =
        availability === "All" || listing.availability === availability;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesType &&
        matchesPrice &&
        matchesVerified &&
        matchesAvailability
      );
    });
  }, [allListings, search, location, type, price, verified, availability]);

  const activeFilterCount = [
    search !== "",
    location !== "All",
    type !== "All",
    price !== "All",
    verified,
    availability !== "All",
  ].filter(Boolean).length;

  return (
    <main className="listings-page">
      <motion.div
        className="listings-page__header"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="listings-page__tag">Browse Properties</p>
        <h1>Housing in Port Harcourt</h1>
        <p>Search and filter listings by area, type, budget and more.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <FilterBar
          search={search}
          setSearch={setSearch}
          location={location}
          setLocation={setLocation}
          type={type}
          setType={setType}
          price={price}
          setPrice={setPrice}
          verified={verified}
          setVerified={setVerified}
          availability={availability}
          setAvailability={setAvailability}
        />
      </motion.div>

      <div className="listings-page__results">
        {loading ? (
          <p>Loading listings...</p>
        ) : (
          <p>
            {filteredListings.length} listing{filteredListings.length !== 1 ? "s" : ""} found
            {activeFilterCount > 0 && (
              <span className="listings-page__filter-count">
                · {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} active
              </span>
            )}
          </p>
        )}
      </div>

      {loading ? (
        <div className="listings-page__grid">
          <div className="listings-page__loading">
            <p>Loading properties...</p>
          </div>
        </div>
      ) : filteredListings.length > 0 ? (
        <motion.div
          className="listings-page__grid"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {filteredListings.map((listing) => (
            <motion.div key={listing.id} variants={itemVariants}>
              <ListingCard listing={listing} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="listings-page__grid">
          <div className="listings-page__empty">
            <h3>No listings found</h3>
            <p>Try adjusting your filters or search terms.</p>
          </div>
        </div>
      )}
    </main>
  );
}