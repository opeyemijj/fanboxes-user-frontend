import BoxCard from "@/components/_main/BoxCard";

export default function AmbassadorTopSidebar({ ambassador, boxes }) {
  console.log("AmbassadorTopSidebar boxes:", boxes);

  // Sort boxes: featured first, then by visitedCount (descending), then by createdAt (descending)
  const sortedBoxes = [...boxes].sort((a, b) => {
    return (
      b.isFeatured - a.isFeatured ||
      b.visitedCount - a.visitedCount ||
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  });

  const topBoxes = sortedBoxes.slice(0, 5);

  return (
    <aside className="bg-[#EFEFEF] p-6 rounded-lg sticky top-24 mb-8">
      <h3 className="text-xl font-bold mb-4">{ambassador?.title}'s Top 5</h3>
      <div className="space-y-4">
        {topBoxes.map((box) => (
          <BoxCard key={box._id} box={box} />
        ))}
      </div>
    </aside>
  );
}
