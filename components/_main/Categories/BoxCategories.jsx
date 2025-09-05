// "use client";

// import { Button } from "@/components/Button";

// export default function BoxCategories({
//   categories = [],
//   selectedCategory = "all",
//   onCategoryChange = () => {},
// }) {
//   return (
//     <section className="my-2">
//       <div className="flex flex-wrap gap-1 sm:gap-2">
//         {categories.map((category) => (
//           <Button
//             key={category._id}
//             onClick={() => onCategoryChange(category._id)}
//             className={`rounded-full transition-all duration-200 text-xs sm:text-sm px-2 py-1 ${
//               selectedCategory === category.id
//                 ? "text-black bg-[#11F2EB] border-[#11F2EB]"
//                 : "text-white bg-[#98989F] border-[#98989F]"
//             }`}
//             style={{
//               // Ensure border radius is maintained
//               borderRadius: "9999px",
//             }}
//           >
//             <span className="whitespace-nowrap">{category.name}</span>
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

export default function BoxCategories({
  categories = [],
  selectedCategory = "all",
  onCategoryChange = () => {},
}) {
  const handleCategoryClick = (categoryId) => {
    // If clicking the same category, unselect it (set to "all")
    if (selectedCategory === categoryId) {
      onCategoryChange("all");
    } else {
      onCategoryChange(categoryId);
    }
  };

  return (
    <section className="my-2">
      <div className="flex flex-wrap gap-1 sm:gap-2">
        {/* Always show "All" category first */}
        <Button
          onClick={() => onCategoryChange("all")}
          className={`rounded-full transition-all duration-200 text-xs sm:text-sm px-2 py-1 ${
            selectedCategory === "all"
              ? "text-black bg-[#11F2EB] border-[#11F2EB]"
              : "text-white bg-[#98989F] border-[#98989F]"
          }`}
          style={{
            borderRadius: "9999px",
          }}
        >
          <span className="whitespace-nowrap">All</span>
          {selectedCategory === "all" ? (
            <span className="ml-1 text-[10px] sm:text-xs">×</span>
          ) : (
            <span className="ml-1 text-[10px] sm:text-xs">→</span>
          )}
        </Button>

        {/* Render other categories */}
        {categories.map((category) => (
          <Button
            key={category._id}
            onClick={() => handleCategoryClick(category._id)}
            className={`rounded-full transition-all duration-200 text-xs sm:text-sm px-2 py-1 ${
              selectedCategory === category._id
                ? "text-black bg-[#11F2EB] border-[#11F2EB]"
                : "text-white bg-[#98989F] border-[#98989F]"
            }`}
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
