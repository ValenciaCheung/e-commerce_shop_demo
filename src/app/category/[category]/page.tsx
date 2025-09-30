import CategoryClient from './CategoryClient';

export function generateStaticParams() {
  return [
    { category: 'men' },
    { category: 'women' },
    { category: 'kids' },
  ];
}

export default function CategoryPage() {
  return <CategoryClient />;
}
