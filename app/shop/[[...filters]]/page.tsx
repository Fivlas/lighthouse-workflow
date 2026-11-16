export default async function Shop({ params }: PageProps<"/shop/[[...filters]]">) {
  const { filters = [] } = await params;
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Shop {filters.length ? `(${filters.join(", ")})` : ""}</h1>
    </main>
  );
}
