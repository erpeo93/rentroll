// If using Node < 18, uncomment this line:
// import fetch from "node-fetch";

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
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };

  const startFormatted = start.toLocaleString("en-US", options);
  const endFormatted = end.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
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
            `<li>${item.name} × ${item.quantity} — €${(
              item.quantity * item.price
            ).toFixed(2)}</li>`
        )
        .join("")}
    </ul>

    <h3>Total: €${total.toFixed(2)}</h3>
  `;

  const host = process.env.MAILTRAP_HOST;
  if (!host) {
    throw new Error("MAILTRAP_HOST is not set in .env");
  }

  const response = await fetch(host, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MAILTRAP_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: {
        email: process.env.SMTP_SENDER,
        name: "RentRoll Orders",
      },
      to: [{ email: to }],
      subject: "Your RentRoll Order Confirmation",
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Mailtrap API error: ${error}`);
  }
}