import ProductPageClient from './ProductPageClient';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const id = await params
  return <ProductPageClient slug={id.slug} />;
}