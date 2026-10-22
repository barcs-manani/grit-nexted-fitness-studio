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

export { Close, Chevron }