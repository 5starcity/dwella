// /lib/firestoreInspections.js

import {
    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
    addDoc,
    serverTimestamp,
    orderBy,
  } from "firebase/firestore";
  import { db } from "@/lib/firebase";
  
  /**
   * 📌 Create a new inspection booking
   */
  export async function bookInspection({
    listingId,
    listingTitle,
    landlordId,
    tenantId,
    tenantName,
    tenantPhone,
    date,
    time,
    note = "",
  }) {
    try {
      const docRef = await addDoc(collection(db, "inspections"), {
        listingId,
        listingTitle,
        landlordId,
        tenantId,
        tenantName,
        tenantPhone,
        date,
        time,
        note,
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
  
      return docRef.id;
    } catch (error) {
      console.error("bookInspection error:", error);
      throw error;
    }
  }
  
  /**
   * 📅 Get inspections for landlord
   */
  export async function fetchInspectionsByLandlord(landlordId) {
    try {
      const q = query(
        collection(db, "inspections"),
        where("landlordId", "==", landlordId),
        orderBy("createdAt", "desc")
      );
  
      const snapshot = await getDocs(q);
  
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
    } catch (error) {
      console.error("fetchInspectionsByLandlord error:", error);
      throw error;
    }
  }
  
  /**
   * 📅 Get inspections for tenant
   */
  export async function fetchInspectionsByTenant(tenantId) {
    try {
      const q = query(
        collection(db, "inspections"),
        where("tenantId", "==", tenantId),
        orderBy("createdAt", "desc")
      );
  
      const snapshot = await getDocs(q);
  
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
    } catch (error) {
      console.error("fetchInspectionsByTenant error:", error);
      throw error;
    }
  }
  
  /**
   * 🔄 Update inspection status
   * @param {string} inspectionId
   * @param {"pending"|"confirmed"|"cancelled"} status
   */
  export async function updateInspectionStatus(inspectionId, status) {
    try {
      const ref = doc(db, "inspections", inspectionId);
  
      await updateDoc(ref, {
        status,
        updatedAt: serverTimestamp(),
      });
  
      return true;
    } catch (error) {
      console.error("updateInspectionStatus error:", error);
      throw error;
    }
  }