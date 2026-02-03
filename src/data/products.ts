export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  weightOptions: string[]; // e.g., "1kg", "5kg", "Full"
  parts?: string[]; // e.g., "Leg", "Ribs"
  description: string;
  imageUrl: string;
  category: 'full' | 'part' | 'kg';
};

export const products: Product[] = [
  {
    id: '1',
    name: 'Full Goat (Live)',
    slug: 'full-goat-live',
    price: 45000,
    weightOptions: ['Full'],
    category: 'full',
    description: 'A healthy, full-sized live goat. Perfect for celebrations.',
    imageUrl: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&q=80',
  },
  {
    id: '2',
    name: 'Goat Meat (Per Kg)',
    slug: 'goat-meat-kg',
    price: 3500,
    weightOptions: ['1kg', '2kg', '5kg', '10kg'],
    category: 'kg',
    description: 'Fresh goat meat cut to your preference. Price per kg.',
    imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80',
  },
  {
    id: '3',
    name: 'Goat Leg (Rear)',
    slug: 'goat-leg-rear',
    price: 5000,
    weightOptions: ['1 leg'],
    category: 'part',
    description: 'Meaty rear leg, perfect for roasting or peppersoup.',
    imageUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&q=80',
  },
  {
    id: '4',
    name: 'Goat Ribs',
    slug: 'goat-ribs',
    price: 3000,
    weightOptions: ['1kg'],
    category: 'part',
    description: 'Tender goat ribs, excellent for grilling.',
    imageUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&q=80',
  },
  {
    id: '5',
    name: 'Goat Head (Isi Ewu)',
    slug: 'goat-head',
    price: 2500,
    weightOptions: ['1 head'],
    category: 'part',
    description: 'Cleaned goat head for the famous Isi Ewu delicacy.',
    imageUrl: 'https://images.unsplash.com/photo-1612871689353-cccf581d667b?auto=format&fit=crop&q=80',
  },
  {
    id: '6',
    name: 'Goat Liver & Kidney',
    slug: 'goat-liver-kidney',
    price: 2000,
    weightOptions: ['1kg'],
    category: 'part',
    description: 'Fresh organ meat, rich in nutrients.',
    imageUrl: 'https://images.unsplash.com/photo-1574484284008-032fce5a3b2e?auto=format&fit=crop&q=80',
  },
  {
    id: '7',
    name: 'Full Goat (Processor)',
    slug: 'full-goat-processed',
    price: 48000,
    weightOptions: ['Full'],
    category: 'full',
    description: 'Processed and cleaned full goat, ready for cooking.',
    imageUrl: 'https://images.unsplash.com/photo-1560781290-7dc94c0f8f4f?auto=format&fit=crop&q=80',
  },
  {
    id: '8',
    name: 'Goat Shoulder',
    slug: 'goat-shoulder',
    price: 4000,
    weightOptions: ['1 shoulder'],
    category: 'part',
    description: 'Succulent goat shoulder cut.',
    imageUrl: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80',
  },
  {
    id: '9',
    name: 'Diced Goat Meat',
    slug: 'diced-goat-meat',
    price: 3800,
    weightOptions: ['1kg'],
    category: 'kg',
    description: 'Conveniently diced goat meat for stews.',
    imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80',
  },
  {
    id: '10',
    name: 'Pepper Soup Bundle',
    slug: 'pepper-soup-bundle',
    price: 6000,
    weightOptions: ['2kg mixed'],
    category: 'part',
    description: 'Mixed cuts perfect for traditional peppersoup.',
    imageUrl: 'https://images.unsplash.com/photo-1548943487-a2e4e43b485c?auto=format&fit=crop&q=80',
  },
];
