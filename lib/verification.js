// lib/verification.js
import {
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function submitVerificationRequest(uid, data) {
  await addDoc(collection(db, "verificationRequests"), {
    uid,
    name:              data.name,
    phone:             data.phone,
    address:           data.address,
    nin:               data.nin               || "",
    bankName:          data.bankName          || "",
    bankCode:          data.bankCode          || "",
    accountNumber:     data.accountNumber     || "",
    accountName:       data.accountName       || "",
    paystackSubaccount: data.paystackSubaccount || "",
    propertyType:      data.propertyType      || "",
    yearsActive:       data.yearsActive       || "",
    status:            "pending",
    submittedAt:       serverTimestamp(),
  });

  // Save bank details + subaccount to user doc so payment flow can access it
  await updateDoc(doc(db, "users", uid), {
    bankName:          data.bankName          || "",
    bankCode:          data.bankCode          || "",
    accountNumber:     data.accountNumber     || "",
    accountName:       data.accountName       || "",
    paystackSubaccount: data.paystackSubaccount || "",
    nin:               data.nin               || "",
    phone:             data.phone             || "",
    verificationStatus: "pending",
  });
}

export async function isLandlordVerified(uid) {
  const ref  = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return false;
  return snap.data().verified === true;
}

export async function getLandlordPaystackSubaccount(uid) {
  const ref  = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data().paystackSubaccount || null;
}