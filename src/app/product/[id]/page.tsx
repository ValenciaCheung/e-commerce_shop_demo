import ProductClient from './ProductClient';
import { products } from '@/lib/products';

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default function ProductPage() {
  return <ProductClient />;
}
