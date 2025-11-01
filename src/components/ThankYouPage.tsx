import { Link } from 'react-router-dom';

export function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          {/* Thank You Logo */}
          <div className="mx-auto w-32 h-32 mb-8 flex items-center justify-center">
            <img 
              src="/logo.png" 
              alt="Uttara Guruvayurappan Temple Logo" 
              className="w-50 h-50 object-contain"
            />
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            കോടി അർച്ചന സമാപ്തം
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-orange-600 mb-8">
            Kodi Archana Event Completed
          </h2>

          {/* Thank You Message */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="text-lg text-gray-700 leading-relaxed">
              <p>
                We express our deepest gratitude to all the devotees who participated in the 
                <span className="font-semibold text-orange-600"> Kodi Archana </span>
                event at Uttara Guruvayurappan Temple. The sacred Kodi Archana ritual has been successfully completed, 
                and all registered devotees' names have been included in the archana. Prayers have been offered for 
                the well-being of all participants, and the divine blessings of Lord Guruvayurappan are with everyone. </p>
                <p className="text-gray-600 italic mt-2">
                May Lord Guruvayurappan's blessings be with you always.
              </p>
              <p className="text-gray-600 italic mt-2">
                ഗുരുവായൂരപ്പന്റെ അനുഗ്രഹം എപ്പോഴും നിങ്ങളോടൊപ്പം ഉണ്ടാകട്ടെ.
              </p>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="font-semibold text-gray-800">
                  With Best Regards,<br />
                  Managing Committee<br />
                  Arsha Dharma Parishad
                </p>
                <p className="mt-4 text-sm font-semibold text-gray-800">
                  & Official Technology Partner - Arthakshetram
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className=" rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              For any queries | എന്തെങ്കിലും സംശയങ്ങൾക്ക്
            </h4>
            <Link 
              to="/contact-us" 
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Us
            </Link>
          </div>
        </div>
      </main>

     
    </div>
  );
}