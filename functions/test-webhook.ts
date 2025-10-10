export async function onRequestGet() {
  console.log("🚀 Test endpoint called!");
  return new Response(JSON.stringify({ 
    message: "Cloudflare webhook endpoint is working!", 
    timestamp: new Date().toISOString() 
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}

export async function onRequestPost(context: { request: Request }) {
  console.log("🔥 TEST WEBHOOK CALLED!");
  console.log("Request headers:", Object.fromEntries(context.request.headers.entries()));
  
  const body = await context.request.text();
  console.log("Request body:", body);
  
  return new Response(JSON.stringify({ 
    message: "Test webhook received on Cloudflare!", 
    bodyLength: body.length,
    timestamp: new Date().toISOString() 
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}