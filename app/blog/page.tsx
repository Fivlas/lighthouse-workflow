// Intentional a11y failures to trigger the Lighthouse PR comment: color-contrast, heading-order, link-name, image-alt.
export default function Page() {
  return (
    <main className="p-8" style={{ background: "#fff" }}>
      <p style={{ color: "#eee" }}>Low-contrast text that fails color-contrast.</p>
      <h4 className="text-2xl font-semibold">Blog</h4>
      <a href="/blog/hello">
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img src="/file.svg" width={32} height={32} />
      </a>
      <p className="text-zinc-300">Latest posts, in very low contrast.</p>
    </main>
  );
}
