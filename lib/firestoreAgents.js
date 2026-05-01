// lib/firestoreAgents.js
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
  } from "firebase/firestore";
  import { db } from "@/lib/firebase";
  
  // ── Fetch agent/landlord public profile ──────────────────
  export async function fetchAgentProfile(agentId) {
    const snap = await getDoc(doc(db, "users", agentId));
    if (!snap.exists()) return null;
    const data = snap.data();
    // Only expose public fields
    return {
      id:        snap.id,
      name:      data.name      || data.displayName || "Unknown",
      email:     data.email     || "",
      role:      data.role      || "landlord",
      verified:  data.verified  || false,
      createdAt: data.createdAt || null,
      avatar:    data.avatar    || null,
    };
  }
  
  // ── Fetch all listings by a landlord ─────────────────────
  export async function fetchListingsByLandlord(landlordId) {
    const q = query(
      collection(db, "listings"),
      where("landlordId", "==", landlordId),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  
  // ── Fetch reviews for an agent ────────────────────────────
  export async function fetchAgentReviews(agentId) {
    const q = query(
      collection(db, "agentReviews"),
      where("agentId", "==", agentId),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  
  // ── Submit a review ───────────────────────────────────────
  export async function submitAgentReview(agentId, userId, userName, { rating, comment }) {
    // Check if user already reviewed this agent
    const existing = query(
      collection(db, "agentReviews"),
      where("agentId", "==", agentId),
      where("userId", "==", userId)
    );
    const snap = await getDocs(existing);
    if (!snap.empty) throw new Error("already_reviewed");
  
    await addDoc(collection(db, "agentReviews"), {
      agentId,
      userId,
      userName,
      rating,
      comment:   comment || "",
      createdAt: serverTimestamp(),
    });
  }