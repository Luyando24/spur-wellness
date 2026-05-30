export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rating: number;
  reviews: number;
  is_wholesale?: boolean;
  moq_price?: number;
  moq_quantity?: number;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Spur Pro Cast Iron Kettlebell',
    price: 49.99,
    image: '/products/kettlebell.png',
    description: 'Engineered with industrial-grade cast iron and a textured powder-coat finish for maximum grip and durability. Features color-coded handle bands for easy weight identification.',
    category: 'Kettlebells',
    rating: 4.9,
    reviews: 142,
    is_wholesale: true,
    moq_price: 34.99,
    moq_quantity: 10,
  },
  {
    id: '2',
    name: 'Spur Elite Competition Steel Kettlebell',
    price: 79.99,
    image: '/products/kettlebell.png',
    description: 'Precision-balanced steel construction meeting international standards. Designed for high-repetition workouts with a polished stainless steel handle.',
    category: 'Kettlebells',
    rating: 5.0,
    reviews: 64,
  },
  {
    id: '3',
    name: 'Spur Carbon Strength Resistance Bands Set',
    price: 29.99,
    image: '/products/resistance_bands.png',
    description: '100% natural latex bands with heavy-duty metal carabiners, padded foam handles, and ankle straps. Set includes five stackable bands ranging from 10 lbs to 50 lbs.',
    category: 'Resistance Bands',
    rating: 4.8,
    reviews: 215,
  },
  {
    id: '4',
    name: 'Spur Flexi-Loop Fabric Bands Set',
    price: 19.99,
    image: '/products/resistance_bands.png',
    description: 'Premium cotton-polyester blend bands that will not roll or slip during workouts. Set of three resistance levels, perfect for lower-body activation.',
    category: 'Resistance Bands',
    rating: 4.7,
    reviews: 189,
    is_wholesale: true,
    moq_price: 12.99,
    moq_quantity: 20,
  },
  {
    id: '5',
    name: 'Spur Anti-Burst Core Stability Ball',
    price: 24.99,
    image: '/products/stability_ball.png',
    description: 'Ultra-durable, slip-resistant PVC stability ball. Rated up to 2,000 lbs to support core training, active sitting, and physical therapy.',
    category: 'Exercise Balls',
    rating: 4.9,
    reviews: 98,
  },
  {
    id: '6',
    name: 'Spur Impact Textured Slam Ball',
    price: 34.99,
    image: '/products/stability_ball.png',
    description: 'Heavy-duty rubber shell designed to absorb maximum impact without bouncing. Iron sand filling provides shifting resistance for explosive power training.',
    category: 'Exercise Balls',
    rating: 4.6,
    reviews: 73,
  },
  {
    id: '7',
    name: 'Spur ZenTPE High-Density Exercise Mat',
    price: 39.99,
    image: '/products/exercise_mat.png',
    description: 'Eco-friendly TPE foam mat with double-sided non-slip textures. 6mm thick cushioning provides optimal joint protection and comfort for floor workouts.',
    category: 'Exercise Mats',
    rating: 4.8,
    reviews: 156,
  },
  {
    id: '8',
    name: 'Spur ProFit Heavy Duty Gym Mat',
    price: 59.99,
    image: '/products/exercise_mat.png',
    description: 'Natural rubber grid pattern mat designed for heavy exercise equipment and intense weight training. Shock-absorbing, non-absorbent, and easy to clean.',
    category: 'Exercise Mats',
    rating: 4.9,
    reviews: 82,
    is_wholesale: true,
    moq_price: 39.99,
    moq_quantity: 8,
  },
  {
    id: '9',
    name: 'Spur Arena Premium Gym Turf Roll (15ft x 50ft)',
    price: 349.99,
    image: '/products/gym_turf.png',
    description: 'High-density polyethylene synthetic turf roll. Engineered with thick shock-absorbing backing to support sled pushes, sprints, and heavy workouts.',
    category: 'Artificial Turf',
    rating: 5.0,
    reviews: 41,
    is_wholesale: true,
    moq_price: 249.99,
    moq_quantity: 3,
  },
  {
    id: '10',
    name: 'Spur Meadow Lush Landscaping Grass',
    price: 199.99,
    image: '/products/gym_turf.png',
    description: 'Realistic multi-tonal green synthetic grass roll with natural thatch appearance. UV-resistant, fully drainable, and perfect for outdoor landscaping or backyard putting greens.',
    category: 'Artificial Turf',
    rating: 4.7,
    reviews: 32,
  },
];
