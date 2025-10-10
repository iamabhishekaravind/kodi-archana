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

interface Env {
  RAZORPAY_WEBHOOK_SECRET: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  // SUPER OBVIOUS LOGGING
  console.log("==========================================");
  console.log("🔥🔥🔥 CLOUDFLARE WEBHOOK STARTED 🔥🔥🔥");
  console.log("Time:", new Date().toISOString());
  console.log("==========================================");
  
  try {
    const req = context.request;
    const webhookSecret = context.env.RAZORPAY_WEBHOOK_SECRET;
    const supabaseUrl = context.env.SUPABASE_URL;
    const supabaseKey = context.env.SUPABASE_SERVICE_ROLE_KEY;

    // Debug: Log incoming request details
    console.log("🔍 Webhook received!");
    console.log("🔍 Request method:", req.method);
    console.log("🔍 Webhook secret present:", !!webhookSecret);
    console.log("🔍 Supabase URL present:", !!supabaseUrl);
    console.log("🔍 Supabase Key present:", !!supabaseKey);
    console.log("🔍 Environment keys available:", Object.keys(context.env));

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
      console.log("💰 PAYMENT CAPTURED EVENT - Processing devotees data");
      
      const paymentEntity = payload.payload.payment.entity;
      const notes = paymentEntity.notes;

      console.log("Payment notes:", JSON.stringify(notes, null, 2));

      let devotees: any[] = [];
      try {
        if (notes.devotees) {
          console.log("Raw devotees string:", notes.devotees);
          devotees = JSON.parse(notes.devotees);
          console.log("Parsed devotees:", JSON.stringify(devotees, null, 2));
        } else {
          console.log("ERROR: No devotees found in notes");
          return new Response(JSON.stringify({ error: "No devotees data found" }), { status: 400 });
        }
      } catch (parseError) {
        console.log("ERROR: Failed to parse devotees JSON:", parseError);
        console.log("Raw devotees string that failed:", notes.devotees);
        return new Response(JSON.stringify({ error: "Failed to parse devotees data" }), { status: 400 });
      }

      if (!Array.isArray(devotees) || devotees.length === 0) {
        console.log("ERROR: Devotees is not a valid array or is empty:", devotees);
        return new Response(JSON.stringify({ error: "Invalid devotees data structure" }), { status: 400 });
      }

      console.log("Number of devotees to process:", devotees.length);

      // Validate each devotee has required fields
      const validDevotees = devotees.filter(devotee => {
        const isValid = devotee.n && devotee.s && devotee.d;
        if (!isValid) {
          console.log("Invalid devotee found:", devotee);
        }
        return isValid;
      });

      if (validDevotees.length === 0) {
        console.log("ERROR: No valid devotees found after filtering");
        return new Response(JSON.stringify({ error: "No valid devotees data" }), { status: 400 });
      }

      console.log("Valid devotees count:", validDevotees.length);

      // Supabase insert (use edge client or REST API in Pages Functions)
      const rows = validDevotees.map((devotee: any, index: number) => {
        const row = {
          contact: notes.contactMobile,
          pooja_name: "Kodi Archana",
          pooja_price: 200,
          devotee_name: devotee.n,
          nakshatram: devotee.s,
          pooja_date: devotee.d,
          email: notes.contactEmail,
          payment_id: paymentEntity.id
        };
        console.log(`Row ${index + 1}:`, JSON.stringify(row, null, 2));
        return row;
      });

      console.log("Total rows to insert into Supabase:", rows.length);
      console.log("All rows:", JSON.stringify(rows, null, 2));

      try {
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
        console.log("Supabase response headers:", Object.fromEntries(supabaseResp.headers.entries()));

        const responseText = await supabaseResp.text();
        console.log("Supabase response body:", responseText);

        if (!supabaseResp.ok) {
          console.log("ERROR: Supabase insert failed with status:", supabaseResp.status);
          console.log("ERROR: Supabase error response:", responseText);
          
          // Try to parse error details
          try {
            const errorData = JSON.parse(responseText);
            console.log("Parsed error data:", JSON.stringify(errorData, null, 2));
          } catch (e) {
            console.log("Could not parse error response as JSON");
          }
          
          return new Response(JSON.stringify({ 
            error: "Database insert error", 
            dbError: responseText,
            status: supabaseResp.status
          }), { status: 500 });
        }

        // Try to parse successful response
        try {
          const insertedData = JSON.parse(responseText);
          console.log("Successfully inserted data:", JSON.stringify(insertedData, null, 2));
          console.log("Number of records inserted:", insertedData.length);
        } catch (e) {
          console.log("Could not parse success response as JSON, but operation succeeded");
        }

        console.log("Success: Payment processed and bookings stored!");
        return new Response(JSON.stringify({ 
          success: true, 
          message: "Payment processed and bookings stored successfully",
          recordsInserted: rows.length
        }), { status: 200 });
        
      } catch (networkError) {
        console.log("ERROR: Network error when calling Supabase:", networkError);
        const errorMessage = networkError instanceof Error ? networkError.message : 'Unknown network error';
        return new Response(JSON.stringify({ 
          error: "Network error when inserting data", 
          details: errorMessage 
        }), { status: 500 });
      }
    }

    return new Response(JSON.stringify({ message: "Event received" }), { status: 200 });
  } catch (error) {
    console.log("ERROR: Webhook handler crashed:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};