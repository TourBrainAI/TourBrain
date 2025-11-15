import { HeroSection } from "./components/hero-section";
import { RoleChooserSection } from "./components/role-chooser-section";
import { ProductPillarsSection } from "./components/product-pillars-section";
import { ToolJugglingSection } from "./components/tool-juggling-section";
import { HowItWorksSection } from "./components/how-it-works-section";
import { ScreenshotsSection } from "./components/screenshots-section";
import { WaitlistSection } from "./components/waitlist-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <RoleChooserSection />
      <ProductPillarsSection />
      <ToolJugglingSection />
      <HowItWorksSection />
      <ScreenshotsSection />
      <WaitlistSection />
    </>
  );
}
