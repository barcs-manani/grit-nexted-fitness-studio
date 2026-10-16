import { Footer } from "./components/shared/Footer"
import { Hero } from "./components/home/Hero"
import { Pricing } from "./components/home/sections/Pricing"
import { Schedule } from "./components/home/sections/Schedule"
import { Trainers } from "./components/home/sections/Trainers"
import { PrimaryNav } from "./components/shared/Navigation"
import { useEffect, useState } from "react"
import { useScrollDetect } from "./hooks/useScrollDetect"

function App() {
  const isScrolled = useScrollDetect(0);
  const [navTheme, setNavTheme] = useState("dark");

  useEffect(() => {
    const hero = document.querySelector('#hero');
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setNavTheme(entry.isIntersecting ? "dark" : "light"),
      { rootMargin: "-80px 0px 0px 0px" } // MAtch the navbar's height
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <PrimaryNav theme={navTheme} isScrolled={isScrolled} />
      <Hero />
      <main>
        <Schedule />
        <Trainers />
        <Pricing />
      </main>
      <Footer />
    </>
  )
}

export default App
