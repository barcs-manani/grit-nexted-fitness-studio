import { useEffect } from "react";

export function useClickOutside(ref, onOutsideClick, enabled=true) {
    useEffect(() => {
        if (!enabled) return;

        const handleOutsideClick = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                onOutsideClick(event);
            }
        }
        document.addEventListener("mousedown", handleOutsideClick);
        return ()=> {document.removeEventListener("mousedown", handleOutsideClick);}
    }, [ref, onOutsideClick, enabled]);
}