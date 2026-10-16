import { HeroNav } from "../../data/Navigation"
import { GritLogo } from "./brand/GritLogo"

const PrimaryNav = () => {
    return (
        <nav id="hero-nav" className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <GritLogo />
            <ul className="flex gap-4 sm:gap-[3vw] xl:gap-9 list-none hero-nav-menu">
                {HeroNav.map((nv, idx) => (
                    <li key={idx}>
                        <a href={nv.link} className="relative py-1.5 text-white opacity-85 font-semibold no-underline transition-colors delay-200 ease-in-out">
                            {nv.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export { PrimaryNav }