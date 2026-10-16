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
        lv4: "text-white", // li
        lv5: "hover:text-(--bg) focus-visible:text-(--bg) after:bg-(--ice)" // a
    }
        : {
            lv1: "bg-(--bg)/65 backdrop-blur-sm shadow-sm",
            lv2: "",
            lv3: "",
            lv4: "text-(--blue-dark)",
            lv5: "hover:text-(--blue-dark) focus-visible:text-(--blue-dark) after:bg-(--blue)"
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
                                className={`
                                    relative
                                    py-1.5 
                                    opacity-85 
                                    font-semibold no-underline 
                                    transition-colors duration-200 ease-in-out

                                    after:content-['']
                                    after:absolute after:left-0 after:bottom-0
                                    after:w-full after:h-0.5 
                                    after:scale-x-0 after:origin-left
                                    after:transition-transform after:duration-250 after:ease-in-out

                                    hover:after:scale-x-100 focus-visible:hover:after:scale-x-100 

                                    ${styles.lv5}
                                `}
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