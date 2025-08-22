import { BoxCard } from "./box-card";
import { latestBoxes } from "@/lib/data-v2";

export default function LatestBoxes() {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">Latest boxes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {latestBoxes.map((box) => (
          <BoxCard key={box.id} box={box} />
        ))}
      </div>
    </section>
  );
}
