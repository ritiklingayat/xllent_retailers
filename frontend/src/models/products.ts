import type { Product } from "@/models/product";

export const products: Product[] = [
  {
    id: "aashirvaad-atta",
    name: "Aashirvaad Select Atta",
    slug: "aashirvaad-select-atta",
    category: "Staples",
    brand: "Aashirvaad",
    price: 329,
    stock: 120,
    shortDescription: "Premium whole wheat atta for soft rotis and everyday family meals.",
    description:
      "A trusted FMCG staple for homes and retailers, packed for freshness and consistent quality.",
    imageUrl:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=900&q=80",
    colorClass: "from-gold-secondary/20 to-harvest-cream",
    highlights: ["Fast-moving staple", "Fresh stock", "Family pack"],
    bestFor: ["Households", "Kirana stores", "Bulk retail"]
  },
  {
    id: "fortune-rice-bran-oil",
    name: "Fortune Rice Bran Oil",
    slug: "fortune-rice-bran-oil",
    category: "Edible Oil",
    brand: "Fortune",
    price: 185,
    stock: 95,
    shortDescription: "Popular cooking oil with dependable retail demand and smooth taste.",
    description:
      "A kitchen essential for daily cooking, stocked for home buyers, hotels, and local retailers.",
    imageUrl:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=80",
    colorClass: "from-harvest-safflower/15 to-gold-pale",
    highlights: ["Trusted brand", "Daily cooking", "Retail ready"],
    bestFor: ["Home kitchens", "Restaurants", "Grocery stores"]
  },
  {
    id: "tata-salt",
    name: "Tata Salt",
    slug: "tata-salt",
    category: "Groceries",
    brand: "Tata",
    price: 28,
    stock: 300,
    shortDescription: "Everyday iodized salt with reliable shelf movement.",
    description:
      "A high-frequency grocery product ideal for carts, monthly baskets, and wholesale counters.",
    imageUrl:
      "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=900&q=80",
    colorClass: "from-harvest-olive/15 to-gold-pale",
    highlights: ["Essential item", "High turnover", "Trusted quality"],
    bestFor: ["Monthly grocery", "Retail shelves", "Family kitchens"]
  },
  {
    id: "surf-excel",
    name: "Surf Excel Detergent",
    slug: "surf-excel-detergent",
    category: "Home Care",
    brand: "Surf Excel",
    price: 245,
    stock: 80,
    shortDescription: "Fast-moving home care product for modern retail baskets.",
    description:
      "Premium detergent stock for customer baskets, supermarkets, and repeat retail demand.",
    imageUrl:
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=900&q=80",
    colorClass: "from-blue-100 to-gold-pale",
    highlights: ["Home care", "Repeat purchase", "Premium demand"],
    bestFor: ["Laundry", "Retail shelves", "Family homes"]
  },
  {
    id: "parle-g",
    name: "Parle-G Biscuits",
    slug: "parle-g-biscuits",
    category: "Snacks",
    brand: "Parle",
    price: 10,
    stock: 500,
    shortDescription: "Classic biscuit pack for quick sales and daily snacking.",
    description:
      "A budget-friendly snack essential with strong repeat demand across counters and homes.",
    imageUrl:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=900&q=80",
    colorClass: "from-amber-100 to-harvest-cream",
    highlights: ["Impulse buy", "Affordable", "Fast moving"],
    bestFor: ["Tea time", "Counters", "School snacks"]
  },
  {
    id: "red-label-tea",
    name: "Red Label Tea",
    slug: "red-label-tea",
    category: "Beverages",
    brand: "Brooke Bond",
    price: 165,
    stock: 105,
    shortDescription: "Popular tea blend for everyday Indian households.",
    description:
      "A dependable beverage product for regular home use and retailer stocking.",
    imageUrl:
      "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=900&q=80",
    colorClass: "from-red-100 to-gold-pale",
    highlights: ["Daily beverage", "Popular brand", "Retail favorite"],
    bestFor: ["Morning tea", "Grocery orders", "Retail shelves"]
  }
];

export function getProductById(productId: string) {
  return products.find((product) => product.id === productId);
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}
