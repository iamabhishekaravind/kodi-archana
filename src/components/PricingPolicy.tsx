function PricingPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <header className="bg-white shadow-sm border-b border-orange-100">
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Pricing Policy</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Non-Profit Nature</h2>
              <p className="mb-4">
                Uttara Guruvayurappan Temple is managed by Arsha Dharma Parishad (Regd.), a non-profit religious and charitable organization. All fees and contributions received for Kodi Archana and other temple services are strictly used for the sustenance of temple operations, conducting rituals, priest honorarium, temple maintenance, and community welfare activities. <b>No part of the fee is intended for profit or commercial gain.</b>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Kodi Archana Service Fee</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Per Devotee:</strong> ₹200 (Indian Rupees Two Hundred Only)</li>
                <li>This nominal fee covers the complete Kodi Archana ritual for one devotee on their designated Nakshatra day, including puja materials and priest service.</li>
                <li>No additional or hidden charges are levied. The fee is kept minimal to ensure accessibility to all devotees.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Purpose of Service Fee</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>To facilitate the smooth conduct of rituals and ceremonies</li>
                <li>To support the upkeep and maintenance of temple premises</li>
                <li>To enable provision of amenities for devotees and sustain charitable initiatives</li>
                <li>To honor the priests and staff who dedicate themselves to religious service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Payment Terms</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Payment must be made in full at the time of booking</li>
                <li>All payments are processed securely through Razorpay</li>
                <li>Accepted payment methods include UPI, credit cards, debit cards, and net banking</li>
                <li>Payment confirmation is required to secure your booking slot</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Transparency & Accessibility</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>The fee structure is transparent and standardized for all devotees</li>
                <li>Financial records are maintained with integrity in accordance with charitable trust regulations</li>
                <li>If any devotee faces financial hardship, they may approach the temple administration for assistance or concessions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Multiple Bookings</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Multiple devotees can be booked in a single transaction</li>
                <li>Each additional devotee will be charged ₹200</li>
                <li>Family bookings are welcome and encouraged</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Contact Information</h2>
              <p>
                For any questions or concerns regarding pricing, concessions, or charitable donations, please contact:
              </p>
              <p className="mt-2">
                <strong>Uttara Guruvayurappan Temple</strong><br />
                Arsha Dharma Parishad (Regd.)<br />
                Email: uttaraguruvayurappanwhatsapp@gmail.com<br />
                Phone: 8368130663
              </p>
            </section>
          </div>
        </div>
      </main>

    </div>
  );
}
export default PricingPolicy;