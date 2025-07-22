import ProductPageClient from './ProductPageClient';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const awaited_params = await params
  return <ProductPageClient slug={awaited_params.slug} />;
}