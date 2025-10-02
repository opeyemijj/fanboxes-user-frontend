// "use client";

// import { Button } from "@/components/Button";
// import { useSelector } from "react-redux";

// export default function Categories({
//   categories = [],
//   selectedCategory = "all",
//   onCategoryChange = () => {},
// }) {
//   const {
//     categories: categoriesData = [],
//     loading: categoriesLoading,
//     error,
//   } = useSelector((state) => state.categories);

//   const defaultCategories = [
//     { _id: "all", name: "ALL", slug: "all" },
//     ...categoriesData,
//   ];

//   const categoriesToUse =
//     categories.length > 0 ? categories : defaultCategories;

//   return (
//     <section className="my-2">
//       <div className="flex flex-wrap gap-1 sm:gap-2">
//         {categoriesToUse?.map((category) => (
//           <Button
//             key={category._id}
//             onClick={() => onCategoryChange(category._id)}
//             className={`rounded-full transition-all duration-200 text-xs sm:text-sm px-2 py-1 ${
//               selectedCategory === category._id
//                 ? "text-black bg-[#11F2EB] border-[#11F2EB]"
//                 : "text-white bg-[#98989F] border-[#98989F]"
//             }`}
//             style={{
//               borderRadius: "9999px",
//             }}
//           >
//             {category.name}
//             {selectedCategory === category._id ? (
//               <span className="ml-1 text-[10px] sm:text-xs">×</span>
//             ) : (
//               <span className="ml-1 text-[10px] sm:text-xs">→</span>
//             )}
//           </Button>
//         ))}
//       </div>
//     </section>
//   );
// }

"use client";

import { Button } from "@/components/Button";
import { useSelector } from "react-redux";

export default function Categories({
  categories = [],
  selectedCategory = "all",
  onCategoryChange = () => {},
  selectType = "id", // "id" or "name"
  includeAll = true, // whether to include "all" category
}) {
  const {
    categories: categoriesData = [],
    loading: categoriesLoading,
    error,
  } = useSelector((state) => state.categories);

  // Prepare categories list
  const categoriesToUse = (() => {
    const baseCategories = categories.length > 0 ? categories : categoriesData;

    if (includeAll) {
      return [{ _id: "all", name: "ALL", slug: "all" }, ...baseCategories];
    }

    return baseCategories;
  })();

  // Determine what value to use for selection comparison
  const getCategoryValue = (category) => {
    return selectType === "name" ? category.name : category._id;
  };

  // Determine if a category is selected
  const isCategorySelected = (category) => {
    return selectedCategory === getCategoryValue(category);
  };

  // Handle category click
  const handleCategoryClick = (category) => {
    const value = getCategoryValue(category);
    onCategoryChange(value);
  };

  return (
    <section className="my-2">
      <div className="flex flex-wrap gap-1 sm:gap-2">
        {categoriesToUse?.map((category) => (
          <Button
            key={category._id}
            onClick={() => handleCategoryClick(category)}
            className={`rounded-full transition-all duration-200 text-xs sm:text-sm px-2 py-1 ${
              isCategorySelected(category)
                ? "text-black bg-[#11F2EB] border-[#11F2EB]"
                : "text-white bg-[#98989F] border-[#98989F]"
            }`}
            style={{
              borderRadius: "9999px",
            }}
          >
            {category.name}
            {isCategorySelected(category) ? (
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
