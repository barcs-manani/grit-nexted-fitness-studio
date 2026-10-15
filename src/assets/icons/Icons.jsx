/*----------------C---------------*/
const Chevron = ({ open }) => (
    <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className={`size-5 shrink-0 text-(--ink-soft) transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M5 7.5l5 5 5-5" />
    </svg>
);

/*--------------------------- Export --------------------------------*/
export { Chevron }