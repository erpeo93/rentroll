export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { PrismaClient, Product, ProductCategory } from "@prisma/client";
import AdminProductsClient from './AdminProductsClient';
import axios from "axios";

const prisma = new PrismaClient();

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany();
  const categories = await prisma.productCategory.findMany();

  return <AdminProductsClient initialProducts={products} categories={categories} />;
}