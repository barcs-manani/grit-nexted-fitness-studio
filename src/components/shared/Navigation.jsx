import { HeroNav } from "../../data/Navigation"
import { GritLogo } from "./brand/GritLogo"

const PrimaryNav = ({
    theme = "dark",
    isScrolled = false
}) => {
    const styles = theme === "dark" ? {
        lv1: isScrolled ? "bg-black/25 backdrop-blur-sm" : "bg-transparent", // header
        lv2: "", // nav
        lv3: "", // ul
        lv4: "text-white" // li
    }
        : {
            lv1: "bg-(--bg)/85 shadow-sm",
            lv2: "",
            lv3: "",
            lv4: "text-(--blue-dark)"
        };
    return (
        <header className={`fixed inset-x-0 top-0 z-(--z-nav-bar) px-(--gutter) py-3 transition-colors ${styles.lv1}`}>
            <nav id="hero-nav" className="mx-auto w-full max-w-(--max-w) flex flex-col sm:flex-row justify-between items-start sm:items-center px-(--gutter) gap-4">
                <GritLogo theme={theme} />
                <ul className="flex gap-4 sm:gap-[3vw] xl:gap-9 list-none">
                    {HeroNav.map((nv, idx) => (
                        <li key={idx} className={styles.lv4}>
                            <a
                                href={nv.link}
                                className="
                                    relative
                                    py-1.5 
                                    opacity-85 
                                    font-semibold no-underline 
                                    transition-colors duration-200 ease-in-out

                                    hover:text-(--bg) focus-visible:text-(--bg)

                                    after:content-['']
                                    after:absolute after:left-0 after:bottom-0
                                    after:w-full after:h-0.5 
                                    after:bg-(--ice) after:scale-x-0 after:origin-left
                                    after:transition-transform after:duration-250 after:ease-in-out

                                    hover:after:scale-x-100 focus-visible:hover:after:scale-x-100 
                                "
                            >
                                {nv.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
}

export { PrimaryNav }