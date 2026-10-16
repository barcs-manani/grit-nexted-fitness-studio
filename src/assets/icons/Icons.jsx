/*----------------C---------------*/
const Chevron = ({
    rotate = "",
    weight = 200
}) => {
    if (typeof rotate !== "string")
        return <></>;
    if (typeof weight !== "number")
        return <></>;

    const rotation = !rotate || !rotate.trim()
        ? ""
        : rotate === "180"
            ? "rotate-180"
            : rotate === "90"
                ? "rotate-90"
                : rotate === "270"
                    ? "rotate-270"
                    : "";

    const font_weight = weight / 100;

    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className={`size-5 shrink-0 transition-transform duration-300 ${rotation}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={font_weight}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 7.5l5 5 5-5" />
        </svg>
    );
};

/*--------------------------- Export --------------------------------*/
export { Chevron }