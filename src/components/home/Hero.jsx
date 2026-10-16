import { H1 } from "../../data/H1";
import "../../styles/Home.css"


export const Hero = () => {
    return (
        <div id="hero" className="relative w-full min-h-[88vh] max-h-190 flex justify-center hero-cntr">
            <div className="w-full max-w-(--max-w) flex flex-col justify-end items-start pb-12 sm:pb-[8vw] xl:pb-22 px-(--gutter) gap-5 hero-content">
                <h1 className="text-white font-bold text-[44px] sm:text-[9vw] xl:text-[92px] uppercase leading-[0.98]">
                    {H1.map((txt, idx) => (
                        <span key={idx}><span className="text-(--ice)">{txt.first}</span>{txt.rest} </span>
                    ))}
                </h1>
                <p className="text-[18px] sm:text-[2.6vw] xl:text-[24px] font-medium max-w-[34ch] text-white opacity-85">Build Strength, Grow Endurance and Enjoy Longevity</p>
                <a id="hero-btn" href="#schedule" className="inline-block p-(--btn-padding) bg-(--blue) text-white font-semibold rounded-(--btn-radius) no-underline delay-200 ease-in-out hover:bg-(--blue-dark) hover:-translate-y-0.5  transition-colors">Get Started</a>
            </div>
        </div>
    );
}