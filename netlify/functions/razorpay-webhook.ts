import { Handler } from '@netlify/functions';
import crypto from 'crypto';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const razorpaySignature = event.headers['x-razorpay-signature'];
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
      const paymentId = paymentEntity.id;
      const notes = paymentEntity.notes;

      const devotees = JSON.parse(notes.devotees || '[]');
      const contactMobile = notes.contactMobile;
      const contactEmail = notes.contactEmail;

      const bookingReference = `BK${Date.now()}`;

      console.log('Payment captured:', {
        paymentId,
        bookingReference,
        devotees,
        contactMobile,
        contactEmail,
      });

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: 'Payment processed successfully',
          bookingReference,
          paymentId,
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
