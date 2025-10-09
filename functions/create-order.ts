type CFContext = {
  request: Request;
  env: Record<string, string>;
};

export const onRequestPost = async (context: CFContext) => {
  try {
    const { amount } = await context.request.json();

    const key_id = context.env.RAZORPAY_KEY_ID as string;
    const key_secret = context.env.RAZORPAY_KEY_SECRET as string;

    if (!key_id || !key_secret) {
      return new Response(JSON.stringify({ error: "Razorpay credentials not set" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const credentials = btoa(`${key_id}:${key_secret}`);

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: amount * 100, // amount in paise
        currency: "INR",
        payment_capture: 1
      })
    });

    const text = await response.text();
    if (!response.ok) {
      return new Response(JSON.stringify({ error: text }), {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(text, {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};