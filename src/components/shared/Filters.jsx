"use client"
import { useState } from "react";

const horizontalPositions = {
    center: "justify-center",
    right: "justify-end"
};

const Filters = ({
    fields = [],
    selected = [],
    setSelected,
    xPosition = "center"
}) => {
    const justify = horizontalPositions[xPosition] ?? "justify-start";
    const handleSelect = (field) => {
        // console.log("Selected: ", field);
        const nextSelect = selected.includes(field)
            ? selected.filter((f) => f !== field)
            : [
                ...selected,
                field
            ];
        if (typeof setSelected === "function") {
            setSelected(nextSelect);
        }
    };

    if (!fields.length) return null;
    return (
        <div className={`w-full flex ${justify} items-center flex-wrap gap-2`}>
            {fields.map((f) => {
                const marked = selected.includes(f);
                return (
                    <button
                        key={f}
                        type="button"
                        aria-pressed={marked}
                        onClick={() => handleSelect(f)}
                        className={`
                            py-1.5 px-3.5 
                            ${marked 
                                ? 'bg-(--blue) text-white'
                                : 'bg-(--bg) text-(--ink-soft) border border-(--line)'}
                            font-semibold no-underline 
                            rounded-(--btn-radius) 
                            cursor-pointer 
                            transition-colors duration-200 ease-in-out
                            hover:bg-(--ice)
                        `}
                    >
                        {f}
                    </button>
                )
            })}
        </div>
    );
};

export { Filters }