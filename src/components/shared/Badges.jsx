const PromoBadge01 = ({
    display = false,
    text = "",
    design = "pill", // pill, basic
    xPosition = "right", // right, left, center
    yPosition = "border-float", // border-float, border-sink
    txtSize = "small", // xsmall, small, medium, large, larger, xlarge
    theme = "primary" // primary, secondary, extra
}) => {
    const radius = design === "pill"
        ? "rounded-[999px]"
        : design === "basic"
            ? "rounded-(--card-radius)"
            : "";
    const xfloat = xPosition === "right"
        ? "right-[5%]"
        : xPosition === "left"
            ? "left-[5%]"
            : "left-[50%]";
    const yfloat = yPosition === "border-float"
        ? "-top-[4%]"
        : yPosition === "border-sink"
            ? "top-[4%]"
            : "";
    const fontSize = txtSize === "xsmall"
        ? "text-xs"
        : txtSize === "small"
            ? "text-sm"
            : txtSize === "large"
                ? "text-lg"
                : txtSize === "xlarge"
                    ? "text-xl"
                    : "text-md";
    const splash = theme === "primary"
        ? "text-white bg-(--blue)"
        : theme === "secondary"
            ? "text-white bg-(--violet)"
            : "border border-(--line) text-(--ink-soft) bg-(--bg)";
    if (!display) return null;
    return (
        <div className={`absolute ${yfloat} ${xfloat} ${radius} px-3 py-0.5 flex items-center justify-center ${fontSize} ${splash}`}>
            {text}
        </div>
    );
};

export { PromoBadge01 }