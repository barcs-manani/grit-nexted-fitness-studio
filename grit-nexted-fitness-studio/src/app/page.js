import { Hero } from "@/components/home/Hero";
import { ScrollSenseNavigation } from "@/components/home/ScrollSenseNavigation";
import { Pricing } from "@/components/home/sections/Pricing";
import { Schedule } from "@/components/home/sections/Schedule";
import { Trainers } from "@/components/home/sections/Trainers";
import { Footer } from "@/components/shared/Footer";

export default function Home() {
  return (
    <>
      <ScrollSenseNavigation />
      <Hero />
      <main>
        <Schedule />
        <Trainers />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}