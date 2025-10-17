"use client";

import { Button } from "@/components/Button";

export default function AmbassadorCategories({
  categories = [],
  selectedCategory = "all",
  onCategoryChange = () => {},
}) {
  // Always include the "All" category at the start
  const allCategory = { _id: "all", name: "All" };

  const categoriesToUse = [allCategory, ...categories];

  return (
    <section className="my-2">
      <div className="flex flex-wrap gap-1 sm:gap-2">
        {categoriesToUse.map((category) => (
          <Button
            key={category._id}
            onClick={() => onCategoryChange(category._id)}
            className={`rounded-full transition-all duration-200 ${
              selectedCategory === category._id
                ? "text-black bg-[#11F2EB] border-[#11F2EB]"
                : "text-white bg-[#98989F] border-[#98989F]"
            } text-xs px-2 py-1 sm:text-sm sm:px-3 sm:py-2`}
            style={{
              borderRadius: "9999px",
            }}
          >
            <span className="whitespace-nowrap">{category.name}</span>
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
