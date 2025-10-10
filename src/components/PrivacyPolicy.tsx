function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <header className="bg-white shadow-sm border-b border-orange-100">
       
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Our Non-Profit Commitment</h2>
              <p className="mb-4">
                Uttara Guruvayurappan Temple, managed by Arsha Dharma Parishad (Regd.), is a charitable, non-profit institution dedicated to serving the spiritual and cultural needs of devotees. We respect your privacy and are committed to safeguarding any information you share with us. We do not use your information for marketing, commercial, or profit-driven purposes.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Information We Collect</h2>
              <p className="mb-4">
                When you book Kodi Archana or other services through our portal, we collect only the information essential to complete your booking and perform temple services:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Personal Information:</strong> Devotee names, Nakshatra details</li>
                <li><strong>Contact Information:</strong> Mobile phone numbers for service-related communications</li>
                <li><strong>Payment Information:</strong> Transaction details securely processed through Razorpay</li>
                <li><strong>Technical Information:</strong> Limited data such as IP address and browser type for site security and improvement</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>To perform Kodi Archana rituals and other temple services accurately</li>
                <li>To send booking confirmations and service notifications via Whatsapp (if required)</li>
                <li>To process payments securely and provide receipts</li>
                <li>To improve website functionality and ensure a smooth booking experience</li>
                <li>To comply with regulatory and legal requirements</li>
                <li>To provide support and resolve booking issues for devotees</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Information Sharing</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We do <b>not</b> sell, trade, or rent your personal information to any third party</li>
                <li>Payment information is processed only by authorized providers like Razorpay</li>
                <li>Information is shared with temple staff solely for service delivery</li>
                <li>We only disclose information if compelled by law or legal process</li>
                <li>Anonymous, aggregated data may be used to improve our services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Data Security</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your information is protected by industry-standard security measures and encryption</li>
                <li>Access to personal data is restricted to authorized temple staff</li>
                <li>We conduct regular assessments and updates to safeguard your data</li>
                <li>Data is stored securely and backed up as required</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Data Retention</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We retain personal data only as long as necessary to fulfill your booking and for temple administration</li>
                <li>Payment records are maintained as required by law and accounting standards</li>
                <li>You may request deletion of your data, subject to legal and operational obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Your Rights</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Right to access, correct, or request deletion of your personal information</li>
                <li>Right to opt-out of non-essential communications</li>
                <li>Right to raise concerns or complaints about data handling</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Cookies and Website Analytics</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We use cookies solely to improve website functionality and user experience</li>
                <li>No cookies are used for advertising or tracking for profit</li>
                <li>Basic analytics may be used to understand usage patterns</li>
                <li>You can disable cookies in your browser settings, but essential cookies for booking cannot be disabled</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Third-Party Services</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Payments are processed by Razorpay, which adheres to its own privacy policy</li>
                <li>Website hosting and technical services may involve trusted third-party providers</li>
                <li>We ensure all third-party services uphold strong privacy and security standards</li>
                <li>Links to external websites are governed by their respective privacy policies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Updates to Privacy Policy</h2>
              <p className="mb-4">
                Our privacy practices may be updated from time to time to reflect changes in technology, law, or temple operations. Any changes will be posted here with an updated effective date. We encourage devotees to review this policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Contact Us</h2>
              <p>
                For any privacy-related questions, concerns, or requests, please contact:
              </p>
              <p className="mt-2">
                <strong>UTTARA GURUVAYURAPPAN TEMPLE</strong><br />
                Arsha Dharma Parishad (Regd.)<br />
                Email: uttaraguruvayurappanwhatsapp@gmail.com<br />
                Phone: 8368130663<br />
                Address: Sahakritha Marg, Mayur Vihar Pocket-3, New Delhi
              </p>
            </section>

            <section>
              <p className="text-sm text-gray-600 mt-8">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </section>
          </div>
        </div>
      </main>

      
    </div>
  );
}
export default PrivacyPolicy;