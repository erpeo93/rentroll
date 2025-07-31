import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '2525'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOrderEmail({
  to,
  items,
  city,
  address,
  phone,
  deliveryStart,
  deliveryEnd,
}: {
  to: string;
  items: { name: string; quantity: number; price: number }[];
  city: string;
  address: string;
  phone: string;
  deliveryStart: Date;
  deliveryEnd: Date;
}) {
  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

const start = new Date(deliveryStart);
const end = new Date(deliveryEnd);

const options: Intl.DateTimeFormatOptions = {
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
};

const startFormatted = start.toLocaleString('en-US', options);
const endFormatted = end.toLocaleString('en-US', {
  hour: 'numeric',
  minute: '2-digit',
});

const deliveryTime = `${startFormatted} – ${endFormatted}`;

  const html = `
    <h2>Here's your Order Recap</h2>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Address:</strong> ${address}, ${city}</p>
    <p><strong>Delivery Window:</strong> ${deliveryTime}</p>

    <h3>Items:</h3>
    <ul>
      ${items
        .map(
          (item) =>
            `<li>${item.name} × ${item.quantity} — €${(item.quantity * item.price).toFixed(2)}</li>`
        )
        .join('')}
    </ul>

    <h3>Total: €${total.toFixed(2)}</h3>
  `;
  
  let from_final = '"RentRoll Orders" <orders@demomailtrap.co>'
  let to_final = "leonardo.lucania@outlook.it"
  to_final = to

  await transporter.sendMail({
    from: from_final,
    to : to_final,
    subject: 'Your RentRoll Order Confirmation',
    html,
  });
}