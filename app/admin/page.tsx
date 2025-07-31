export const dynamic = "force-dynamic";

import { PrismaClient } from "@prisma/client";
import AdminProductsClient from './AdminProductsClient';
import AdminCategoryManager from './AdminCategoriesClient';
import UpcomingOrdersSection from './UpcomingOrdersSection'; // ⬅️ new component
import CollapsibleSection from './CollapsibleSection'; // ⬅️ reusable

const prisma = new PrismaClient();

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ include: { category: true } });
  const categories = await prisma.productCategory.findMany();

  return (
    <div className="space-y-6 px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      <CollapsibleSection title="Upcoming Orders">
        <UpcomingOrdersSection />
      </CollapsibleSection>

      <CollapsibleSection title="Categories">
        <AdminCategoryManager categories={categories} />
      </CollapsibleSection>

      <CollapsibleSection title="Products">
        <AdminProductsClient initialProducts={products} categories={categories} />
      </CollapsibleSection>
    </div>
  );
}