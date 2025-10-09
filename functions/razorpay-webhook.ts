type CFContext = {
  request: Request;
  env: Record<string, string>;
};

async function verifySignature(body: string, secret: string, signature: string): Promise<boolean> {
  // Web Crypto API for HMAC SHA256
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const algo = { name: "HMAC", hash: "SHA-256" };

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    algo,
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign(
    algo.name,
    cryptoKey,
    encoder.encode(body)
  );
  const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return expectedSignature === signature;
}

export const onRequestPost = async (context: CFContext) => {
  try {
    const req = context.request;
    const webhookSecret = context.env.RAZORPAY_WEBHOOK_SECRET;
    const supabaseUrl = context.env.SUPABASE_URL;
    const supabaseKey = context.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!webhookSecret) {
      return new Response(JSON.stringify({ error: "Server configuration error" }), { status: 500 });
    }

    // Get raw body
    const body = await req.text();

    // Get header (case insensitive)
    const razorpaySignature =
      req.headers.get("x-razorpay-signature") || req.headers.get("X-Razorpay-Signature") || "";

    // Verify signature
    const validSignature = await verifySignature(body, webhookSecret, razorpaySignature);

    if (!validSignature) {
      return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400 });
    }

    const payload = JSON.parse(body);
    const eventType = payload.event;

    if (eventType === "payment.captured") {
      const paymentEntity = payload.payload.payment.entity;
      const notes = paymentEntity.notes;

      let devotees: any[] = [];
      try {
        devotees = notes.devotees ? JSON.parse(notes.devotees) : [];
      } catch {
        devotees = [];
      }

      // Supabase insert (use edge client or REST API in Pages Functions)
      // If you must use @supabase/supabase-js, use fetch to call Supabase REST API
      const rows = devotees.map((devotee: any) => ({
        contact: notes.contactMobile,
        pooja_name: "Kodi Archana",
        pooja_price: 200,
        devotee_name: devotee.name,
        nakshatram: devotee.nakshatra,
        pooja_date: devotee.date,
        email: notes.contactEmail,
        payment_id: paymentEntity.id
      }));

      // Use Supabase REST API for insert
      const supabaseResp = await fetch(`${supabaseUrl}/rest/v1/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Prefer": "return=representation"
        },
        body: JSON.stringify(rows)
      });

      if (!supabaseResp.ok) {
        const dbError = await supabaseResp.text();
        return new Response(JSON.stringify({ error: "Database insert error", dbError }), { status: 500 });
      }

      return new Response(JSON.stringify({ success: true, message: "Payment processed and bookings stored successfully" }), { status: 200 });
    }

    return new Response(JSON.stringify({ message: "Event received" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};