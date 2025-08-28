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

  const startFormatted = start.toLocaleString("it-IT", options);
  const endFormatted = end.toLocaleString("it-IT", {
    hour: "numeric",
    minute: "2-digit",
  });

  const deliveryTime = `${startFormatted} – ${endFormatted}`;

  const html = `
    <h2>Ecco il recap del tuo ordine:</h2>
    <p><strong>Telefono:</strong> ${phone}</p>
    <p><strong>Indirizzo:</strong> ${address}, ${city}</p>
    <p><strong>Consegna:</strong> ${deliveryTime}</p>

    <h3>Articoli:</h3>
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

    <h3>Totale: €${total.toFixed(2)}</h3>
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