// Colours: "ring" is the spinner itself (faint track + solid arc), "overlay" is the dim layer used by position="fullscreen".
const variants = {
    blue: { ring: "border-(--ice) border-t-(--blue)", overlay: "bg-(--bg)/70" },
    ink: { ring: "border-(--line) border-t-(--ink)", overlay: "bg-(--bg)/70" },
    white: { ring: "border-white/30 border-t-white", overlay: "bg-(--ink)/60" },
    current: { ring: "border-current/25 border-t-current", overlay: "bg-(--bg)/70" }, // copies the surrounding text colour (handy inside buttons)
};

// Where the spinner sits.
const positions = {
    inline: "inline-flex",                                             // sits in the normal flow, like text
    center: "absolute inset-0 flex items-center justify-center",       // centred inside its parent (parent needs `relative`)
    fullscreen: "fixed inset-0 z-(--z-modal-backdrop) flex items-center justify-center", // covers the whole screen
};

/**
 * Props
 *  - size:      number (pixels) or any CSS size, e.g. 32 or "2rem"      (default 32)
 *  - thickness: number (pixels) or CSS size. Leave out to scale with size
 *  - variant:   "blue" | "ink" | "white" | "current"                    (default "blue")
 *  - position:  "inline" | "center" | "fullscreen"                      (default "inline")
 *  - label:     text read by screen readers                             (default "Loading")
 *  - className: extra classes, e.g. margins like "ml-2"
 */
const Spinner = ({
    size = 32,
    thickness,
    variant = "blue",
    position = "inline",
    label = "Loading",
    className = "",
}) => {
    const { ring, overlay } = variants[variant] ?? variants.blue;
    const dimension = typeof size === "number" ? `${size}px` : size;
    const border = thickness == null
        ? `max(2px, calc(${dimension} / 8))` // one eighth of the size, never thinner than 2px
        : typeof thickness === "number" ? `${thickness}px` : thickness;

    return (
        <span
            role="status"
            className={`${positions[position] ?? positions.inline} ${position === "fullscreen" ? overlay : ""} ${className}`}
        >
            <span
                aria-hidden="true"
                className={`block shrink-0 rounded-full border-solid animate-spin motion-reduce:[animation-duration:2s] ${ring}`}
                style={{ width: dimension, height: dimension, borderWidth: border }}
            />
            <span className="sr-only">{label}</span>
        </span>
    );
};

export { Spinner }