import { useState } from "react";

const Filters = ({
    fields = [],
    setSelected,
    xPosition = "center"
}) => {
    const justify = xPosition === "center"
        ? "justify-center"
        : xPosition === "right"
            ? "justify-end"
            : "justify-start";

    const [localSelect, setLocalSelect] = useState([]);
    const handleSelect = (field) => {
        const nextSelect = localSelect.includes(field)
            ? localSelect.filter((f) => f !== field)
            : [
                ...localSelect,
                field
            ];
        setLocalSelect(nextSelect);
        if (typeof setSelected === "function") {
            setSelected(nextSelect);
        }
    };

    if (!fields.length) return <></>;
    return (
        <div className={`w-full flex ${justify} items-center flex-wrap gap-2`}>
            {fields.map((f, idx) => {
                const selected = localSelect.includes(f);
                return (
                    <button
                        key={idx}
                        className={`py-1.5 px-3.5 ${selected ? 'bg-(--blue) text-white' : 'bg-(--bg) text-(--ink-soft)'} font-semibold no-underline rounded-(--btn-radius) cursor-pointer transition-colors delay-200 ease-in-out hover:bg-(--ice)`}
                        onClick={() => handleSelect(f)}
                    >
                        {f}
                    </button>
                )
            })}
        </div>
    );
};

export { Filters }