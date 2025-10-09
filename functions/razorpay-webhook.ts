import { Handler } from '@netlify/functions';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Env variables
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const razorpaySignature =
      event.headers['x-razorpay-signature'] ||
      event.headers['X-Razorpay-Signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('RAZORPAY_WEBHOOK_SECRET not configured');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server configuration error' }),
      };
    }

    const body = event.body || '';
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (razorpaySignature !== expectedSignature) {
      console.error('Invalid signature');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid signature' }),
      };
    }

    const payload = JSON.parse(body);
    const eventType = payload.event;

    if (eventType === 'payment.captured') {
      const paymentEntity = payload.payload.payment.entity;
      const notes = paymentEntity.notes;

      let devotees: any[] = [];
      try {
        devotees = notes.devotees ? JSON.parse(notes.devotees) : [];
      } catch {
        devotees = [];
      }

      console.log("Webhook received");
console.log("Received signature:", razorpaySignature);
console.log("Expected signature:", expectedSignature);
console.log("Payload:", payload);

      // Loop through devotees and insert each row into Supabase
      const rows = devotees.map((devotee: any) => ({
        contact: notes.contactMobile,
        pooja_name: "Kodi Archana", // Or get from notes if needed
        pooja_price: 200,      // Or get from notes if needed
        devotee_name: devotee.name,
        nakshatram: devotee.nakshatra,
        pooja_date: devotee.date,
        email: notes.contactEmail,
        payment_id: paymentEntity.id
      }));

      const { error: dbError } = await supabase
        .from('bookings') // Replace with your table name
        .insert(rows);

      if (dbError) {
        console.error('Supabase insert error:', dbError);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Database insert error' }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: 'Payment processed and bookings stored successfully'
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Event received' }),
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export { handler };