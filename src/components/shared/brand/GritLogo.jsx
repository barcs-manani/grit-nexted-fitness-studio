import { gritLogoDark, gritLogoWhite } from "../../../assets/images";

const GritLogo = ({
    theme = "dark",
    link = "#hero"
}) => {
    const styles = theme === "dark" ? {
        lv1: "text-white",
        lv2: "text-(--ice)"
    } : {
        lv1: "text-(--blue-dark)",
        lv2: "text-(--violet)"
    };
    const imgSrc = theme === "dark"
        ? gritLogoWhite
        : gritLogoDark;
    return (
        <a href={link}>
            <span className="grid grid-cols-2 gap-0.5 items-end">
                <span id="logo" className={`${styles.lv1} font-display font-bold text-[44px] tracking-[0.06em] leading-none flex items-end justify-start`}>
                    {/* items-end for logo to sit on floor */}
                    <span>
                        {/* Letter G Icon */}
                        <img src={imgSrc} alt={`GRIT icon for ${theme}`} className="w-10.5 h-10.5 object-cover" />
                    </span>
                    R<span className={styles.lv2}>I</span>T
                </span>
                <span id="logo-text" className={`${styles.lv1} max-w-[8ch] capitalize leading-5 mb-0.5`}>Fitness Studio</span>
            </span>
        </a>
    );
};

export { GritLogo }