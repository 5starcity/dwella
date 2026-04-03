import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    serverTimestamp,
    updateDoc,
    increment,
  } from "firebase/firestore";
  import { db } from "@/lib/firebase";
  
  const listingsCollection = collection(db, "listings");
  
  export async function fetchListings() {
    const querySnapshot = await getDocs(listingsCollection);
    return querySnapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    }));
  }
  
  export async function createListing(listingData) {
    const docRef = await addDoc(listingsCollection, {
      ...listingData,
      price: Number(listingData.price),
      beds: Number(listingData.beds || 1),
      baths: Number(listingData.baths || 1),
      verified: Boolean(listingData.verified ?? false),
      featured: Boolean(listingData.featured ?? false),
      views: 0,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }
  
  export async function fetchListingById(id) {
    const docRef = doc(db, "listings", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return {
      id: docSnap.id,
      ...docSnap.data(),
    };
  }
  
  export async function updateListing(id, data) {
    const docRef = doc(db, "listings", id);
    await updateDoc(docRef, {
      ...data,
      price: Number(data.price),
      beds: Number(data.beds || 1),
      baths: Number(data.baths || 1),
      updatedAt: new Date().toISOString(),
    });
  }
  
  export async function deleteListing(id) {
    const docRef = doc(db, "listings", id);
    await deleteDoc(docRef);
  }
  
  // Increment view count when listing is opened
  export async function incrementViewCount(id) {
    const docRef = doc(db, "listings", id);
    await updateDoc(docRef, {
      views: increment(1),
    });
  }
  
  // Submit a report for a listing
  export async function reportListing(listingId, reporterId, reason) {
    await addDoc(collection(db, "reports"), {
      listingId,
      reporterId: reporterId || "anonymous",
      reason,
      createdAt: serverTimestamp(),
      reviewed: false,
    });
  }
  export async function expressInterest(listingId, userId, userName) {
    await addDoc(collection(db, "interests"), {
      listingId,
      userId,
      userName,
      createdAt: serverTimestamp(),
    });
  
    // Increment interest count on listing
    const docRef = doc(db, "listings", listingId);
    await updateDoc(docRef, {
      interests: increment(1),
    });
  }