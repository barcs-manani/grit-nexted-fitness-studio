import "../styles/Home.css"


export const Hero = () => {
    return (
        <div id="hero" className="relative w-full min-h-[88vh] max-h-190 flex justify-center hero-cntr">
            <div className="w-full max-w-(--max-w) pt-7 px-(--gutter) pb-[clamp(48px, 8vw, 88px)]">
                <nav id="hero-nav" className="w-full flex justify-between items-center gap-4">
                    <span className="grid col-span-2 gap-0.5 items-end">
                        <span id="logo" className="font-display font-bold text-white text-[44px] tracking-[0.06em] leading-none">GR<span className="text-(--ice)">I</span>T</span>
                        <span id="logo-text" className="max-w-[8ch] text-white capitalize leading-1 mb-0.5">Fitness Studio</span>
                    </span>
                    <ul className="flex gap-[clamp(16px, 3vw, 36px)] list-none hero-nav-menu">
                        <li><a href="#hero">Home</a></li>
                        <li><a href="#schedule">Schedule</a></li>
                        <li><a href="#trainers">Trainers</a></li>
                        <li><a href="#member-tiers">Pricing</a></li>
                    </ul>
                </nav>
                <div className="flex flex-col items-start gap-5 max-w-180 hero-content">
                    <h1 className="text-white font-bold text-[clamp(44px, 9vw, 92px)] uppercase leading-[0.98]">
                        <span>G</span>reatness <span>R</span>equires <span>I</span>nternal <span>T</span>oughness
                        </h1>
                    <p className="text-[clamp(18px, 2.6vw, 24px)] font-medium max-w-[34ch] opacity-15">Build Strength, Grow Endurance and Enjoy Longevity</p>
                    <a id="hero-btn" href="#schedule" className="inline-block p-(--btn-padding) bg-(--blue) text-white font-semibold rounded-(--btn-radius) no-underline delay-200 ease-in-out hover:bg-(--blue-dark) hover:-translate-y-0.5  transition-colors">Get Started</a>
                </div>
            </div>
        </div>
    );
}