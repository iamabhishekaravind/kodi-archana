import { useState } from 'react';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { Devotee, ContactInfo } from '../types';

interface Step2Props {
  devotees: Devotee[];
  contact: ContactInfo;
  onContactChange: (contact: ContactInfo) => void;
  onBack: () => void;
  onPayment: () => void;
}

const AMOUNT_PER_DEVOTEE = 1;

export function Step2ContactPayment({ devotees, contact, onContactChange, onBack, onPayment }: Step2Props) {
  const [errors, setErrors] = useState<{ mobile?: string; email?: string }>({});

  const totalAmount = devotees.length * AMOUNT_PER_DEVOTEE;

  const validateMobile = (mobile: string) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  };

  // const validateEmail = (email: string) => {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return emailRegex.test(email);
  // };

  const handleMobileChange = (value: string) => {
    onContactChange({ ...contact, mobile: value });
    setErrors(prev => ({ ...prev, mobile: '' }));
  };

  // const handleEmailChange = (value: string) => {
  //   onContactChange({ ...contact, email: value });
  //   setErrors(prev => ({ ...prev, email: '' }));
  // };

  const validate = () => {
    const newErrors: { mobile?: string; email?: string } = {};

    if (!contact.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!validateMobile(contact.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    // if (!contact.email.trim()) {
    //   newErrors.email = 'Email address is required';
    // } else if (!validateEmail(contact.email)) {
    //   newErrors.email = 'Please enter a valid email address';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = () => {
    if (validate()) {
      onPayment();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Step 2: Contact & Payment</h2>

        <div className="space-y-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Summary</h3>
            <div className="space-y-3">
              {devotees.map((devotee) => (
                <div key={devotee.id} className="flex justify-between items-start py-2 border-b border-gray-200 last:border-0">
                  <div>
                    <p className="font-medium text-gray-800">{devotee.name}</p>
                    <p className="text-sm text-gray-600">Nakshatram: {devotee.nakshatra}</p>
                    <p className="text-sm text-gray-600">
  Date: {
    (() => {
      const [dateStr] = devotee.date.split(' - ');
      return new Date(dateStr).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    })()
  }
</p>
                  </div>
                  <p className="font-medium text-gray-700">₹{AMOUNT_PER_DEVOTEE}</p>
                </div>
              ))}
              <div className="flex justify-between items-center pt-3 border-t-2 border-gray-300">
                <p className="text-lg font-bold text-gray-800">Total Amount</p>
                <p className="text-2xl font-bold text-orange-600">₹{totalAmount}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={contact.mobile}
                  onChange={(e) => handleMobileChange(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.mobile ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                />
                {errors.mobile && (
                  <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                )}
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div> */}
            </div>
          </div>
        </div>

        <section>
              <h2 className="text-xl font-semibold text-red-800 mt-8 mb-3">NOTE</h2>
              <p className="mb-4">
                After payment you may take the screenshot of the confirmation page for your reference.
              </p>
            </section>


        <div className="mt-8 flex justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={handlePayment}
            className="flex items-center gap-2 px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
          >
            
            <CreditCard className="w-5 h-5" />
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
