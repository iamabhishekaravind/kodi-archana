import { BookingData } from '../types';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const AMOUNT_PER_DEVOTEE = 200;

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

interface RazorpayOptions {
  bookingData: BookingData;
  onSuccess: (paymentId: string, orderId: string) => void;
  onFailure: () => void;
}

export async function initiateRazorpayPayment({
  bookingData,
  onSuccess,
  onFailure,
}: RazorpayOptions) {
  const res = await loadRazorpayScript();

  if (!res) {
    alert('Razorpay SDK failed to load. Please check your internet connection.');
    return;
  }

  const totalAmount = bookingData.devotees.length * AMOUNT_PER_DEVOTEE;

  // --- Fetch order from backend ---
  const orderResponse = await fetch('/create-order', {
    method: 'POST',
    body: JSON.stringify({ amount: totalAmount }),
    headers: { 'Content-Type': 'application/json' },
  });
  //ok
  const order = await orderResponse.json();

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
    amount: order.amount,
    currency: order.currency,
    name: 'Arsha Dharma Parishad',
    description: `Booking for ${bookingData.devotees.length} devotee(s)`,
    order_id: order.id, // <--- Pass the order id here!
    handler: function (response: any) {
      onSuccess(response.razorpay_payment_id, response.razorpay_order_id || '');
    },
    prefill: {
      email: bookingData.contact.email,
      contact: bookingData.contact.mobile,
    },
    notes: {
      devotees: JSON.stringify(bookingData.devotees),
      contactMobile: bookingData.contact.mobile,
      contactEmail: bookingData.contact.email,
    },
    theme: {
      color: '#EA580C',
    },
    modal: {
      ondismiss: function () {
        onFailure();
      },
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
}