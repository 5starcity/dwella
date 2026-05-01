// app/api/paystack/verify-account/route.js
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const account_number   = searchParams.get("account_number");
  const bank_code        = searchParams.get("bank_code");

  if (!account_number || !bank_code) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    const data = await res.json();
    if (!data.status) {
      return NextResponse.json({ error: data.message }, { status: 400 });
    }
    return NextResponse.json({ account_name: data.data.account_name });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}