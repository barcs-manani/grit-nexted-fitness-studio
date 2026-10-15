import { useState } from "react";

const Filters = ({
    fields = [],
    setSelected
}) => {
    const [localSelect, setLocalSelect] = useState([]);
    const handleSelect = (field) => {
        if (localSelect.includes(field)) {
            setLocalSelect((prev) => {
                return prev.filter(i => i !== field)
            })
        } else {
            setLocalSelect((prev) => {
                return [
                    ...prev,
                    field
                ]
            })
        }
        if (typeof setSelected === "function") {
            setSelected(localSelect);
        }
    };

    if (!fields.length) return <></>;
    return (
        <div className="flex flex-wrap gap-2">
            {fields.map((f, idx) => {
                const selected = localSelect.includes(f);
                return (
                <button
                    key={idx}
                    className={`py-1.5 px-3.5 ${selected ? 'bg-(--blue) text-white' : 'bg-(--bg) text-(--ink-soft)'} font-semibold no-underline rounded-(--btn-radius) transition-colors delay-200 ease-in-out hover:bg-(--blue-dark)`}
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