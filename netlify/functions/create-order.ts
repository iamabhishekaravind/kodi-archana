import { Handler } from '@netlify/functions';
import Razorpay from 'razorpay';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const { amount } = JSON.parse(event.body || '{}');

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // amount in paise
      currency: 'INR',
      payment_capture: true, // <-- correct, and does the same thing!
    });

    return {
      statusCode: 200,
      body: JSON.stringify(order),
    };
  } catch (error) {
  let errorMessage = "Unknown error";
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  }
  return {
    statusCode: 500,
    body: JSON.stringify({ error: errorMessage }),
  };
}
}

export { handler };