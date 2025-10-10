import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Step1DevoteeDetails } from './components/Step1DevoteeDetails';
import { Step2ContactPayment } from './components/Step2ContactPayment';
import { Step3Confirmation } from './components/Step3Confirmation';
import { initiateRazorpayPayment } from './utils/razorpay';
import { Devotee, ContactInfo, BookingData } from './types';

// Import your policy pages as default exports
import PricingPolicy from './components/PricingPolicy';
import ShippingPolicy from './components/ShippingPolicy';
import PrivacyPolicy from './components/PrivacyPolicy';
import CancellationRefundPolicy from './components/CancellationRefundPolicy';
import TermsAndConditions from './components/TermsAndConditions';
import ContactUs from './components/ContactUs';

function BookingFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [devotees, setDevotees] = useState<Devotee[]>([
    {
      id: crypto.randomUUID(),
      name: '',
      nakshatra: '',
      date: '',
    },
  ]);
  const [contact, setContact] = useState<ContactInfo>({
    mobile: '',
    email: '',
  });
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePayment = async () => {
    const currentBookingData: BookingData = {
      devotees,
      contact,
    };

    initiateRazorpayPayment({
      bookingData: currentBookingData,
      onSuccess: async (paymentId: string) => {
        const bookingReference = `BK${Date.now()}`;
        const finalBookingData: BookingData = {
          ...currentBookingData,
          paymentId,
          bookingReference,
        };
        
        // Store data directly as backup
        try {
          console.log("🔄 Storing booking data directly...");
          const response = await fetch('/store-booking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalBookingData)
          });
          
          if (response.ok) {
            console.log("✅ Booking data stored successfully via direct call");
          } else {
            console.log("❌ Direct storage failed:", await response.text());
          }
        } catch (error) {
          console.log("❌ Direct storage error:", error);
        }
        
        setBookingData(finalBookingData);
        setPaymentSuccess(true);
        setCurrentStep(3);
      },
      onFailure: () => {
        const finalBookingData: BookingData = {
          ...currentBookingData,
          paymentId: 'FAILED',
          bookingReference: '',
        };
        setBookingData(finalBookingData);
        setPaymentSuccess(false);
        setCurrentStep(3);
      },
    });
  };

  const handleNewBooking = () => {
    setCurrentStep(1);
    setDevotees([
      {
        id: crypto.randomUUID(),
        name: '',
        nakshatra: '',
        date: '',
      },
    ]);
    setContact({
      mobile: '',
      email: '',
    });
    setBookingData(null);
    setPaymentSuccess(false);
  };

  const handleRetry = () => {
    setCurrentStep(2);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {currentStep === 1 && (
        <Step1DevoteeDetails
          devotees={devotees}
          onDeveoteesChange={setDevotees}
          onNext={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 2 && (
        <Step2ContactPayment
          devotees={devotees}
          contact={contact}
          onContactChange={setContact}
          onBack={() => setCurrentStep(1)}
          onPayment={handlePayment}
        />
      )}

      {currentStep === 3 && bookingData && (
        <Step3Confirmation
          bookingData={bookingData}
          success={paymentSuccess}
          onRetry={handleRetry}
          onNewBooking={handleNewBooking}
        />
      )}
    </main>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <header className="bg-white shadow-sm border-b border-orange-100">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-1xl font-bold text-black-600">UTTARA GURUVAYURAPPAN TEMPLE</h1>
            <h6 className="text-1xl font-bold text-black-600">ഉത്തര ഗുരുവായൂരപ്പൻ ക്ഷേത്രം</h6>
            <p className="text-gray-600 mt-1 font-medium">ARSHA DHARMA PARISHAD (REGD.)</p>
            <p className="text-orange-600 mt-1 font-bold">
              KODI ARCHANA BOOKING PORTAL | കോടി അർച്ചന ബുക്കിംഗ് പോർട്ടൽ
            </p>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<BookingFlow />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/pricing-policy" element={<PricingPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/cancellation-refund-policy" element={<CancellationRefundPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        </Routes>

        <footer className="mt-16 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600 text-sm font-medium">
            UTTARA GURUVAYURAPPAN TEMPLE - ARSHA DHARMA PARISHAD (REGD.) | Online Booking System by Arthakshetram Inc.
          </div>
          <div className="max-w-7xl mx-auto px-4 py-2 text-center text-gray-400 text-xs">
            &copy; {new Date().getFullYear()} All rights reserved. |
            <Link to="/contact-us" className="text-blue-600 hover:underline mx-2">Contact Us</Link> |
            <Link to="/pricing-policy" className="text-blue-600 hover:underline mx-2">Pricing Policy</Link> |
            <Link to="/shipping-policy" className="text-blue-600 hover:underline mx-2">Shipping Policy</Link> |
            <Link to="/privacy-policy" className="text-blue-600 hover:underline mx-2">Privacy Policy</Link> |
            <Link to="/terms-and-conditions" className="text-blue-600 hover:underline mx-2">Terms and Conditions</Link> |
            <Link to="/cancellation-refund-policy" className="text-blue-600 hover:underline mx-2">Cancellation/Refund Policy</Link>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;