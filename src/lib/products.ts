import { Product } from './types';

export const products: Product[] = [
  {
    id: 'nike-react-infinity-run-flyknit',
    name: 'Nike React Infinity Run Flyknit',
    description: 'A revolutionary running shoe designed to help reduce injury and keep you on the run. More foam and improved upper design provide a secure and cushioned feel.',
    price: 543.00,
    originalPrice: 600.00,
    category: 'women',
    brand: 'Nike',
    images: [
      'https://ext.same-assets.com/1344025563/138750364.png',
      'https://ext.same-assets.com/1344025563/138750364.png',
      'https://ext.same-assets.com/1344025563/138750364.png',
    ],
    sizes: [
      { size: '6', inStock: true, quantity: 15 },
      { size: '6.5', inStock: true, quantity: 12 },
      { size: '7', inStock: true, quantity: 20 },
      { size: '7.5', inStock: true, quantity: 18 },
      { size: '8', inStock: true, quantity: 25 },
      { size: '8.5', inStock: true, quantity: 22 },
      { size: '9', inStock: true, quantity: 19 },
      { size: '9.5', inStock: false, quantity: 0 },
      { size: '10', inStock: true, quantity: 8 },
    ],
    colors: [
      {
        name: 'Pink/White',
        hex: '#FFC0CB',
        images: ['https://ext.same-assets.com/1344025563/138750364.png'],
      },
      {
        name: 'Black/White',
        hex: '#000000',
        images: ['https://ext.same-assets.com/1344025563/138750364.png'],
      },
    ],
    inStock: true,
    rating: 4.5,
    reviewCount: 127,
    featured: true,
  },
  {
    id: 'nike-court-vision-low',
    name: 'Nike Court Vision Low',
    description: 'The Nike Court Vision Low brings a retro basketball look to your everyday style. The upper ages gracefully with a classic vintage aesthetic.',
    price: 904.00,
    category: 'women',
    brand: 'Nike',
    images: [
      'https://ext.same-assets.com/1344025563/1430403166.png',
      'https://ext.same-assets.com/1344025563/1430403166.png',
      'https://ext.same-assets.com/1344025563/1430403166.png',
    ],
    sizes: [
      { size: '5', inStock: true, quantity: 10 },
      { size: '5.5', inStock: true, quantity: 15 },
      { size: '6', inStock: true, quantity: 20 },
      { size: '6.5', inStock: true, quantity: 18 },
      { size: '7', inStock: true, quantity: 25 },
      { size: '7.5', inStock: true, quantity: 22 },
      { size: '8', inStock: true, quantity: 19 },
      { size: '8.5', inStock: true, quantity: 16 },
      { size: '9', inStock: true, quantity: 12 },
    ],
    colors: [
      {
        name: 'White/Pink',
        hex: '#FFFFFF',
        images: ['https://ext.same-assets.com/1344025563/1430403166.png'],
      },
    ],
    inStock: true,
    rating: 4.2,
    reviewCount: 89,
    featured: true,
  },
  {
    id: 'nike-zoom-fly',
    name: 'Nike Zoom Fly',
    description: 'The Nike Zoom Fly features a carbon fiber plate that delivers a snappy sensation with every step, helping push you through your run.',
    price: 930.00,
    category: 'men',
    brand: 'Nike',
    images: [
      'https://ext.same-assets.com/1344025563/4045920306.png',
      'https://ext.same-assets.com/1344025563/4045920306.png',
      'https://ext.same-assets.com/1344025563/4045920306.png',
    ],
    sizes: [
      { size: '7', inStock: true, quantity: 12 },
      { size: '7.5', inStock: true, quantity: 15 },
      { size: '8', inStock: true, quantity: 20 },
      { size: '8.5', inStock: true, quantity: 18 },
      { size: '9', inStock: true, quantity: 25 },
      { size: '9.5', inStock: true, quantity: 22 },
      { size: '10', inStock: true, quantity: 19 },
      { size: '10.5', inStock: true, quantity: 16 },
      { size: '11', inStock: true, quantity: 14 },
      { size: '11.5', inStock: false, quantity: 0 },
      { size: '12', inStock: true, quantity: 8 },
    ],
    colors: [
      {
        name: 'Blue/White',
        hex: '#0056B3',
        images: ['https://ext.same-assets.com/1344025563/4045920306.png'],
      },
    ],
    inStock: true,
    rating: 4.7,
    reviewCount: 156,
    featured: true,
  },
  {
    id: 'nike-air-zoom-pegasus-35',
    name: 'Nike Air Zoom Pegasus 35',
    description: 'A classic running shoe with responsive cushioning and a secure fit. The updated Zoom Air unit provides even more responsiveness.',
    price: 411.00,
    category: 'men',
    brand: 'Nike',
    images: [
      'https://ext.same-assets.com/1344025563/2360044298.png',
      'https://ext.same-assets.com/1344025563/3668743745.png',
      'https://ext.same-assets.com/1344025563/1004855177.png',
    ],
    sizes: [
      { size: '7', inStock: true, quantity: 18 },
      { size: '8', inStock: true, quantity: 25 },
      { size: '9', inStock: true, quantity: 28 },
      { size: '10', inStock: true, quantity: 21 },
      { size: '11', inStock: true, quantity: 15 },
      { size: '12', inStock: true, quantity: 10 },
    ],
    colors: [
      { name: 'Green', hex: '#2e6779', images: ['https://ext.same-assets.com/1344025563/2360044298.png'] },
    ],
    inStock: true,
    rating: 4.4,
    reviewCount: 203,
    featured: true,
  },
  {
    id: 'nike-blazer-mid-women',
    name: 'Nike Blazer Mid 77 Vintage',
    description: 'The Nike Blazer Mid 77 Vintage returns with a throwback look that celebrates basketball heritage.',
    price: 675.00,
    category: 'women',
    brand: 'Nike',
    images: [
      'https://ext.same-assets.com/1344025563/1430403166.png',
    ],
    sizes: [
      { size: '5', inStock: true, quantity: 12 },
      { size: '5.5', inStock: true, quantity: 15 },
      { size: '6', inStock: true, quantity: 18 },
      { size: '6.5', inStock: true, quantity: 20 },
      { size: '7', inStock: true, quantity: 22 },
      { size: '7.5', inStock: true, quantity: 25 },
      { size: '8', inStock: true, quantity: 19 },
      { size: '8.5', inStock: true, quantity: 16 },
      { size: '9', inStock: true, quantity: 14 },
      { size: '9.5', inStock: false, quantity: 0 },
      { size: '10', inStock: true, quantity: 8 },
    ],
    colors: [
      {
        name: 'White/Black',
        hex: '#FFFFFF',
        images: ['https://ext.same-assets.com/1344025563/1430403166.png'],
      },
    ],
    inStock: true,
    rating: 4.3,
    reviewCount: 67,
    featured: false,
  },
  {
    id: 'coated-glitter-chuck-taylor-all-star-kids',
    name: 'Coated glitter chuck taylor all star',
    description: 'Classic Converse Chuck Taylor for kids with a fun coated glitter finish. Durable canvas upper with rubber toe cap and vulcanized sole built for everyday play.',
    price: 261.0,
    category: 'kids',
    brand: 'Converse',
    images: [
      'https://ext.same-assets.com/1344025563/1956999785.png',
      'https://ext.same-assets.com/1344025563/3217236697.png',
      'https://ext.same-assets.com/1344025563/3500320635.png',
    ],
    sizes: [
      { size: '10C', inStock: true, quantity: 12 },
      { size: '11C', inStock: true, quantity: 14 },
      { size: '12C', inStock: true, quantity: 10 },
      { size: '13C', inStock: true, quantity: 8 },
      { size: '1Y', inStock: true, quantity: 16 },
      { size: '2Y', inStock: true, quantity: 12 },
      { size: '3Y', inStock: true, quantity: 9 },
    ],
    colors: [
      { name: 'Pink Glitter', hex: '#FFB6C1', images: ['https://ext.same-assets.com/1344025563/1956999785.png'] },
    ],
    inStock: true,
    rating: 4.6,
    reviewCount: 48,
    featured: false,
  },
  {
    id: 'chuck-taylor-all-star-kids',
    name: 'Chuck taylor all star',
    description: 'The timeless Converse Chuck Taylor All Star scaled for kids. Iconic style with comfortable cushioning and flexible outsole for growing feet.',
    price: 504.0,
    category: 'kids',
    brand: 'Converse',
    images: [
      'https://ext.same-assets.com/1344025563/4075934146.png',
      'https://ext.same-assets.com/1344025563/3623624108.png',
      'https://ext.same-assets.com/1344025563/2066644734.png',
    ],
    sizes: [
      { size: '10C', inStock: true, quantity: 10 },
      { size: '11C', inStock: true, quantity: 12 },
      { size: '12C', inStock: true, quantity: 14 },
      { size: '13C', inStock: true, quantity: 10 },
      { size: '1Y', inStock: true, quantity: 18 },
      { size: '2Y', inStock: true, quantity: 12 },
      { size: '3Y', inStock: true, quantity: 7 },
    ],
    colors: [
      { name: 'White/Black', hex: '#FFFFFF', images: ['https://ext.same-assets.com/1344025563/4075934146.png'] },
    ],
    inStock: true,
    rating: 4.4,
    reviewCount: 72,
    featured: false,
  },
  {
    id: 'continental-80-shoes-kids',
    name: 'Continental 80 shoes',
    description: 'A retro-inspired adidas kids sneaker with lightweight cushioning and flexible rubber sole for all-day comfort.',
    price: 126.0,
    category: 'kids',
    brand: 'Adidas',
    images: [
      'https://ext.same-assets.com/1344025563/3458390492.png',
      'https://ext.same-assets.com/1344025563/3159498973.png',
      'https://ext.same-assets.com/1344025563/296156849.png',
    ],
    sizes: [
      { size: '10C', inStock: true, quantity: 15 },
      { size: '11C', inStock: true, quantity: 12 },
      { size: '12C', inStock: true, quantity: 16 },
      { size: '13C', inStock: true, quantity: 11 },
      { size: '1Y', inStock: true, quantity: 14 },
      { size: '2Y', inStock: true, quantity: 9 },
      { size: '3Y', inStock: true, quantity: 6 },
    ],
    colors: [
      { name: 'White/Red', hex: '#FFFFFF', images: ['https://ext.same-assets.com/1344025563/3458390492.png'] },
    ],
    inStock: true,
    rating: 4.3,
    reviewCount: 33,
    featured: false,
  },
  {
    id: 'swift-run-x-shoes-kids',
    name: 'Swift run x shoes',
    description: 'adidas Swift Run X for kids brings a sleek profile and breathable mesh upper. An everyday sneaker made for playground adventures.',
    price: 337.0,
    category: 'kids',
    brand: 'Adidas',
    images: [
      'https://ext.same-assets.com/1344025563/4272649124.png',
      'https://ext.same-assets.com/1344025563/3099150499.png',
      'https://ext.same-assets.com/1344025563/360803368.png',
      'https://ext.same-assets.com/1344025563/116470950.png',
      'https://ext.same-assets.com/1344025563/2267473490.png',
    ],
    sizes: [
      { size: '10C', inStock: true, quantity: 9 },
      { size: '11C', inStock: true, quantity: 13 },
      { size: '12C', inStock: true, quantity: 12 },
      { size: '13C', inStock: true, quantity: 10 },
      { size: '1Y', inStock: true, quantity: 12 },
      { size: '2Y', inStock: true, quantity: 8 },
      { size: '3Y', inStock: true, quantity: 5 },
    ],
    colors: [
      { name: 'Black/White', hex: '#000000', images: ['https://ext.same-assets.com/1344025563/4272649124.png'] },
    ],
    inStock: true,
    rating: 4.5,
    reviewCount: 41,
    featured: false,
  },
  {
    id: 'nmd-r1-shoes-kids',
    name: 'Nmd_r1 shoes',
    description: 'The iconic adidas NMD_R1 adapted for kids. Soft cushioning and a snug fit make it a go-to sneaker for style and comfort.',
    price: 537.0,
    category: 'kids',
    brand: 'Adidas',
    images: [
      'https://ext.same-assets.com/1344025563/1580944320.png',
      'https://ext.same-assets.com/1344025563/361401328.png',
      'https://ext.same-assets.com/1344025563/2469848901.png',
      'https://ext.same-assets.com/1344025563/3641086592.png',
      'https://ext.same-assets.com/1344025563/1383912388.png',
    ],
    sizes: [
      { size: '10C', inStock: true, quantity: 7 },
      { size: '11C', inStock: true, quantity: 9 },
      { size: '12C', inStock: true, quantity: 11 },
      { size: '13C', inStock: true, quantity: 10 },
      { size: '1Y', inStock: true, quantity: 12 },
      { size: '2Y', inStock: true, quantity: 7 },
      { size: '3Y', inStock: true, quantity: 4 },
    ],
    colors: [
      { name: 'Core Black', hex: '#111111', images: ['https://ext.same-assets.com/1344025563/1580944320.png'] },
    ],
    inStock: true,
    rating: 4.7,
    reviewCount: 58,
    featured: false,
  },
  {
    id: 'nike-air-zoom-pegasus-35-500',
    name: 'Nike Air Zoom Pegasus 35',
    description: 'Nike Air Zoom Pegasus 35 men\'s running shoe variant with premium cushioning and responsive feel.',
    price: 500.00,
    category: 'men',
    brand: 'Nike',
    images: [
      'https://ext.same-assets.com/1344025563/3199660944.png',
      'https://ext.same-assets.com/1344025563/1115866987.png',
    ],
    sizes: [
      { size: '7', inStock: true, quantity: 12 },
      { size: '8', inStock: true, quantity: 20 },
      { size: '9', inStock: true, quantity: 22 },
      { size: '10', inStock: true, quantity: 19 },
      { size: '11', inStock: true, quantity: 14 },
      { size: '12', inStock: true, quantity: 8 },
    ],
    colors: [
      { name: 'Red', hex: '#e4353c', images: ['https://ext.same-assets.com/1344025563/3199660944.png'] },
    ],
    inStock: true,
    rating: 4.5,
    reviewCount: 120,
    featured: false,
  },
  {
    id: 'seasonal-color-chuck-70-men',
    name: 'Seasonal color chuck 70',
    description: 'Converse Chuck 70 with seasonal colorway for men, combining vintage style and modern comfort.',
    price: 169.00,
    category: 'men',
    brand: 'Converse',
    images: [
      'https://ext.same-assets.com/1344025563/2060215834.png',
      'https://ext.same-assets.com/1344025563/410207138.png',
      'https://ext.same-assets.com/1344025563/3476353857.png',
    ],
    sizes: [
      { size: '7', inStock: true, quantity: 10 },
      { size: '8', inStock: true, quantity: 15 },
      { size: '9', inStock: true, quantity: 18 },
      { size: '10', inStock: true, quantity: 14 },
      { size: '11', inStock: true, quantity: 9 },
      { size: '12', inStock: true, quantity: 6 },
    ],
    colors: [
      { name: 'Blue', hex: '#313e5f', images: ['https://ext.same-assets.com/1344025563/2060215834.png'] },
    ],
    inStock: true,
    rating: 4.3,
    reviewCount: 67,
    featured: false,
  },
  {
    id: 'hacked-fashion-chuck-taylor-all-star-men',
    name: 'Hacked fashion chuck taylor all star',
    description: 'Converse Hacked Fashion Chuck Taylor All Star for men with bold styling and durable construction.',
    price: 802.00,
    category: 'men',
    brand: 'Converse',
    images: [
      'https://ext.same-assets.com/1344025563/2768905687.png',
      'https://ext.same-assets.com/1344025563/4170658665.png',
    ],
    sizes: [
      { size: '7', inStock: true, quantity: 8 },
      { size: '8', inStock: true, quantity: 12 },
      { size: '9', inStock: true, quantity: 10 },
      { size: '10', inStock: true, quantity: 9 },
      { size: '11', inStock: true, quantity: 7 },
      { size: '12', inStock: true, quantity: 5 },
    ],
    colors: [
      { name: 'Blue', hex: '#395f6d', images: ['https://ext.same-assets.com/1344025563/2768905687.png'] },
    ],
    inStock: true,
    rating: 4.6,
    reviewCount: 54,
    featured: false,
  },
  {
    id: 'nizza-trefoil-shoes-men',
    name: 'Nizza trefoil shoes',
    description: 'adidas Nizza Trefoil men\'s shoes with retro canvas construction and trefoil details.',
    price: 198.00,
    category: 'men',
    brand: 'Adidas',
    images: [
      'https://ext.same-assets.com/1344025563/2000185964.png',
      'https://ext.same-assets.com/1344025563/2398685150.png',
      'https://ext.same-assets.com/1344025563/3775004854.png',
    ],
    sizes: [
      { size: '7', inStock: true, quantity: 15 },
      { size: '8', inStock: true, quantity: 18 },
      { size: '9', inStock: true, quantity: 16 },
      { size: '10', inStock: true, quantity: 14 },
      { size: '11', inStock: true, quantity: 10 },
      { size: '12', inStock: true, quantity: 8 },
    ],
    colors: [
      { name: 'White', hex: '#FFFFFF', images: ['https://ext.same-assets.com/1344025563/2000185964.png'] },
    ],
    inStock: true,
    rating: 4.2,
    reviewCount: 39,
    featured: false,
  },
  {
    id: 'strutter-shoes-men',
    name: 'Strutter shoes',
    description: 'adidas Strutter men\'s shoes with robust profile and cushioned midsole for daily wear.',
    price: 384.00,
    category: 'men',
    brand: 'Adidas',
    images: [
      'https://ext.same-assets.com/1344025563/533731769.png',
      'https://ext.same-assets.com/1344025563/123536427.png',
      'https://ext.same-assets.com/1344025563/3769167113.png',
    ],
    sizes: [
      { size: '7', inStock: true, quantity: 11 },
      { size: '8', inStock: true, quantity: 15 },
      { size: '9', inStock: true, quantity: 17 },
      { size: '10', inStock: true, quantity: 13 },
      { size: '11', inStock: true, quantity: 9 },
      { size: '12', inStock: true, quantity: 6 },
    ],
    colors: [
      { name: 'White', hex: '#FFFFFF', images: ['https://ext.same-assets.com/1344025563/533731769.png'] },
    ],
    inStock: true,
    rating: 4.3,
    reviewCount: 46,
    featured: false,
  },
  {
    id: 'nike-revolution-5-women',
    name: 'Nike revolution 5',
    description: 'Lightweight women\'s running shoe with soft foam cushioning for a smooth, stable ride.',
    price: 255.00,
    category: 'women',
    brand: 'Nike',
    images: [
      'https://ext.same-assets.com/1344025563/3137938000.png',
      'https://ext.same-assets.com/1344025563/1777574711.png'
    ],
    sizes: [
      { size: 'S', inStock: true, quantity: 20 },
      { size: 'M', inStock: true, quantity: 18 },
      { size: 'X', inStock: true, quantity: 12 },
    ],
    colors: [
      { name: 'Purple', hex: '#6B21A8', images: ['https://ext.same-assets.com/1344025563/3137938000.png'] },
      { name: 'Brown', hex: '#8B4513', images: ['https://ext.same-assets.com/1344025563/1777574711.png'] },
    ],
    inStock: true,
    rating: 4.4,
    reviewCount: 72,
    featured: false,
  },
  {
    id: 'nike-odyssey-react-flyknit-2-women',
    name: 'Nike odyssey react flyknit 2',
    description: 'Responsive React foam and breathable Flyknit upper combine for a snug, smooth run.',
    price: 857.00,
    category: 'women',
    brand: 'Nike',
    images: [
      'https://ext.same-assets.com/1344025563/2091147991.png',
      'https://ext.same-assets.com/1344025563/2143910598.png',
      'https://ext.same-assets.com/1344025563/2866795182.png'
    ],
    sizes: [
      { size: 'S', inStock: true, quantity: 16 },
      { size: 'XL', inStock: true, quantity: 10 },
    ],
    colors: [
      { name: 'Pink', hex: '#FFC0CB', images: ['https://ext.same-assets.com/1344025563/2091147991.png'] },
      { name: 'Blue', hex: '#1E3A8A', images: ['https://ext.same-assets.com/1344025563/2143910598.png'] },
      { name: 'Black', hex: '#111111', images: ['https://ext.same-assets.com/1344025563/2866795182.png'] },
    ],
    inStock: true,
    rating: 4.5,
    reviewCount: 63,
    featured: false,
  },
  {
    id: 'nike-drop-type-premium-women',
    name: 'Nike drop-type premium',
    description: 'Court-inspired profile with premium materials for everyday comfort and style.',
    price: 874.00,
    category: 'women',
    brand: 'Nike',
    images: [
      'https://ext.same-assets.com/1344025563/752610448.png',
      'https://ext.same-assets.com/1344025563/3408456045.png',
      'https://ext.same-assets.com/1344025563/3196967333.png'
    ],
    sizes: [
      { size: 'L', inStock: true, quantity: 14 },
      { size: 'S', inStock: true, quantity: 18 },
    ],
    colors: [
      { name: 'White', hex: '#FFFFFF', images: ['https://ext.same-assets.com/1344025563/752610448.png'] },
      { name: 'Black', hex: '#000000', images: ['https://ext.same-assets.com/1344025563/3196967333.png'] },
    ],
    inStock: true,
    rating: 4.2,
    reviewCount: 41,
    featured: false,
  },
  {
    id: 'nike-air-presto-by-you-women',
    name: 'Nike air presto by you',
    description: 'Customizable comfort with a stretchy upper and plush foam cushioning.',
    price: 605.00,
    category: 'women',
    brand: 'Nike',
    images: [
      'https://ext.same-assets.com/1344025563/2547150195.png',
      'https://ext.same-assets.com/1344025563/3370663784.png',
      'https://ext.same-assets.com/1344025563/4038461235.png'
    ],
    sizes: [
      { size: 'M', inStock: true, quantity: 20 },
      { size: 'L', inStock: true, quantity: 16 },
    ],
    colors: [
      { name: 'Green', hex: '#2E7D32', images: ['https://ext.same-assets.com/1344025563/2547150195.png'] },
      { name: 'White', hex: '#FFFFFF', images: ['https://ext.same-assets.com/1344025563/3370663784.png'] },
      { name: 'Black', hex: '#000000', images: ['https://ext.same-assets.com/1344025563/4038461235.png'] },
    ],
    inStock: true,
    rating: 4.3,
    reviewCount: 38,
    featured: false,
  },
  {
    id: 'seasonal-color-chuck-70-women',
    name: 'Seasonal color chuck 70',
    description: 'A classic Chuck 70 in seasonal colors with premium materials and cushioning.',
    price: 819.00,
    category: 'women',
    brand: 'Converse',
    images: [
      'https://ext.same-assets.com/1344025563/38202674.png',
      'https://ext.same-assets.com/1344025563/1428116975.png',
      'https://ext.same-assets.com/1344025563/3070501779.png'
    ],
    sizes: [
      { size: 'X', inStock: true, quantity: 12 },
      { size: 'L', inStock: true, quantity: 14 },
    ],
    colors: [
      { name: 'Pink', hex: '#E91E63', images: ['https://ext.same-assets.com/1344025563/38202674.png'] },
      { name: 'Black', hex: '#000000', images: ['https://ext.same-assets.com/1344025563/1428116975.png'] },
      { name: 'Green', hex: '#2F855A', images: ['https://ext.same-assets.com/1344025563/3070501779.png'] },
      { name: 'Brown', hex: '#8B4513', images: ['https://ext.same-assets.com/1344025563/3070501779.png'] },
    ],
    inStock: true,
    rating: 4.4,
    reviewCount: 55,
    featured: false,
  },
  {
    id: 'chuck-taylor-all-star-move-women',
    name: 'Chuck taylor all star move',
    description: 'A lifted platform take on the classic Chuck Taylor with lightweight cushioning.',
    price: 491.00,
    category: 'women',
    brand: 'Converse',
    images: [
      'https://ext.same-assets.com/1344025563/41672580.png',
      'https://ext.same-assets.com/1344025563/2535510518.png',
      'https://ext.same-assets.com/1344025563/3580285965.png'
    ],
    sizes: [
      { size: 'X', inStock: true, quantity: 11 },
      { size: 'L', inStock: true, quantity: 13 },
    ],
    colors: [
      { name: 'Pink', hex: '#FF69B4', images: ['https://ext.same-assets.com/1344025563/41672580.png'] },
      { name: 'Brown', hex: '#8B4513', images: ['https://ext.same-assets.com/1344025563/2535510518.png'] },
    ],
    inStock: true,
    rating: 4.3,
    reviewCount: 44,
    featured: false,
  },
  {
    id: 'jack-purcell-leather-women',
    name: 'Jack purcell leather',
    description: 'Heritage Jack Purcell silhouette crafted in premium leather for everyday wear.',
    price: 807.00,
    category: 'women',
    brand: 'Converse',
    images: [
      'https://ext.same-assets.com/1344025563/1007337287.png',
      'https://ext.same-assets.com/1344025563/307389376.png',
      'https://ext.same-assets.com/1344025563/427152255.png'
    ],
    sizes: [
      { size: 'M', inStock: true, quantity: 12 },
      { size: 'S', inStock: true, quantity: 15 },
    ],
    colors: [
      { name: 'Brown', hex: '#8B4513', images: ['https://ext.same-assets.com/1344025563/1007337287.png'] },
      { name: 'Black', hex: '#000000', images: ['https://ext.same-assets.com/1344025563/427152255.png'] },
    ],
    inStock: true,
    rating: 4.2,
    reviewCount: 28,
    featured: false,
  },
  {
    id: 'custom-chuck-taylor-all-star-by-you-women',
    name: 'Custom chuck taylor all star by you',
    description: 'Personalize the iconic Chuck Taylor with custom colors and details.',
    price: 464.00,
    category: 'women',
    brand: 'Converse',
    images: [
      'https://ext.same-assets.com/1344025563/709533979.png',
      'https://ext.same-assets.com/1344025563/1200445762.png',
      'https://ext.same-assets.com/1344025563/3011794850.png',
      'https://ext.same-assets.com/1344025563/4014385513.png',
      'https://ext.same-assets.com/1344025563/4095315835.png'
    ],
    sizes: [
      { size: 'X', inStock: true, quantity: 14 },
      { size: 'M', inStock: true, quantity: 18 },
    ],
    colors: [
      { name: 'Purple', hex: '#6B21A8', images: ['https://ext.same-assets.com/1344025563/709533979.png'] },
      { name: 'Green', hex: '#10B981', images: ['https://ext.same-assets.com/1344025563/1200445762.png'] },
      { name: 'Pink', hex: '#FF69B4', images: ['https://ext.same-assets.com/1344025563/3011794850.png'] },
    ],
    inStock: true,
    rating: 4.1,
    reviewCount: 25,
    featured: false,
  },
  {
    id: 'senseboost-go-shoes-women',
    name: 'Senseboost go shoes',
    description: 'Everyday adidas sneakers with Boost-inspired cushioning for comfort on the go.',
    price: 625.00,
    category: 'women',
    brand: 'Adidas',
    images: [
      'https://ext.same-assets.com/1344025563/1138221531.png',
      'https://ext.same-assets.com/1344025563/1586147218.png',
      'https://ext.same-assets.com/1344025563/1116809733.png',
      'https://ext.same-assets.com/1344025563/1602254737.png'
    ],
    sizes: [
      { size: 'X', inStock: true, quantity: 12 },
      { size: 'XL', inStock: true, quantity: 9 },
    ],
    colors: [
      { name: 'Blue', hex: '#1E40AF', images: ['https://ext.same-assets.com/1344025563/1138221531.png'] },
      { name: 'Black', hex: '#000000', images: ['https://ext.same-assets.com/1344025563/1602254737.png'] },
      { name: 'White', hex: '#FFFFFF', images: ['https://ext.same-assets.com/1344025563/1586147218.png'] },
    ],
    inStock: true,
    rating: 4.3,
    reviewCount: 37,
    featured: false,
  },
  {
    id: 'lite-racer-adapt-3-0-shoes-women',
    name: 'Lite racer adapt 3.0 shoes',
    description: 'Slip-on adidas design with a snug fit and lightweight cushioning.',
    price: 895.00,
    category: 'women',
    brand: 'Adidas',
    images: [
      'https://ext.same-assets.com/1344025563/2496013468.png',
      'https://ext.same-assets.com/1344025563/4259673773.png',
      'https://ext.same-assets.com/1344025563/1707178882.png',
      'https://ext.same-assets.com/1344025563/852706235.png',
      'https://ext.same-assets.com/1344025563/2678591554.png'
    ],
    sizes: [
      { size: 'L', inStock: true, quantity: 15 },
      { size: 'S', inStock: true, quantity: 17 },
    ],
    colors: [
      { name: 'White', hex: '#FFFFFF', images: ['https://ext.same-assets.com/1344025563/2496013468.png'] },
      { name: 'Black', hex: '#000000', images: ['https://ext.same-assets.com/1344025563/852706235.png'] },
      { name: 'Red', hex: '#CC0000', images: ['https://ext.same-assets.com/1344025563/2678591554.png'] },
    ],
    inStock: true,
    rating: 4.2,
    reviewCount: 29,
    featured: false,
  },
  {
    id: 'edge-gameday-shoes-women',
    name: 'Edge gameday shoes',
    description: 'Training-inspired adidas shoes built for support and all-day comfort.',
    price: 963.00,
    category: 'women',
    brand: 'Adidas',
    images: [
      'https://ext.same-assets.com/1344025563/3618522818.png',
      'https://ext.same-assets.com/1344025563/1827094087.png',
      'https://ext.same-assets.com/1344025563/4005019361.png'
    ],
    sizes: [
      { size: 'L', inStock: true, quantity: 10 },
      { size: 'S', inStock: true, quantity: 14 },
    ],
    colors: [
      { name: 'Blue', hex: '#2563EB', images: ['https://ext.same-assets.com/1344025563/3618522818.png'] },
      { name: 'Red', hex: '#DC2626', images: ['https://ext.same-assets.com/1344025563/1827094087.png'] },
      { name: 'Black', hex: '#000000', images: ['https://ext.same-assets.com/1344025563/4005019361.png'] },
      { name: 'White', hex: '#FFFFFF', images: ['https://ext.same-assets.com/1344025563/1827094087.png'] },
    ],
    inStock: true,
    rating: 4.6,
    reviewCount: 64,
    featured: false,
  },
  {
    id: 'alphaedge-4d-reflective-shoes-women',
    name: 'Alphaedge 4d reflective shoes R',
    description: 'Futuristic adidas silhouette featuring a 4D midsole and reflective upper details.',
    price: 133.00,
    category: 'women',
    brand: 'Adidas',
    images: [
      'https://ext.same-assets.com/1344025563/3745234621.png',
      'https://ext.same-assets.com/1344025563/2976086638.png',
      'https://ext.same-assets.com/1344025563/2535419456.png',
      'https://ext.same-assets.com/1344025563/4194267529.png',
      'https://ext.same-assets.com/1344025563/1267981177.png'
    ],
    sizes: [
      { size: 'M', inStock: true, quantity: 19 },
      { size: 'XL', inStock: true, quantity: 8 },
    ],
    colors: [
      { name: 'White', hex: '#FFFFFF', images: ['https://ext.same-assets.com/1344025563/3745234621.png'] },
      { name: 'Black', hex: '#000000', images: ['https://ext.same-assets.com/1344025563/2535419456.png'] },
    ],
    inStock: true,
    rating: 4.5,
    reviewCount: 51,
    featured: false,
  },
  {
    id: 'alphaboost-shoes-women',
    name: 'Alphaboost shoes',
    description: 'adidas running-inspired design with plush cushioning and a supportive fit.',
    price: 708.00,
    category: 'women',
    brand: 'Adidas',
    images: [
      'https://ext.same-assets.com/1344025563/2918342750.png',
      'https://ext.same-assets.com/1344025563/1443862863.png'
    ],
    sizes: [
      { size: 'L', inStock: true, quantity: 13 },
    ],
    colors: [
      { name: 'Blue', hex: '#1E3A8A', images: ['https://ext.same-assets.com/1344025563/2918342750.png'] },
    ],
    inStock: true,
    rating: 4.2,
    reviewCount: 22,
    featured: false,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(product => product.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(product => product.featured);
}

export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product =>
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.brand.toLowerCase().includes(lowercaseQuery)
  );
}

export function getAvailableBrands(): string[] {
  return [...new Set(products.map(product => product.brand))];
}

export function getAvailableSizes(category?: string): string[] {
  const filteredProducts = category
    ? products.filter(product => product.category === category)
    : products;

  const allSizes = filteredProducts.flatMap(product =>
    product.sizes.map(size => size.size)
  );

  return [...new Set(allSizes)];
}

export function getPriceRange(): [number, number] {
  const prices = products.map(product => product.price);
  return [Math.min(...prices), Math.max(...prices)];
}
