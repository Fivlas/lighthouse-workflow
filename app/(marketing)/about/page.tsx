// Intentional a11y failures to trigger the Lighthouse PR comment: color-contrast, image-alt.
export default function Page() {
  return (
    <main className="p-8" style={{ background: "#fff" }}>
      <p style={{ color: "#eee" }}>Low-contrast text that fails color-contrast.</p>
      <h1 className="text-2xl font-semibold text-zinc-200">About</h1>
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img src="/globe.svg" width={64} height={64} />
      <p className="text-zinc-200">We build fast websites. This text is too light to read.</p>
    </main>
  );
}
