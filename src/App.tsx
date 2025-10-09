import { useState } from 'react';
import { Step1DevoteeDetails } from './components/Step1DevoteeDetails';
import { Step2ContactPayment } from './components/Step2ContactPayment';
import { Step3Confirmation } from './components/Step3Confirmation';
import { initiateRazorpayPayment } from './utils/razorpay';
import { Devotee, ContactInfo, BookingData } from './types';

function App() {
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
      onSuccess: (paymentId: string) => {
        const bookingReference = `BK${Date.now()}`;
        const finalBookingData: BookingData = {
          ...currentBookingData,
          paymentId,
          bookingReference,
        };
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <header className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-orange-600">Temple Booking</h1>
          <p className="text-gray-600 mt-1">Book your temple visit with ease</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= 1
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  1
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Devotee Details
                </span>
              </div>

              <div className="w-16 h-1 bg-gray-200">
                <div
                  className={`h-full transition-all ${
                    currentStep >= 2 ? 'bg-orange-600' : 'bg-gray-200'
                  }`}
                />
              </div>

              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= 2
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  2
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Contact & Payment
                </span>
              </div>

              <div className="w-16 h-1 bg-gray-200">
                <div
                  className={`h-full transition-all ${
                    currentStep >= 3 ? 'bg-orange-600' : 'bg-gray-200'
                  }`}
                />
              </div>

              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= 3
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  3
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Confirmation
                </span>
              </div>
            </div>
          </div>
        </div>

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

      <footer className="mt-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          Temple Booking System - Secure and Easy Temple Visits
        </div>
      </footer>
    </div>
  );
}

export default App;
