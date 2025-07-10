import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const cookieStore = cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return <p style={{ padding: "2rem" }}>🔒 You must be logged in to view this page.</p>;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { holdings: { include: { product: true } } }
  });

  if (!user) {
    return <p>User not found.</p>;
  }

  const heldItems = user.holdings.map((h) => h.product);
  const heldValue = heldItems.reduce((sum, p) => sum + p.value, 0);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>📦 Welcome, {user.name}</h1>

      <h2>🛒 Your Items</h2>
      <ul>
        {heldItems.map((item) => (
          <li key={item.id}>{item.name} (${item.value})</li>
        ))}
      </ul>

      <p>Total value held: <strong>${heldValue}</strong></p>
      <p>Balance: <strong>{user.balance}</strong> credits</p>

      <form method="POST" action="/api/logout" style={{ marginTop: "2rem" }}>
      <button type="submit">🚪 Log Out</button>
      </form>
    </main>
  );
}