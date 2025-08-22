import BoxCard from "@/components/_main/BoxCard";

export default function AmbassadorTopSidebar({ ambassador, boxes }) {
  const topBoxes = boxes;

  return (
    <aside className="bg-[#EFEFEF] p-6 rounded-lg sticky top-24">
      <h3 className="text-xl font-bold mb-4">{ambassador.title}'s Top 5</h3>
      <div className="space-y-4">
        {topBoxes.map((box) => (
          <BoxCard key={box._id} box={box} />
        ))}
      </div>
    </aside>
  );
}
