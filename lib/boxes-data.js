export const boxesData = [
  {
    boxId: "influencer-box-1",
    boxName: "Tech Mystery Box",
    boxPrice: 49.99,
    spinCost: "100",
    image: {
      url: "https://shouttymedia.nyc3.digitaloceanspaces.com/fanbox/1755535339928-box2.png",
    },
    items: [
      {
        id: 1,
        name: "iPhone 15 Pro",
        image: "/images/item4.png",
        value: 999.99,
        odds: 0.05,
        rarity: "legendary",
      },
      {
        id: 2,
        name: "MacBook Air",
        image: "/images/item5.png",
        value: 1199.99,
        odds: 0.03,
        rarity: "legendary",
      },
      {
        id: 3,
        name: "AirPods Pro",
        image: "/images/item3.png ",
        value: 249.99,
        odds: 0.15,
        rarity: "rare",
      },
      {
        id: 4,
        name: "iPad Pro",
        image: "/images/item4.png",
        value: 799.99,
        odds: 0.08,
        rarity: "rare",
      },
      {
        id: 5,
        name: "Apple Watch",
        // image: "/placeholder.svg?height=160&width=160&text=Watch",
        image: "/images/item1.png",
        value: 399.99,
        odds: 0.12,
        rarity: "uncommon",
      },
      {
        id: 6,
        name: "Gaming Console",
        image: "/images/item3.png",
        value: 499.99,
        odds: 0.1,
        rarity: "rare",
      },
      {
        id: 7,
        name: "Wireless Headphones",
        image: "/images/item3.png",
        value: 199.99,
        odds: 0.2,
        rarity: "uncommon",
      },
      // {
      //   id: 8,
      //   name: "Smart Speaker",
      //   image: "/images/item2.png",
      //   value: 99.99,
      //   odds: 0.27,
      //   rarity: "common",
      // },
    ],
  },
  {
    id: 1,
    slug: "ashley-powers-picks",
    title: "Powers Picks",
    ambassadorName: "Ashley Powers",
    ambassadorSlug: "ashley-powers",
    ambassadorImage: "/images/profile1bg.png",
    spinCost: "100",
    image: {
      url: "https://shouttymedia.nyc3.digitaloceanspaces.com/fanbox/1755535339928-box2.png",
    },
    prizeItems: [
      {
        name: "Rolex Watch",
        image: "/images/item1.png",
        size: 120,
      },
      {
        name: "Hermes Bag",
        image: "/images/item5.png",
        size: 140,
      },
      {
        name: "AirPods Pro",
        image: "/images/item3.png",
        size: 160,
      },
      {
        name: "Dior Bag",
        image: "/images/item4.png",
        size: 130,
      },
      {
        name: "Van Cleef Bracelet",
        image: "/images/item5.png",
        size: 110,
      },
    ],
    items: [
      ///either this or prizeItems is required. added for testing
      {
        id: 1,
        name: "Rolex Watch",
        image: "/images/item1.png",
        size: 120,
        odds: 0.01,
        value: 999.99,
      },
      {
        id: 2,
        name: "Hermes Bag",
        image: "/images/item5.png",
        size: 140,
        odds: 0.02,
        value: 5000,
      },
      {
        id: 3,
        name: "AirPods Pro",
        image: "/images/item3.png",
        size: 160,
        odds: 0.04,
        value: 250,
      },
      {
        id: 4,
        name: "Dior Bag",
        image: "/images/item4.png",
        size: 130,
        odds: 0.01,
        value: 3000,
      },
      {
        id: 5,
        name: "Van Cleef Bracelet",
        image: "/images/item5.png",
        size: 110,
        odds: 0.07,
        value: 1000,
      },
    ],
    contents: [
      {
        id: 1,
        name: "AirPods Pro",
        brand: "Apple",
        price: 250,
        image: "/images/item1.png",
        description:
          "Beautiful rich sound – less background noise. Apple AirPods Pro are built around the H2 chip, and its algorithms play a massive part in producing vivid audio. It processes sound quickly for higher fidelity audio and works with the custom-built driver and amplifier for crisp, distortion-free music.",
      },
      {
        id: 2,
        name: "Birkin Bag",
        brand: "Hermes",
        price: 20000,
        image: "/images/item2.png",
        description:
          "The iconic Hermès Birkin bag is a symbol of luxury and craftsmanship. Made from the finest leather with meticulous attention to detail, this timeless piece is both a fashion statement and an investment.",
      },
      {
        id: 3,
        name: "Datejust",
        brand: "Rolex",
        price: 8000,
        image: "/images/item3.png",
        description:
          "The Rolex Datejust is a classic timepiece that combines elegance with precision. Featuring automatic movement and water resistance, this watch is perfect for any occasion.",
      },
      {
        id: 4,
        name: "Handbag",
        brand: "Dior",
        price: 3000,
        image: "/images/item4.png",
        description:
          "This elegant Dior handbag combines luxury with functionality. Crafted from premium materials with the iconic Dior design, it's the perfect accessory for the modern woman.",
      },
      {
        id: 5,
        name: "Clover Bracelet",
        brand: "Van Cleef & Arpels",
        price: 1000,
        image: "/images/item5.png",
        description:
          "The Van Cleef & Arpels Clover bracelet is a delicate piece of jewelry that embodies elegance and sophistication. Made with precious metals and stones, it's a timeless addition to any collection.",
      },
    ],
  },
  {
    id: 2,
    slug: "big-narstie-box",
    title: "Box Name",
    ambassadorName: "Big Narstie",
    ambassadorSlug: "big-narstie",
    ambassadorImage: "/images/profile2bg.png",
    spinCost: "150",
    prizeItems: [
      {
        name: "Rolex Watch",
        image: "/images/item1.png",
        size: 120,
      },
      {
        name: "Hermes Bag",
        image: "/images/item2.png",
        size: 140,
      },
      {
        name: "AirPods Pro",
        image: "/images/item3.png",
        size: 160,
      },
      {
        name: "Dior Bag",
        image: "/images/item4.png",
        size: 130,
      },
      {
        name: "Van Cleef Bracelet",
        image: "/images/item5.png",
        size: 110,
      },
    ],
    contents: [
      {
        id: 1,
        name: "AirPods Pro",
        brand: "Apple",
        price: 250,
        image: "/images/item1.png",
        description:
          "Beautiful rich sound – less background noise. Apple AirPods Pro are built around the H2 chip, and its algorithms play a massive part in producing vivid audio. It processes sound quickly for higher fidelity audio and works with the custom-built driver and amplifier for crisp, distortion-free music.",
      },
      {
        id: 2,
        name: "Birkin Bag",
        brand: "Hermes",
        price: 20000,
        image: "/images/item2.png",
        description:
          "The iconic Hermès Birkin bag is a symbol of luxury and craftsmanship. Made from the finest leather with meticulous attention to detail, this timeless piece is both a fashion statement and an investment.",
      },
      {
        id: 3,
        name: "Datejust",
        brand: "Rolex",
        price: 8000,
        image: "/images/item3.png",
        description:
          "The Rolex Datejust is a classic timepiece that combines elegance with precision. Featuring automatic movement and water resistance, this watch is perfect for any occasion.",
      },
      {
        id: 4,
        name: "Handbag",
        brand: "Dior",
        price: 3000,
        image: "/images/item4.png",
        description:
          "This elegant Dior handbag combines luxury with functionality. Crafted from premium materials with the iconic Dior design, it's the perfect accessory for the modern woman.",
      },
      {
        id: 5,
        name: "Clover Bracelet",
        brand: "Van Cleef & Arpels",
        price: 1000,
        image: "/images/item5.png",
        description:
          "The Van Cleef & Arpels Clover bracelet is a delicate piece of jewelry that embodies elegance and sophistication. Made with precious metals and stones, it's a timeless addition to any collection.",
      },
    ],
  },
  {
    id: 3,
    slug: "labubu-exclusive",
    title: "Labubu Exclusive",
    ambassadorName: "Fanboxes",
    ambassadorSlug: "fanboxes",
    ambassadorImage: "/images/profile3bg.png",
    spinCost: "75",
    prizeItems: [
      {
        name: "Rolex Watch",
        image: "/images/item1.png",
        size: 120,
      },
      {
        name: "Hermes Bag",
        image: "/images/item2.png",
        size: 140,
      },
      {
        name: "AirPods Pro",
        image: "/images/item3.png",
        size: 160,
      },
      {
        name: "Dior Bag",
        image: "/images/item4.png",
        size: 130,
      },
      {
        name: "Van Cleef Bracelet",
        image: "/images/item5.png",
        size: 110,
      },
    ],
    contents: [
      {
        id: 1,
        name: "AirPods Pro",
        brand: "Apple",
        price: 250,
        image: "/images/item1.png",
        description:
          "Beautiful rich sound – less background noise. Apple AirPods Pro are built around the H2 chip, and its algorithms play a massive part in producing vivid audio. It processes sound quickly for higher fidelity audio and works with the custom-built driver and amplifier for crisp, distortion-free music.",
      },
      {
        id: 2,
        name: "Birkin Bag",
        brand: "Hermes",
        price: 20000,
        image: "/images/item2.png",
        description:
          "The iconic Hermès Birkin bag is a symbol of luxury and craftsmanship. Made from the finest leather with meticulous attention to detail, this timeless piece is both a fashion statement and an investment.",
      },
      {
        id: 3,
        name: "Datejust",
        brand: "Rolex",
        price: 8000,
        image: "/images/item3.png",
        description:
          "The Rolex Datejust is a classic timepiece that combines elegance with precision. Featuring automatic movement and water resistance, this watch is perfect for any occasion.",
      },
      {
        id: 4,
        name: "Handbag",
        brand: "Dior",
        price: 3000,
        image: "/images/item4.png",
        description:
          "This elegant Dior handbag combines luxury with functionality. Crafted from premium materials with the iconic Dior design, it's the perfect accessory for the modern woman.",
      },
      {
        id: 5,
        name: "Clover Bracelet",
        brand: "Van Cleef & Arpels",
        price: 1000,
        image: "/images/item5.png",
        description:
          "The Van Cleef & Arpels Clover bracelet is a delicate piece of jewelry that embodies elegance and sophistication. Made with precious metals and stones, it's a timeless addition to any collection.",
      },
    ],
  },
  {
    id: 4,
    slug: "luxe-exclusive",
    title: "Luxe Exclusive",
    ambassadorName: "Fanboxes",
    ambassadorSlug: "fanboxes",
    ambassadorImage: "/images/profile1bg.png",
    spinCost: "200",
    prizeItems: [
      {
        name: "Rolex Watch",
        image: "/images/item1.png",
        size: 120,
      },
      {
        name: "Hermes Bag",
        image: "/images/item2.png",
        size: 140,
      },
      {
        name: "AirPods Pro",
        image: "/images/item3.png",
        size: 160,
      },
      {
        name: "Dior Bag",
        image: "/images/item4.png",
        size: 130,
      },
      {
        name: "Van Cleef Bracelet",
        image: "/images/item5.png",
        size: 110,
      },
    ],
    contents: [
      {
        id: 1,
        name: "AirPods Pro",
        brand: "Apple",
        price: 250,
        image: "/images/item1.png",
        description:
          "Beautiful rich sound – less background noise. Apple AirPods Pro are built around the H2 chip, and its algorithms play a massive part in producing vivid audio. It processes sound quickly for higher fidelity audio and works with the custom-built driver and amplifier for crisp, distortion-free music.",
      },
      {
        id: 2,
        name: "Birkin Bag",
        brand: "Hermes",
        price: 20000,
        image: "/images/item2.png",
        description:
          "The iconic Hermès Birkin bag is a symbol of luxury and craftsmanship. Made from the finest leather with meticulous attention to detail, this timeless piece is both a fashion statement and an investment.",
      },
      {
        id: 3,
        name: "Datejust",
        brand: "Rolex",
        price: 8000,
        image: "/images/item3.png",
        description:
          "The Rolex Datejust is a classic timepiece that combines elegance with precision. Featuring automatic movement and water resistance, this watch is perfect for any occasion.",
      },
      {
        id: 4,
        name: "Handbag",
        brand: "Dior",
        price: 3000,
        image: "/images/item4.png",
        description:
          "This elegant Dior handbag combines luxury with functionality. Crafted from premium materials with the iconic Dior design, it's the perfect accessory for the modern woman.",
      },
      {
        id: 5,
        name: "Clover Bracelet",
        brand: "Van Cleef & Arpels",
        price: 1000,
        image: "/images/item5.png",
        description:
          "The Van Cleef & Arpels Clover bracelet is a delicate piece of jewelry that embodies elegance and sophistication. Made with precious metals and stones, it's a timeless addition to any collection.",
      },
    ],
  },
  {
    id: 5,
    slug: "ultimate-techy",
    title: "The Ultimate Techy",
    ambassadorName: "Fanboxes",
    ambassadorSlug: "fanboxes",
    ambassadorImage: "/images/profile2bg.png",
    spinCost: "125",
    prizeItems: [
      {
        name: "Rolex Watch",
        image: "/images/item1.png",
        size: 120,
      },
      {
        name: "Hermes Bag",
        image: "/images/item2.png",
        size: 140,
      },
      {
        name: "AirPods Pro",
        image: "/images/item3.png",
        size: 160,
      },
      {
        name: "Dior Bag",
        image: "/images/item4.png",
        size: 130,
      },
      {
        name: "Van Cleef Bracelet",
        image: "/images/item5.png",
        size: 110,
      },
    ],
    contents: [
      {
        id: 1,
        name: "AirPods Pro",
        brand: "Apple",
        price: 250,
        image: "/images/item1.png",
        description:
          "Beautiful rich sound – less background noise. Apple AirPods Pro are built around the H2 chip, and its algorithms play a massive part in producing vivid audio. It processes sound quickly for higher fidelity audio and works with the custom-built driver and amplifier for crisp, distortion-free music.",
      },
      {
        id: 2,
        name: "Birkin Bag",
        brand: "Hermes",
        price: 20000,
        image: "/images/item2.png",
        description:
          "The iconic Hermès Birkin bag is a symbol of luxury and craftsmanship. Made from the finest leather with meticulous attention to detail, this timeless piece is both a fashion statement and an investment.",
      },
      {
        id: 3,
        name: "Datejust",
        brand: "Rolex",
        price: 8000,
        image: "/images/item3.png",
        description:
          "The Rolex Datejust is a classic timepiece that combines elegance with precision. Featuring automatic movement and water resistance, this watch is perfect for any occasion.",
      },
      {
        id: 4,
        name: "Handbag",
        brand: "Dior",
        price: 3000,
        image: "/images/item4.png",
        description:
          "This elegant Dior handbag combines luxury with functionality. Crafted from premium materials with the iconic Dior design, it's the perfect accessory for the modern woman.",
      },
      {
        id: 5,
        name: "Clover Bracelet",
        brand: "Van Cleef & Arpels",
        price: 1000,
        image: "/images/item5.png",
        description:
          "The Van Cleef & Arpels Clover bracelet is a delicate piece of jewelry that embodies elegance and sophistication. Made with precious metals and stones, it's a timeless addition to any collection.",
      },
    ],
  },
];
