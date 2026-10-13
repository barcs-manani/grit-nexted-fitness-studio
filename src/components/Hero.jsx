import { GritLogo } from "../assets/icons/GritLogo";
import { H1 } from "../data/H1";
import { HeroNav } from "../data/Navigation";
import "../styles/Home.css"


export const Hero = () => {
    return (
        <div id="hero" className="relative w-full min-h-[88vh] max-h-190 flex justify-center hero-cntr">
            <div className="w-full max-w-(--max-w) pt-7 px-(--gutter) pb-12 sm:pb-[8vw] xl:pb-22 flex flex-col justify-between">
                <nav id="hero-nav" className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <GritLogo />
                    <ul className="flex gap-4 sm:gap-[3vw] xl:gap-9 list-none hero-nav-menu">
                        {HeroNav.map((nv) => (
                            <li>
                                <a href={nv.link} className="relative py-1.5 text-white opacity-85 font-semibold no-underline transition-colors delay-200 ease-in-out">
                                    {nv.text}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="flex flex-col items-start gap-5 max-w-180 hero-content">
                    <h1 className="text-white font-bold text-[44px] sm:text-[9vw] xl:text-[92px] uppercase leading-[0.98]">
                        {H1.map((txt) => (
                            <span><span className="text-(--ice)">{txt.first}</span>{txt.rest} </span>
                        ))}
                    </h1>
                    <p className="text-[18px] sm:text-[2.6vw] xl:text-[24px] font-medium max-w-[34ch] text-white opacity-85">Build Strength, Grow Endurance and Enjoy Longevity</p>
                    <a id="hero-btn" href="#schedule" className="inline-block p-(--btn-padding) bg-(--blue) text-white font-semibold rounded-(--btn-radius) no-underline delay-200 ease-in-out hover:bg-(--blue-dark) hover:-translate-y-0.5  transition-colors">Get Started</a>
                </div>
            </div>
        </div>
    );
}