import { MapPin, Phone, Mail } from 'lucide-react';

export function ContactUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <header className="bg-white shadow-sm border-b border-orange-100">
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Contact Us</h1>
          <div className="space-y-8">
            <div className="bg-orange-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <MapPin className="w-5 h-5 text-orange-600 mr-2" />
                Temple Address
              </h2>
              <div className="text-gray-700 space-y-2">
                <p className="font-medium">Uttara Guruvayurappan Temple</p>
                <p>Arsha Dharma Parishad (Regd.)</p>
                <p>Sahakrita Marg,Mayur Vihar Pocket-3, New Delhi</p>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Phone className="w-5 h-5 text-blue-600 mr-2" />
                Phone Number
              </h2>
              <div className="text-gray-700 space-y-2">
                <p><strong>Temple Office:</strong> 8368130663</p>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Mail className="w-5 h-5 text-green-600 mr-2" />
                Email Address
              </h2>
              <div className="text-gray-700 space-y-2">
                <p><strong>Email:</strong> uttaraguruvayurappanwhatsapp@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ContactUs;