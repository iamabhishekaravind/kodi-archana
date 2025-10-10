function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <header className="bg-white shadow-sm border-b border-orange-100">
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Shipping Policy</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">No Shipping for Pooja Services</h2>
              <p className="mb-4 font-medium text-red-700">
                <b>No shipping on any pooja is entertained, nor do we provide shipping for any temple service. All devotees are requested to collect prasadam, receipts, or any materials directly from the temple premises. There is no provision for courier or postal delivery of any pooja items or documents. Please plan your visit accordingly.</b>
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Service Nature</h2>
              <p className="mb-4">
                Uttara Guruvayurappan Temple provides religious services and not physical products. 
                Therefore, traditional shipping does not apply to our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Service Delivery</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Pooja rituals are performed at the temple premises on the booked Nakshatra day or pooja day</li>

                <li>Devotees are welcome to attend the pooja in person</li>
                <li>The divine blessings are considered to reach devotees regardless of their physical location</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Prasadam (If Applicable)</h2>
              <p className="mb-4">
                If prasadam distribution is offered as part of special programs:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Prasadam collection details will be communicated separately</li>
                <li>Collection is strictly from the temple premises only</li>
                <li>Postal delivery of prasadam is not provided for regular pooja bookings</li>
                <li>Any exception for postal delivery will be clearly communicated in advance for special circumstances</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Contact for Queries</h2>
              <p>
                For any questions regarding service delivery or prasadam collection:
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
export default ShippingPolicy;