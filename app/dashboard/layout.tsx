export default function DashboardLayout({ children, stats }: LayoutProps<"/dashboard">) {
  return (
    <>
      {children}
      {stats}
    </>
  );
}
