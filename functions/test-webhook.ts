export const onRequestGet = async () => {
  console.log("🚀 Test endpoint called!");
  return new Response(JSON.stringify({ 
    message: "Webhook endpoint is working!", 
    timestamp: new Date().toISOString() 
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

export const onRequestPost = async (context: any) => {
  console.log("🔥 TEST WEBHOOK CALLED!");
  console.log("Request headers:", Object.fromEntries(context.request.headers.entries()));
  
  const body = await context.request.text();
  console.log("Request body:", body);
  
  return new Response(JSON.stringify({ 
    message: "Test webhook received!", 
    bodyLength: body.length,
    timestamp: new Date().toISOString() 
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};