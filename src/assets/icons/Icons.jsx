/*----------------C---------------*/
const Chevron = ({
    rotate = "",
    weight = 200
}) => {
    if (typeof rotate !== "string")
        return <></>;
    if (typeof weight !== "number")
        return <></>;

    const rotationsByAngle = {
        "270": "rotate-270",
        "180": "rotate-180",
        "90": "rotate-90"
    };
    const rotation = rotationsByAngle[rotate] ?? "";
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

const Close = (props) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            opacity={0.5}
            d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
            fill="#1C274C"
        />
        <path
            d="M8.96967 8.96967C9.26256 8.67678 9.73744 8.67678 10.0303 8.96967L12 10.9394L13.9697 8.96969C14.2626 8.6768 14.7374 8.6768 15.0303 8.96969C15.3232 9.26258 15.3232 9.73746 15.0303 10.0304L13.0607 12L15.0303 13.9696C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0304 15.0303C9.73746 15.3232 9.26258 15.3232 8.96969 15.0303C8.6768 14.7374 8.6768 14.2626 8.96969 13.9697L10.9394 12L8.96967 10.0303C8.67678 9.73744 8.67678 9.26256 8.96967 8.96967Z"
            fill="currentColor"
        />
    </svg>
);

/*----------------H---------------*/
const HamburgerMenu = (props) => (
    <svg
        viewBox="0 -1 20 20"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        {...props}
    >
        <title>{"hamburger"}</title>
        <desc>{"Created with Sketch Beta."}</desc>
        <defs />
        <g
            id="Page-1"
            stroke="none"
            strokeWidth={1}
            fill="none"
            fillRule="evenodd"
        >
            <g
                id="Icon-Set"
                transform="translate(-210.000000, -887.000000)"
                fill="currentColor"
            >
                <path
                    d="M229,895 L211,895 C210.448,895 210,895.448 210,896 C210,896.553 210.448,897 211,897 L229,897 C229.552,897 230,896.553 230,896 C230,895.448 229.552,895 229,895 L229,895 Z M229,903 L211,903 C210.448,903 210,903.448 210,904 C210,904.553 210.448,905 211,905 L229,905 C229.552,905 230,904.553 230,904 C230,903.448 229.552,903 229,903 L229,903 Z M211,889 L229,889 C229.552,889 230,888.553 230,888 C230,887.448 229.552,887 229,887 L211,887 C210.448,887 210,887.448 210,888 C210,888.553 210.448,889 211,889 L211,889 Z"
                    id="hamburger"
                />
            </g>
        </g>
    </svg>
);

/*--------------------------- Export --------------------------------*/
export { Chevron, HamburgerMenu, Close }