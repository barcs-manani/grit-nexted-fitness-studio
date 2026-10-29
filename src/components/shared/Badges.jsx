const radiusByDesign = {
    pill: "rounded-[999px]",
    basic: "rounded-(--card-radius)"
};

const xPositionClasses = {
    right: "right-[5%]",
    left: "left-[5%]",
    center: "left-[50%]"
};

const yPositionClasses = {
    "border-float": "-top-[4%]",
    "border-sink": "top-[4%]"
};

const fontSizeClasses = {
    xsmall: "text-xs",
    small: "text-sm",
    large: "text-lg",
    xlarge: "text-xl"
};

const themeClasses = {
    primary: "text-white bg-(--blue)",
    secondary: "text-white bg-(--violet)",
    extra: "border border-(--line) text-(--ink-soft) bg-(--bg)"
};

const PromoBadge01 = ({
    display = false,
    text = "",
    design = "pill", // pill, basic
    xPosition = "right", // right, left, center
    yPosition = "border-float", // border-float, border-sink
    txtSize = "small", // xsmall, small, medium, large, larger, xlarge
    theme = "primary", // primary, secondary, extra
    fullCustom = "" // Full tailwind script
}) => {
    const radius = radiusByDesign[design] ?? "";
    const xfloat = xPositionClasses[xPosition] ?? xPositionClasses.center;
    const yfloat = yPositionClasses[yPosition] ?? "";
    const fontSize = fontSizeClasses[txtSize] ?? "text-md";
    const splash = themeClasses[theme] ?? themeClasses.extra;

    const styles = fullCustom.trim()
        ? fullCustom
        : `absolute ${yfloat} ${xfloat} ${radius} px-3 py-0.5 flex items-center justify-center ${fontSize} ${splash}`;

    if (!display) return null;
    return (
        <div className={styles}>
            {text}
        </div>
    );
};

const DataBadge = ({ children, active = false }) => (
    <span
        className={`inline-block rounded-(--btn-radius) px-2.5 py-0.5 text-sm font-semibold ${active
            ? "bg-(--ice)/60 text-(--blue-dark)"
            : "border border-(--line) text-(--ink-soft)"
            }`}
    >
        {children}
    </span>
);

export { DataBadge, PromoBadge01 }