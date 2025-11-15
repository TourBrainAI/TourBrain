import { MainNav } from "./components/main-nav";
import { SiteFooter } from "./components/site-footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-950 text-white">
      <MainNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
