import { Hero } from "@/components/home/Hero";
import { ScrollSenseNavigation } from "@/components/home/ScrollSenseNavigation";
import { Pricing } from "@/components/home/sections/Pricing";
import { Schedule } from "@/components/home/sections/Schedule";
import { Trainers } from "@/components/home/sections/Trainers";
import { Footer } from "@/components/shared/Footer";
import { BaseDataProvider } from "@/contexts/BaseDataContext";
import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  const accountInfo = await getCurrentUser();
  return (
    <>
      <ScrollSenseNavigation accountInfo={accountInfo} />
      <Hero />
      <BaseDataProvider>
        <main className="w-full">
          <Schedule />
          <Trainers />
          <Pricing />
        </main>
        <Footer />
      </BaseDataProvider>
    </>
  );
}