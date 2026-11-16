// Intentional a11y failures to trigger the Lighthouse PR comment: color-contrast, button-name, label, link-name.
export default function Page() {
  return (
    <main className="p-8" style={{ background: "#fff" }}>
      <p style={{ color: "#eee" }}>Low-contrast text that fails color-contrast.</p>
      <h1 className="text-2xl font-semibold">Pricing</h1>
      <input type="email" placeholder="you@example.com" className="border p-2" />
      <button className="ml-2 h-10 w-10 rounded bg-black" />
      <a href="/about" className="block h-6 w-6 bg-zinc-400" />
    </main>
  );
}
