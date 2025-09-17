import BoxCard from "@/components/_main/BoxCard";
import { ambassadorBoxesData } from "@/lib/ambassadors-data";

export default function AmbassadorBoxes({ ambassador, boxes }) {
  // console.log(boxes, "What kind's of box are coming here?");
  const ambassadorBoxes =
    boxes ||
    ambassadorBoxesData.filter((box) => box.ambassadorId === ambassador.id);

  return (
    <section
      className="mb-12 p-6 rounded-lg"
      style={{ backgroundColor: "#EFEFEF" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {ambassadorBoxes?.map((box) => (
          <BoxCard key={box._id} box={box} />
        ))}
      </div>
    </section>
  );
}
