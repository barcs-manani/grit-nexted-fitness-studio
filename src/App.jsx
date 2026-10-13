import { Footer } from "./components/Footer"
import { Hero } from "./components/Hero"
import { Pricing } from "./components/sections/Pricing"
import { Schedule } from "./components/sections/Schedule"
import { Trainers } from "./components/sections/Trainers"

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
