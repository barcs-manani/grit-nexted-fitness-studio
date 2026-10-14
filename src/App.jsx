import { Footer } from "./components/shared/Footer"
import { Hero } from "./components/home/Hero"
import { Pricing } from "./components/home/sections/Pricing"
import { Schedule } from "./components/home/sections/Schedule"
import { Trainers } from "./components/home/sections/Trainers"

function App() {
  return (
    <>
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
