import { CheckCircle, XCircle, Download } from 'lucide-react';
import { BookingData } from '../types';

interface Step3Props {
  bookingData: BookingData;
  success: boolean;
  onRetry?: () => void;
  onNewBooking: () => void;
}

export function Step3Confirmation({ bookingData, success, onRetry, onNewBooking }: Step3Props) {
  const handlePrint = () => {
    window.print();
  };

  if (!success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Failed</h2>
          <p className="text-gray-600 mb-8">
            We couldn't process your payment. Please try again.
          </p>
          <div className="flex gap-4 justify-center">
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                Retry Payment
              </button>
            )}
            <button
              onClick={onNewBooking}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Start New Booking
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600">Your temple booking has been successfully processed</p>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="bg-orange-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Booking Reference</p>
                <p className="font-bold text-lg text-gray-800">{bookingData.bookingReference}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Payment ID</p>
                <p className="font-mono text-sm text-gray-800">{bookingData.paymentId}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Devotee Details</h3>
            <div className="space-y-4">
              {bookingData.devotees.map((devotee, index) => (
                <div key={devotee.id} className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-gray-800 mb-2">Devotee {index + 1}</p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600">Name</p>
                      <p className="font-medium text-gray-800">{devotee.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Nakshatra</p>
                      <p className="font-medium text-gray-800">{devotee.nakshatra}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Date</p>
                      <p className="font-medium text-gray-800">
                        {new Date(devotee.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Mobile Number</p>
                  <p className="font-medium text-gray-800">{bookingData.contact.mobile}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Email Address</p>
                  <p className="font-medium text-gray-800">{bookingData.contact.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              A confirmation email has been sent to <strong>{bookingData.contact.email}</strong>.
              Please keep this booking reference for your records.
            </p>
          </div>

          <div className="flex gap-4 justify-center print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <Download className="w-5 h-5" />
              Print Receipt
            </button>
            <button
              onClick={onNewBooking}
              className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              Make Another Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
