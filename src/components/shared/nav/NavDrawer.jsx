"use client"

import { Close } from "@/assets/icons/C/icons";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useRef } from "react";

/* ---------- Drawer: one panel used by both menus ---------- */
const Drawer = ({ open, onClose, title, children }) => {
    const dialogRef = useRef(null);
    useClickOutside(dialogRef, () => onClose()); // Clicking backdrop closes the drawer.

    if (!open) return null;
    return (
        // Dark backdrop.
        <div className="fixed inset-0 z-(--z-modal-backdrop) bg-(--ink)/60 flex justify-end">
            {/* White panel. stopPropagation stops clicks inside it from reaching the backdrop. */}
            <div
                role="dialog"
                ref={dialogRef}
                aria-modal="true"
                aria-label={title}
                className="w-80 max-w-[85vw] h-full flex flex-col bg-(--bg) shadow-2xl"
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-(--line)">
                    <h2 className="text-2xl font-bold text-(--ink)">{title}</h2>
                    <button
                        type="button"
                        aria-label={`Close ${title.toLowerCase()}`}
                        onClick={onClose}
                        className="w-10 h-10 flex justify-center items-center rounded-full text-(--bg) hover:text-(--blue) cursor-pointer transition-colors"
                    >
                        <Close />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-3">
                    {children}
                </div>
            </div>
        </div>
    );
};

/* ---------- DrawerItem: one row (icon + text). A link if it has href, otherwise a button ---------- */
const DrawerItem = ({ href, icon: Icon, onClick, children }) => {
    const rowClass = "w-full flex items-center gap-3 px-3 py-2.5 rounded-(--field-radius) text-left font-semibold text-(--ink) no-underline cursor-pointer hover:bg-(--bg-secondary) transition-colors";
    const content = (
        <>
            {/* [&>svg]:size-5 forces the icon inside to 20px */}
            <span className="w-9 h-9 shrink-0 flex justify-center items-center rounded-lg border border-(--line) bg-(--bg) text-(--blue) [&>svg]:size-5">
                {Icon && <Icon />}
            </span>
            {children}
        </>
    );

    return href
        ? <a href={href} onClick={onClick} className={rowClass}>{content}</a>
        : <button type="button" onClick={onClick} className={rowClass}>{content}</button>;
};

export { Drawer, DrawerItem }