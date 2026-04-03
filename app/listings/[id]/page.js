// app/listings/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  HiOutlineCheckBadge,
  HiOutlineMapPin,
  HiOutlineHomeModern,
  HiOutlinePhone,
  HiOutlineChatBubbleLeftRight,
  HiOutlineHeart,
  HiHeart,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineBanknotes,
  HiOutlineSparkles,
  HiOutlineWrenchScrewdriver,
  HiOutlineShare,
  HiOutlineFlag,
  HiOutlineEye,
  HiOutlineCalendarDays,
  HiOutlinePlayCircle,
} from "react-icons/hi2";
import {
  fetchListingById,
  updateListing,
  deleteListing,
  incrementViewCount,
  reportListing,
  expressInterest,
} from "@/lib/firestoreListings";
import { getFavorites, toggleFavorite } from "@/lib/favorites";
import { useAuth } from "@/context/AuthContext";
import { isLandlordVerified } from "@/lib/verification";
import "@/styles/details-page.css";

export default function ListingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params?.id;
  const { user } = useAuth();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [showReportBox, setShowReportBox] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeMedia, setActiveMedia] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [interestSent, setInterestSent] = useState(false);
  const [sendingInterest, setSendingInterest] = useState(false);

  useEffect(() => {
    setFavorites(getFavorites());
    function handleFavoritesUpdate() {
      setFavorites(getFavorites());
    }
    window.addEventListener("favoritesUpdated", handleFavoritesUpdate);
    return () => window.removeEventListener("favoritesUpdated", handleFavoritesUpdate);
  }, []);

  useEffect(() => {
    async function loadListing() {
      if (!listingId) { setLoading(false); return; }
      try {
        const data = await fetchListingById(listingId);
        if (data && data.landlordId) {
          const verified = await isLandlordVerified(data.landlordId);
          setListing({ ...data, verified });
          setEditForm({ ...data, verified });
        } else {
          setListing(data);
          setEditForm(data);
        }
        try { await incrementViewCount(listingId); } catch (e) { }
      } catch (error) {
        console.error("Error fetching listing:", error);
        setListing(null);
      } finally {
        setLoading(false);
      }
    }
    loadListing();
  }, [listingId]);

  if (loading) {
    return (
      <main className="details-page">
        <motion.div
          className="details-page__not-found"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="details-page__tag">Loading</p>
          <h1>Loading property...</h1>
          <p>Please wait a moment.</p>
        </motion.div>
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="details-page">
        <motion.div
          className="details-page__not-found"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="details-page__tag">Listing Not Found</p>
          <h1>Property not found</h1>
          <p>This property may have been removed or the link is invalid.</p>
        </motion.div>
      </main>
    );
  }

  const images = listing.images && listing.images.length > 0
    ? listing.images
    : listing.image
      ? [listing.image]
      : [];

  const isOwner = user && user.uid === listing.landlordId;
  const saved = favorites.includes(listing.id);

  const whatsappNumber =
    typeof listing.contact === "string" && listing.contact.startsWith("0")
      ? "234" + listing.contact.slice(1)
      : listing.contact;

  const whatsappHref = "https://wa.me/" + whatsappNumber;
  const telHref = "tel:" + listing.contact;

  function handleToggleFavorite() {
    const updated = toggleFavorite(listing.id);
    setFavorites(updated);
  }

  function handleEditChange(e) {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateListing(listingId, {
        title: editForm.title,
        price: editForm.price,
        location: editForm.location,
        distanceFromRSU: editForm.distanceFromRSU,
        type: editForm.type,
        beds: editForm.beds,
        baths: editForm.baths,
        furnishing: editForm.furnishing,
        availability: editForm.availability,
        paymentTerms: editForm.paymentTerms,
        amenities: editForm.amenities,
        additionalCosts: editForm.additionalCosts,
        image: editForm.image,
        contact: editForm.contact,
        description: editForm.description,
      });
      setListing({ ...listing, ...editForm });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating listing:", error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm("Are you sure you want to delete this listing?");
    if (!confirmed) return;
    setDeleting(true);
    try {
      await deleteListing(listingId);
      router.push("/listings");
    } catch (error) {
      console.error("Error deleting listing:", error);
      setDeleting(false);
    }
  }

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: listing.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  async function handleReport() {
    if (!reportReason.trim()) return;
    try {
      await reportListing(listingId, user?.uid, reportReason);
      setReportSent(true);
      setShowReportBox(false);
      setReportReason("");
    } catch (error) {
      console.error("Error reporting listing:", error);
    }
  }

  async function handleExpressInterest() {
    if (!user) {
      router.push("/login");
      return;
    }
    setSendingInterest(true);
    try {
      await expressInterest(listingId, user.uid, user.displayName || "A student");
      const studentName = user.displayName || "A student";
      const message = "Hi, I found your listing \"" + listing.title + "\" on Dwella and I'm interested. My name is " + studentName + ".";
      const encodedMessage = encodeURIComponent(message);
      const waUrl = "https://wa.me/" + whatsappNumber + "?text=" + encodedMessage;
      setInterestSent(true);
      window.open(waUrl, "_blank");
    } catch (error) {
      console.error("Error expressing interest:", error);
    } finally {
      setSendingInterest(false);
    }
  }

  function formatDate(ts) {
    if (!ts) return null;
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString("en-NG", {
      day: "numeric", month: "short", year: "numeric",
    });
  }

  return (
    <main className="details-page">
      <section className="details-page__grid">

        {/* Left — Media */}
        <motion.div
          className="details-page__media-col"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <div className="details-page__media">
            {showVideo && listing.videoUrl ? (
              <video
                src={listing.videoUrl}
                controls
                autoPlay
                className="details-page__video"
              />
            ) : (
              <img
                src={images[activeMedia] || listing.image}
                alt={listing.title}
                className="details-page__image"
              />
            )}
          </div>

          {(images.length > 1 || listing.videoUrl) && (
            <div className="details-page__thumbnails">
              {images.map((src, i) => (
                <button
                  key={i}
                  className={"details-page__thumb" + (activeMedia === i && !showVideo ? " active" : "")}
                  onClick={() => { setActiveMedia(i); setShowVideo(false); }}
                >
                  <img src={src} alt={"Photo " + (i + 1)} />
                </button>
              ))}
              {listing.videoUrl && (
                <button
                  className={"details-page__thumb details-page__thumb--video" + (showVideo ? " active" : "")}
                  onClick={() => setShowVideo(true)}
                >
                  <HiOutlinePlayCircle />
                  <span>Video</span>
                </button>
              )}
            </div>
          )}
        </motion.div>

        {/* Right — Content */}
        <motion.div
          className="details-page__content"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
        >
          {isOwner && !isEditing && (
            <div className="details-page__owner-actions">
              <button className="details-page__edit-btn" onClick={() => setIsEditing(true)}>
                <HiOutlinePencilSquare /> Edit Listing
              </button>
              <button className="details-page__delete-btn" onClick={handleDelete} disabled={deleting}>
                <HiOutlineTrash /> {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}

          {isEditing ? (
            <motion.div
              className="details-page__edit-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="details-page__tag">Editing Listing</p>
              <h2>Update Property Details</h2>
              <div className="edit-form__grid">
                <div className="edit-form__field edit-form__field--full">
                  <label>Title</label>
                  <input name="title" value={editForm.title || ""} onChange={handleEditChange} />
                </div>
                <div className="edit-form__field">
                  <label>Price (₦)</label>
                  <input type="number" name="price" value={editForm.price || ""} onChange={handleEditChange} />
                </div>
                <div className="edit-form__field">
                  <label>Type</label>
                  <input name="type" value={editForm.type || ""} onChange={handleEditChange} />
                </div>
                <div className="edit-form__field">
                  <label>Location</label>
                  <input name="location" value={editForm.location || ""} onChange={handleEditChange} />
                </div>
                <div className="edit-form__field">
                  <label>Distance from campus</label>
                  <input name="distanceFromRSU" value={editForm.distanceFromRSU || ""} onChange={handleEditChange} />
                </div>
                <div className="edit-form__field">
                  <label>Bedrooms</label>
                  <input type="number" name="beds" value={editForm.beds || ""} onChange={handleEditChange} />
                </div>
                <div className="edit-form__field">
                  <label>Bathrooms</label>
                  <input type="number" name="baths" value={editForm.baths || ""} onChange={handleEditChange} />
                </div>
                <div className="edit-form__field">
                  <label>Furnishing</label>
                  <input name="furnishing" value={editForm.furnishing || ""} onChange={handleEditChange} />
                </div>
                <div className="edit-form__field">
                  <label>Availability</label>
                  <input name="availability" value={editForm.availability || ""} onChange={handleEditChange} />
                </div>
                <div className="edit-form__field edit-form__field--full">
                  <label>Payment Terms</label>
                  <input name="paymentTerms" value={editForm.paymentTerms || ""} onChange={handleEditChange} />
                </div>
                <div className="edit-form__field edit-form__field--full">
                  <label>Amenities</label>
                  <input name="amenities" value={editForm.amenities || ""} onChange={handleEditChange} />
                </div>
                <div className="edit-form__field edit-form__field--full">
                  <label>Additional Costs</label>
                  <input name="additionalCosts" value={editForm.additionalCosts || ""} onChange={handleEditChange} />
                </div>
                <div className="edit-form__field edit-form__field--full">
                  <label>Contact</label>
                  <input name="contact" value={editForm.contact || ""} onChange={handleEditChange} />
                </div>
                <div className="edit-form__field edit-form__field--full">
                  <label>Description</label>
                  <textarea rows="4" name="description" value={editForm.description || ""} onChange={handleEditChange} />
                </div>
              </div>
              <div className="edit-form__actions">
                <button className="edit-form__save" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button className="edit-form__cancel" onClick={() => { setIsEditing(false); setEditForm(listing); }}>
                  Cancel
                </button>
              </div>
            </motion.div>

          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="details-page__header">
                <div>
                  <p className="details-page__tag">Property Details</p>
                  <h1>{listing.title}</h1>
                  <p className="details-page__location">
                    <HiOutlineMapPin />
                    <span>{listing.location}</span>
                    {listing.distanceFromRSU && (
                      <span className="details-page__distance">
                        · {listing.distanceFromRSU} from campus
                      </span>
                    )}
                  </p>
                  <div className="details-page__meta">
                    {listing.createdAt && (
                      <span><HiOutlineCalendarDays />{formatDate(listing.createdAt)}</span>
                    )}
                    {listing.views > 0 && (
                      <span><HiOutlineEye />{listing.views} {listing.views === 1 ? "view" : "views"}</span>
                    )}
                  </div>
                </div>

                <div className="details-page__price-wrap">
                  <p className="details-page__price">
                    ₦{Number(listing.price).toLocaleString()}
                  </p>
                  <div className="details-page__top-actions">
                    <button
                      type="button"
                      onClick={handleToggleFavorite}
                      className={"details-page__favorite-icon" + (saved ? " active" : "")}
                    >
                      {saved ? <HiHeart /> : <HiOutlineHeart />}
                    </button>
                    <button type="button" className="details-page__share-btn" onClick={handleShare}>
                      <HiOutlineShare />
                    </button>
                    {listing.verified && (
                      <span className="details-page__verified">
                        <HiOutlineCheckBadge /> Verified
                      </span>
                    )}
                    {listing.availability && (
                      <span className={"details-page__availability " + (
                        listing.availability === "Available Now" ? "available" :
                        listing.availability === "Available Soon" ? "soon" : "unavailable"
                      )}>
                        {listing.availability}
                      </span>
                    )}
                  </div>
                  {copied && <p className="details-page__copied">Link copied!</p>}
                </div>
              </div>

              <div className="details-page__facts">
                <div className="details-page__fact">
                  <HiOutlineHomeModern />
                  <div><span>Type</span><strong>{listing.type}</strong></div>
                </div>
                <div className="details-page__fact">
                  <HiOutlineHomeModern />
                  <div><span>Bedrooms</span><strong>{listing.beds || 1} Bed</strong></div>
                </div>
                <div className="details-page__fact">
                  <HiOutlineHomeModern />
                  <div><span>Bathrooms</span><strong>{listing.baths || 1} Bath</strong></div>
                </div>
                {listing.furnishing && (
                  <div className="details-page__fact">
                    <HiOutlineSparkles />
                    <div><span>Furnishing</span><strong>{listing.furnishing}</strong></div>
                  </div>
                )}
                {listing.paymentTerms && (
                  <div className="details-page__fact">
                    <HiOutlineBanknotes />
                    <div><span>Payment</span><strong>{listing.paymentTerms}</strong></div>
                  </div>
                )}
                {listing.distanceFromRSU && (
                  <div className="details-page__fact">
                    <HiOutlineMapPin />
                    <div><span>From Campus</span><strong>{listing.distanceFromRSU}</strong></div>
                  </div>
                )}
              </div>

              {listing.amenities && (
                <div className="details-page__section">
                  <h2>Amenities</h2>
                  <div className="details-page__amenities">
                    {listing.amenities.split(",").map((item, i) => (
                      <span key={i} className="details-page__amenity-tag">
                        <HiOutlineWrenchScrewdriver />{item.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {listing.additionalCosts && (
                <div className="details-page__section">
                  <h2>Additional Costs</h2>
                  <p>{listing.additionalCosts}</p>
                </div>
              )}

              <div className="details-page__section">
                <h2>Description</h2>
                <p>{listing.description}</p>
              </div>

              <div className="details-page__section">
                <h2>Quick Actions</h2>
                <div className="details-page__actions">
                  
                   <a href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="details-page__button details-page__button--primary"
                  >
                    <HiOutlineChatBubbleLeftRight /> Chat on WhatsApp
                  </a>
                  
                    <a href={telHref}
                    className="details-page__button details-page__button--secondary"
                  >
                    <HiOutlinePhone /> Call Now
                  </a>
                </div>

                <div className="details-page__interest">
                  {!interestSent ? (
                    <button
                      className="details-page__interest-btn"
                      onClick={handleExpressInterest}
                      disabled={sendingInterest || isOwner}
                    >
                      {sendingInterest ? "Sending..." : "⚡ Express Interest"}
                    </button>
                  ) : (
                    <div className="details-page__interest-sent">
                      <p>✅ Interest sent! The landlord has been notified on WhatsApp.</p>
                    </div>
                  )}
                  {!user && (
                    <p className="details-page__interest-note">
                      <a href="/login">Log in</a> to express interest in this property.
                    </p>
                  )}
                  {isOwner && (
                    <p className="details-page__interest-note">This is your listing.</p>
                  )}
                  {listing.interests > 0 && (
                    <p className="details-page__interest-count">
                      ⚡ {listing.interests} {listing.interests === 1 ? "person has" : "people have"} expressed interest
                    </p>
                  )}
                </div>
              </div>

              <div className="details-page__section">
                <h2>Contact</h2>
                <p className="details-page__contact-text">Reach out directly to the property owner or manager.</p>
                <p className="details-page__phone">{listing.contact}</p>
              </div>

              <div className="details-page__section">
                {!reportSent ? (
                  <div className="details-page__report">
                    {!showReportBox ? (
                      <button className="details-page__report-btn" onClick={() => setShowReportBox(true)}>
                        <HiOutlineFlag /> Report this listing
                      </button>
                    ) : (
                      <div className="details-page__report-box">
                        <p>What's wrong with this listing?</p>
                        <input
                          type="text"
                          placeholder="e.g. Fake listing, wrong price, scam..."
                          value={reportReason}
                          onChange={(e) => setReportReason(e.target.value)}
                        />
                        <div className="details-page__report-actions">
                          <button onClick={handleReport}>Submit Report</button>
                          <button onClick={() => { setShowReportBox(false); setReportReason(""); }}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="details-page__report-sent">✅ Report submitted. We'll review this listing.</p>
                )}
              </div>
            </motion.div>
          )}
      </motion.div>
    </section>
    </main >
  );
}