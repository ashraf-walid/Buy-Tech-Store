import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is missing in .env.local');
  process.exit(1);
}

// Define Schema (Simplified for seeding)
const productSchema = new mongoose.Schema({
  name: String,
  brand: String,
  model: String,
  category: String,
  subCategory: String,
  tags: [String],
  description: String,
  image: { url: String, public_id: String },
  images: [{ url: String, public_id: String }],
  price: Number,
  discount: Number,
  stock: mongoose.Schema.Types.Mixed,
  condition: String,
  badge: String,
  specs: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const sampleProducts = [
  {
    name: "MacBook Pro 14 M3 Pro",
    brand: "Apple",
    model: "M3 Pro 2024",
    category: "Laptops",
    subCategory: "Professional",
    tags: ["new", "bestseller", "apple"],
    description: "The most advanced MacBook Pro with M3 Pro chip.",
    price: 1999,
    discount: 5,
    stock: 15,
    condition: "New",
    badge: "Premium",
    image: { url: "https://res.cloudinary.com/dlxriskia/image/upload/v1/laptop1", public_id: "laptop1" },
    specs: { cpu: { brand: "Apple", model: "M3 Pro" }, ram: { size: 18, unit: "GB" } }
  },
  {
    name: "Dell XPS 15 9530",
    brand: "Dell",
    model: "XPS 15",
    category: "Laptops",
    subCategory: "Ultrabook",
    tags: ["new", "dell"],
    description: "Stunning 4K OLED display with powerful performance.",
    price: 1799,
    discount: 10,
    stock: 10,
    condition: "New",
    badge: "High-End",
    image: { url: "https://res.cloudinary.com/dlxriskia/image/upload/v1/laptop2", public_id: "laptop2" },
    specs: { cpu: { brand: "Intel", model: "Core i9" }, ram: { size: 32, unit: "GB" } }
  },
  {
    name: "ROG Swift PG279QM",
    brand: "ASUS",
    model: "ROG Swift",
    category: "Monitors",
    subCategory: "Gaming",
    tags: ["gaming", "asus"],
    description: "240Hz refresh rate for ultimate gaming experience.",
    price: 799,
    discount: 15,
    stock: 20,
    condition: "New",
    badge: "Pro Gamer",
    image: { url: "https://res.cloudinary.com/dlxriskia/image/upload/v1/monitor1", public_id: "monitor1" },
    specs: { screen: { size: 27, resolution: "2560x1440", refreshRate: 240 } }
  },
  {
    name: "Logitech G Pro X Superlight",
    brand: "Logitech",
    model: "G Pro X",
    category: "Accessories",
    subCategory: "Mice",
    tags: ["bestseller", "wireless"],
    description: "The world's lightest wireless gaming mouse.",
    price: 149,
    discount: 0,
    stock: 50,
    condition: "New",
    badge: "Top Rated",
    image: { url: "https://res.cloudinary.com/dlxriskia/image/upload/v1/mouse1", public_id: "mouse1" }
  },
  {
    name: "Samsung Odyssey Neo G9",
    brand: "Samsung",
    model: "Odyssey G9",
    category: "Monitors",
    subCategory: "Ultrawide",
    tags: ["gaming", "samsung"],
    description: "49-inch curved gaming monitor with Mini-LED.",
    price: 1299,
    discount: 20,
    stock: 5,
    condition: "New",
    badge: "Giant",
    image: { url: "https://res.cloudinary.com/dlxriskia/image/upload/v1/monitor2", public_id: "monitor2" }
  },
  {
    name: "HP Pavilion 15",
    brand: "HP",
    model: "Pavilion",
    category: "Laptops",
    subCategory: "Student",
    tags: ["hp", "budget"],
    description: "Reliable laptop for everyday tasks and students.",
    price: 599,
    discount: 5,
    stock: 30,
    condition: "New",
    badge: "Value",
    image: { url: "https://res.cloudinary.com/dlxriskia/image/upload/v1/laptop3", public_id: "laptop3" }
  },
  {
    name: "Razer BlackWidow V4 Pro",
    brand: "Razer",
    model: "BlackWidow",
    category: "Accessories",
    subCategory: "Keyboards",
    tags: ["gaming", "razer"],
    description: "Mechanical gaming keyboard with RGB lighting.",
    price: 229,
    discount: 10,
    stock: 25,
    condition: "New",
    badge: "Gaming",
    image: { url: "https://res.cloudinary.com/dlxriskia/image/upload/v1/keyboard1", public_id: "keyboard1" }
  },
  {
    name: "Sony WH-1000XM5",
    brand: "Sony",
    model: "WH-1000XM5",
    category: "Accessories",
    subCategory: "Headphones",
    tags: ["audio", "sony", "bestseller"],
    description: "Industry-leading noise canceling headphones.",
    price: 399,
    discount: 12,
    stock: 40,
    condition: "New",
    badge: "Best Audio",
    image: { url: "https://res.cloudinary.com/dlxriskia/image/upload/v1/headphone1", public_id: "headphone1" }
  },
  {
    name: "LG UltraGear 34GP950G",
    brand: "LG",
    model: "UltraGear",
    category: "Monitors",
    subCategory: "Gaming",
    tags: ["lg", "gaming"],
    description: "Nano IPS display with G-Sync Ultimate.",
    price: 899,
    discount: 8,
    stock: 12,
    condition: "New",
    badge: "Ultra Wide",
    image: { url: "https://res.cloudinary.com/dlxriskia/image/upload/v1/monitor3", public_id: "monitor3" }
  },
  {
    name: "MSI Stealth 16 Studio",
    brand: "MSI",
    model: "Stealth 16",
    category: "Laptops",
    subCategory: "Gaming",
    tags: ["msi", "gaming", "new"],
    description: "Thin and light gaming laptop with RTX 4070.",
    price: 2199,
    discount: 15,
    stock: 8,
    condition: "New",
    badge: "Studio",
    image: { url: "https://res.cloudinary.com/dlxriskia/image/upload/v1/laptop4", public_id: "laptop4" }
  },
  {
    name: "Alienware M18 R1",
    brand: "Alienware",
    model: "M18",
    category: "Laptops",
    subCategory: "Gaming",
    tags: ["alienware", "gaming"],
    description: "Massive 18-inch gaming laptop with top specs.",
    price: 2899,
    discount: 200,
    stock: 4,
    condition: "New",
    badge: "Beast",
    image: { url: "https://res.cloudinary.com/dlxriskia/image/upload/v1/laptop5", public_id: "laptop5" }
  },
  {
    name: "Keychron K2 Wireless",
    brand: "Keychron",
    model: "K2",
    category: "Accessories",
    subCategory: "Keyboards",
    tags: ["mechanical", "mac"],
    description: "Compact mechanical keyboard for productivity.",
    price: 89,
    discount: 0,
    stock: 60,
    condition: "New",
    badge: "Popular",
    image: { url: "https://res.cloudinary.com/dlxriskia/image/upload/v1/keyboard2", public_id: "keyboard2" }
  },
  {
    name: "Corsair Vengeance RGB 32GB",
    brand: "Corsair",
    model: "Vengeance",
    category: "Accessories",
    subCategory: "Components",
    tags: ["ram", "corsair"],
    description: "High performance DDR5 memory with RGB.",
    price: 120,
    discount: 5,
    stock: 100,
    condition: "New",
    badge: "Fast",
    image: { url: "https://res.cloudinary.com/dlxriskia/image/upload/v1/ram1", public_id: "ram1" }
  },
  {
    name: "Samsung 990 Pro 2TB",
    brand: "Samsung",
    model: "990 Pro",
    category: "Accessories",
    subCategory: "Components",
    tags: ["ssd", "samsung", "bestseller"],
    description: "The ultimate PCIe 4.0 SSD for gaming and work.",
    price: 179,
    discount: 10,
    stock: 45,
    condition: "New",
    badge: "Super Fast",
    image: { url: "https://res.cloudinary.com/dlxriskia/image/upload/v1/ssd1", public_id: "ssd1" }
  },
  {
    name: "NVIDIA RTX 4090 Founders Edition",
    brand: "NVIDIA",
    model: "RTX 4090",
    category: "Accessories",
    subCategory: "Components",
    tags: ["gpu", "nvidia"],
    description: "The most powerful consumer graphics card.",
    price: 1599,
    discount: 0,
    stock: 2,
    condition: "New",
    badge: "Ultimate",
    image: { url: "https://res.cloudinary.com/dlxriskia/image/upload/v1/gpu1", public_id: "gpu1" }
  },
  {
    name: "Lenovo Legion 5i Pro",
    brand: "Lenovo",
    model: "Legion 5i Pro",
    category: "Laptops",
    subCategory: "Gaming",
    tags: ["lenovo", "gaming"],
    description: "Excellent gaming laptop with QHD display.",
    price: 1499,
    discount: 12,
    stock: 15,
    condition: "New",
    badge: "Best Choice",
    image: { url: "https://res.cloudinary.com/dlxriskia/image/upload/v1/laptop6", public_id: "laptop6" }
  },
  {
    name: "BenQ PD3220U 32-inch 4K",
    brand: "BenQ",
    model: "PD3220U",
    category: "Monitors",
    subCategory: "Design",
    tags: ["benq", "4k"],
    description: "Professional monitor for designers and photographers.",
    price: 1099,
    discount: 50,
    stock: 7,
    condition: "New",
    badge: "Designer",
    image: { url: "https://res.cloudinary.com/dlxriskia/image/upload/v1/monitor4", public_id: "monitor4" }
  },
  {
    name: "SteelSeries Arctis Nova Pro",
    brand: "SteelSeries",
    model: "Arctis Nova",
    category: "Accessories",
    subCategory: "Headsets",
    tags: ["gaming", "audio"],
    description: "Wireless gaming headset with multi-system connect.",
    price: 349,
    discount: 20,
    stock: 18,
    condition: "New",
    badge: "Pro Audio",
    image: { url: "https://res.cloudinary.com/dlxriskia/image/upload/v1/headset1", public_id: "headset1" }
  },
  {
    name: "ASUS Zenbook Duo 14",
    brand: "ASUS",
    model: "Zenbook Duo",
    category: "Laptops",
    subCategory: "Productivity",
    tags: ["asus", "new"],
    description: "Dual-screen laptop for ultimate productivity.",
    price: 1399,
    discount: 100,
    stock: 10,
    condition: "New",
    badge: "Unique",
    image: { url: "https://res.cloudinary.com/dlxriskia/image/upload/v1/laptop7", public_id: "laptop7" }
  },
  {
    name: "Seagate FireCuda 530 1TB",
    brand: "Seagate",
    model: "FireCuda 530",
    category: "Accessories",
    subCategory: "Components",
    tags: ["ssd", "ps5"],
    description: "High speed SSD compatible with PS5.",
    price: 129,
    discount: 15,
    stock: 25,
    condition: "New",
    badge: "PS5 Ready",
    image: { url: "https://res.cloudinary.com/dlxriskia/image/upload/v1/ssd2", public_id: "ssd2" }
  }
];

async function seedDB() {
  try {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🧹 Clearing existing products...');
    await Product.deleteMany({});
    console.log('✅ Products cleared');

    console.log('🚀 Seeding products...');
    await Product.insertMany(sampleProducts);
    console.log('✅ Successfully seeded 20 products!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDB();
