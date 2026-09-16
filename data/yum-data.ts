export type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  image: string
}

export type Category = {
  id: string
  label: string
  tagline: string
  items: MenuItem[]
}

export const categories: Category[] = [
  {
    id: 'cakes',
    label: 'Customized Cakes',
    tagline: 'Baked fresh for every happy moment',
    items: [
      {
        id: 'celebration-cake',
        name: 'Celebration Cake',
        description: 'Custom-designed layered cake with fresh cream and seasonal toppings.',
        price: 3200,
        image: '/images/celebration-cake.png',
      },
      {
        id: 'chocolate-fudge',
        name: 'Chocolate Fudge Cake',
        description: 'Rich Belgian chocolate sponge layered with silky fudge ganache.',
        price: 2400,
        image:
          'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'black-forest',
        name: 'Black Forest Cake',
        description: 'Classic cocoa sponge, whipped cream, cherries and chocolate shavings.',
        price: 2200,
        image:
          'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'red-velvet',
        name: 'Red Velvet Cake',
        description: 'Velvety crimson layers with tangy cream cheese frosting.',
        price: 2600,
        image:
          'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'fresh-pastries',
        name: 'Fresh Pastries',
        description: 'Assorted daily pastries — creamy, fruity and freshly glazed.',
        price: 180,
        image:
          'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'croissants',
        name: 'Croissants & Bakery',
        description: 'Buttery, flaky croissants and oven-fresh artisan bakery.',
        price: 220,
        image:
          'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
  {
    id: 'mithai',
    label: 'Mithai & Sweets',
    tagline: 'Traditional desi mithai, made pure',
    items: [
      {
        id: 'gulab-jamun',
        name: 'Gulab Jamun',
        description: 'Soft khoya dumplings soaked in warm cardamom-rose syrup.',
        price: 900,
        image: '/images/gulab-jamun.png',
      },
      {
        id: 'mixed-barfi',
        name: 'Mixed Barfi / Mithai',
        description: 'A festive assortment of milk barfi, pista and kaju delights.',
        price: 1400,
        image: '/images/mixed-barfi.png',
      },
      {
        id: 'rasgulla',
        name: 'Rasgulla & Cham Cham',
        description: 'Spongy chenna sweets in light sugar syrup, Bengali style.',
        price: 1000,
        image:
          'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'desi-ghee-laddu',
        name: 'Desi Ghee Laddu',
        description: 'Golden besan laddu roasted in pure desi ghee.',
        price: 1200,
        image: '/images/desi-ghee-laddu.png',
      },
      {
        id: 'rasmalai',
        name: 'Fresh Rasmalai',
        description: 'Delicate chenna patties in saffron-infused thickened milk.',
        price: 1100,
        image: '/images/rasmalai.png',
      },
    ],
  },
  {
    id: 'chicken',
    label: 'Crispy Fried Chicken',
    tagline: 'Hot, crunchy and freshly fried',
    items: [
      {
        id: 'combo-2pc',
        name: '2-Piece Signature Combo',
        description: 'Two crispy fried pieces with fries and a dip.',
        price: 650,
        image:
          'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'meal-4pc',
        name: '4-Piece Value Meal',
        description: 'Four juicy pieces with fries, coleslaw and drink.',
        price: 1150,
        image:
          'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'bucket-8pc',
        name: '8-Piece Family Bucket',
        description: 'A full bucket of signature fried chicken for the family.',
        price: 2100,
        image:
          'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'zinger-burger',
        name: 'Crunchy Zinger Burger',
        description: 'Crispy fillet, fresh lettuce and creamy sauce in a soft bun.',
        price: 480,
        image:
          'https://images.unsplash.com/photo-1610614819513-58e34989848b?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'spicy-wings',
        name: 'Spicy Wings',
        description: 'Fiery glazed wings tossed in our house hot sauce.',
        price: 560,
        image:
          'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
  {
    id: 'dairy',
    label: 'Fresh Dairy & Honey',
    tagline: 'Pure refreshments from our farm counter',
    items: [
      {
        id: 'organic-honey',
        name: 'Pure Organic Honey',
        description: 'Raw, unfiltered honey harvested from natural apiaries.',
        price: 850,
        image: '/images/organic-honey.png',
      },
      {
        id: 'fresh-milk',
        name: 'Fresh Dairy Milk',
        description: 'Farm-fresh full cream milk, delivered daily.',
        price: 220,
        image:
          'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'fresh-juices',
        name: 'Fresh Juices',
        description: 'Seasonal fruit juices pressed fresh to order.',
        price: 320,
        image:
          'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'milkshakes',
        name: 'Milkshakes & Iced Coffee',
        description: 'Thick creamy shakes and chilled iced coffee blends.',
        price: 420,
        image:
          'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'pizza-showcase',
        name: 'Wood-Fired Pizza',
        description: 'Hand-stretched dough, rich sauce and bubbling cheese.',
        price: 990,
        image:
          'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
]

export type Branch = {
  name: string
  address: string
  phones: string[]
}

export const branches: Branch[] = [
  { name: 'Wah Cantt (Main)', address: 'Main Branch, Wah Cantt', phones: ['051-4539389'] },
  { name: 'Nawababad Branch', address: 'Nawababad, Wah', phones: ['051-4547212'] },
  { name: 'Lalarukh Branch', address: 'Lalarukh, Wah', phones: ['051-4532155'] },
  { name: 'Hazro', address: 'Bank Road, Main Bazar, Hazro', phones: ['057-2310451'] },
  { name: 'Hassan Abdal', address: 'Hazara Road, Hassan Abdal', phones: ['057-2523389'] },
  { name: 'Attock', address: 'Kamra Road, Attock', phones: ['057-2701444'] },
  {
    name: 'Haripur',
    address: 'Ameen Plaza, G.T Road, Haripur',
    phones: ['0995-5311799', '0311-9863986'],
  },
]

export const branchNames = branches.map((b) => b.name.replace(/\s*\(.*\)/, ''))
