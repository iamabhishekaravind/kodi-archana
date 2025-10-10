export async function onRequestPost(context: { request: Request; env: any }) {
  console.log("🔥 DIRECT SUPABASE INSERT CALLED");
  
  try {
    const bookingData = await context.request.json();
    console.log("Received booking data:", JSON.stringify(bookingData, null, 2));
    
    const supabaseUrl = context.env.SUPABASE_URL;
    const supabaseKey = context.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.log("Missing Supabase credentials");
      return new Response(JSON.stringify({ error: "Server configuration error" }), { status: 500 });
    }
    
    // Check if payment ID already exists to prevent duplicates
    const paymentId = bookingData.paymentId;
    if (paymentId && paymentId !== "DIRECT_INSERT") {
      console.log("🔍 Checking for existing payment ID:", paymentId);
      
      const checkResp = await fetch(`${supabaseUrl}/rest/v1/bookings?payment_id=eq.${paymentId}&select=payment_id`, {
        headers: {
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`
        }
      });
      
      if (checkResp.ok) {
        const existing = await checkResp.json();
        if (existing.length > 0) {
          console.log("⚠️ Payment ID already exists, skipping insert to prevent duplicates");
          return new Response(JSON.stringify({ 
            message: "Data already exists", 
            paymentId: paymentId 
          }), { status: 200 });
        }
      }
    }
    
    // Process devotees data
    const rows = bookingData.devotees.map((devotee: any) => ({
      contact: bookingData.contact.mobile,
      pooja_name: "Kodi Archana",
      pooja_price: 200,
      devotee_name: devotee.name,
      nakshatram: devotee.nakshatra,
      pooja_date: devotee.date,
      email: bookingData.contact.email || "",
      payment_id: bookingData.paymentId || "DIRECT_INSERT"
    }));
    
    console.log("Rows to insert:", JSON.stringify(rows, null, 2));
    
    // Insert into Supabase
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
    const responseText = await supabaseResp.text();
    console.log("Supabase response:", responseText);
    
    if (!supabaseResp.ok) {
      return new Response(JSON.stringify({ 
        error: "Database insert failed", 
        details: responseText 
      }), { status: 500 });
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: "Data stored successfully",
      recordsInserted: rows.length 
    }), { status: 200 });
    
  } catch (error) {
    console.log("Error:", error);
    return new Response(JSON.stringify({ 
      error: "Server error", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }), { status: 500 });
  }
}