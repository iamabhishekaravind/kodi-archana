export async function onRequestPost(context) {
  const { to, payment_id, devotees, service = "Kodi Archana" } = await context.request.json();
  const RESEND_API_KEY = context.env.RESEND_API_KEY;

  const guests = devotees.length;

  // Generate HTML table for devotees
  const devoteeTableRows = devotees.map((d, i) => 
    `<tr>
      <td>${i + 1}</td>
      <td>${d.name}</td>
      <td>${d.nakshatra}</td>
      <td>${new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
    </tr>`
  ).join('');

  const html = `
    <h2>Temple Booking Confirmation</h2>
    <h5>Om Namo Narayanaya</h5>
    <p>Dear Devotee,</p>
    <p>Thank you for your booking at our temple. Here are your booking details:</p>
    <p>Pooja: <b>${service}</b></p>
    <p>Number of Devotees: <b>${guests}</b></p>
    <p>Payment Reference: <b>${payment_id}</b></p>
    <table border="1" cellpadding="6">
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Nakshatra</th>
        <th>Date</th>
      </tr>
      ${devoteeTableRows}
    </table>
    <p>Thank you for booking. We look forward to your visit!</p>
    <p>Online Booking System by Arthakshetram Inc.</p>
  `;

  const subject = `Booking Confirmation – Payment ID: ${payment_id} | Uttara Guruvayurappan Temple`;
  const text = `Booking Confirmation\nPooja: ${service}\nNumber of Devotees: ${guests}\nPayment Reference: ${payment_id}\n${devotees.map((d, i) => `${i+1}. ${d.name}, ${d.nakshatra}, ${d.date}`).join('\n')}`;

  // Send email via Resend
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      to,
      from: 'noreply@mail.arshadharmaparishad.org', // Use your verified sender email
      subject,
      text,
      html
    })
  });

  return new Response("Confirmation email sent!", { status: 200 });
}