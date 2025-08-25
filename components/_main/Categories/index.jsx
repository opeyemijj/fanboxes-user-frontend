"use client";

import { Button } from "@/components/Button";
import { useSelector } from "react-redux";

export default function Categories({
  categories = [],
  selectedCategory = "all",
  onCategoryChange = () => {},
}) {
  const {
    categories: categoriesData,
    loading: categoriesLoading,
    error,
  } = useSelector((state) => state.categories);
  // If no categories provided, use default static categories
  // const defaultCategories = [
  //   { _id: "all", name: "ALL", slug: "all" },
  //   { id: "tech", name: "TECH", slug: "tech" },
  //   { id: "gaming", name: "GAMING", slug: "gaming" },
  //   { id: "beauty", name: "BEAUTY", slug: "beauty" },
  //   { id: "lifestyle", name: "LIFESTYLE", slug: "lifestyle" },
  //   { id: "fitness", name: "FITNESS & HEALTH", slug: "fitness-health" },
  //   { id: "food", name: "FOOD & BEVERAGE", slug: "food-beverage" },
  //   { id: "travel", name: "TRAVEL", slug: "travel" },
  //   {
  //     id: "collectors",
  //     name: "COLLECTORS / HOBBYISTS",
  //     slug: "collectors-hobbyists",
  //   },
  //   { id: "diy", name: "DIY / CRAFT", slug: "diy-craft" },
  //   { id: "family", name: "FAMILY", slug: "family" },
  //   { id: "books", name: "BOOKS & LITERATURE", slug: "books-literature" },
  //   {
  //     id: "entertainment",
  //     name: "ENTERTAINMENT & CELEBRITIES",
  //     slug: "entertainment-celebrities",
  //   },
  //   { id: "jewellery", name: "JEWELLERY", slug: "jewellery" },
  //   { id: "cars", name: "CARS & BIKES", slug: "cars-bikes" },
  //   { id: "sports", name: "SPORTS", slug: "sports" },
  //   { id: "onlyfans", name: "ONLY FANS", slug: "only-fans" },
  //   { id: "crypto", name: "STOCKS & CRYPTO", slug: "stocks-crypto" },
  // ];

  const defaultCategories = [
    { _id: "all", name: "ALL", slug: "all" },
    ...categoriesData,
  ];

  const categoriesToUse =
    categories.length > 0 ? categories : defaultCategories;

  return (
    <section className="my-2">
      <div className="flex flex-wrap gap-1 sm:gap-2">
        {categoriesToUse?.map((category) => (
          <Button
            key={category._id}
            onClick={() => onCategoryChange(category._id)}
            className={`rounded-full transition-all duration-200 text-xs sm:text-sm px-2 py-1 ${
              selectedCategory === category._id
                ? "text-black bg-[#11F2EB] border-[#11F2EB]"
                : "text-white bg-[#98989F] border-[#98989F]"
            }`}
            style={{
              borderRadius: "9999px",
            }}
          >
            {category.name}
            {selectedCategory === category._id ? (
              <span className="ml-1 text-[10px] sm:text-xs">×</span>
            ) : (
              <span className="ml-1 text-[10px] sm:text-xs">→</span>
            )}
          </Button>
        ))}
      </div>
    </section>
  );
}
