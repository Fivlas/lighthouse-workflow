export default async function Doc({ params }: PageProps<"/docs/[...slug]">) {
  const { slug } = await params;
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Docs: {slug.join(" / ")}</h1>
    </main>
  );
}
