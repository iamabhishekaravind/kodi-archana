type CFContext = {
  request: Request;
  env: Record<string, string>;
};

async function verifySignature(body: string, secret: string, signature: string): Promise<boolean> {
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

    // Debug: Log incoming request details
    console.log("Webhook received!");
    console.log("Request method:", req.method);
    console.log("Webhook secret present:", !!webhookSecret);
    console.log("Supabase URL present:", !!supabaseUrl);

    if (!webhookSecret) {
      console.log("ERROR: RAZORPAY_WEBHOOK_SECRET not configured");
      return new Response(JSON.stringify({ error: "Server configuration error" }), { status: 500 });
    }

    // Get raw body
    const body = await req.text();
    console.log("Raw body:", body);

    // Get header (case insensitive)
    const razorpaySignature =
      req.headers.get("x-razorpay-signature") || req.headers.get("X-Razorpay-Signature") || "";
    console.log("Received signature:", razorpaySignature);

    // Verify signature
    const encoder = new TextEncoder();
    const keyData = encoder.encode(webhookSecret);
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

    console.log("Expected signature:", expectedSignature);

    const validSignature = expectedSignature === razorpaySignature;
    console.log("Signature valid?", validSignature);

    if (!validSignature) {
      console.log("ERROR: Invalid signature!");
      return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400 });
    }

    let payload;
    try {
      payload = JSON.parse(body);
    } catch (err) {
      console.log("ERROR: Failed to parse JSON:", err);
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400 });
    }

    console.log("Parsed payload:", payload);

    const eventType = payload.event;
    console.log("Event type:", eventType);

    if (eventType === "payment.captured") {
      const paymentEntity = payload.payload.payment.entity;
      const notes = paymentEntity.notes;

      let devotees: any[] = [];
      try {
        devotees = notes.devotees ? JSON.parse(notes.devotees) : [];
      } catch {
        devotees = [];
      }

      console.log("Devotees array:", devotees);

      // Supabase insert (use edge client or REST API in Pages Functions)
      const rows = devotees.map((devotee: any) => ({
        contact: notes.contactMobile,
        pooja_name: "Kodi Archana",
        pooja_price: 1,
        devotee_name: devotee.name,
        nakshatram: devotee.nakshatra,
        pooja_date: devotee.date,
        email: notes.contactEmail,
        payment_id: paymentEntity.id
      }));

      console.log("Rows to insert into Supabase:", rows);

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

      console.log("Supabase response status:", supabaseResp.status);

      if (!supabaseResp.ok) {
        const dbError = await supabaseResp.text();
        console.log("ERROR: Supabase insert error:", dbError);
        return new Response(JSON.stringify({ error: "Database insert error", dbError }), { status: 500 });
      }

      console.log("Success: Payment processed and bookings stored!");
      return new Response(JSON.stringify({ success: true, message: "Payment processed and bookings stored successfully" }), { status: 200 });
    }

    return new Response(JSON.stringify({ message: "Event received" }), { status: 200 });
  } catch (error) {
    console.log("ERROR: Webhook handler crashed:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};