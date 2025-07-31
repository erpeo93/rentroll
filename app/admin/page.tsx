export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { PrismaClient, Product, ProductCategory } from "@prisma/client";
import AdminProductsClient from './AdminProductsClient';
import AdminCategoryManager from './AdminCategoriesClient';
import axios from "axios";

const prisma = new PrismaClient();

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany();
  const categories = await prisma.productCategory.findMany();

    return (
    <div className="space-y-10 px-6 py-10">
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">Categories</h2>
        <AdminCategoryManager categories={categories}/>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Products</h2>
        <AdminProductsClient initialProducts={products} categories={categories} />
      </section>
    </div>
  )
}