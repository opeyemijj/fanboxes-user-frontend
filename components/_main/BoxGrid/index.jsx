import BoxCard from "@/components/_main/BoxCard";

export default function BoxGrid({ boxes = [] }) {
  if (!boxes || boxes.length === 0) {
    return (
      <section>
        <h2 className="text-2xl font-bold mb-6">All boxes</h2>
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No boxes found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters or search terms
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">All boxes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {boxes.map((box) => (
          <BoxCard key={box.id} box={box} />
        ))}
      </div>
    </section>
  );
}
