import { useEffect, useState } from "react";

export function useScrollDetect({
    threshold = 0
}) {
    const [isPastThreshold, setIsPastThreshold] = useState(false);
    useEffect(() => {
        const update = () => {
            setIsPastThreshold(window.scrollY > threshold);
        }

        update(); // Read current position on page mount
        window.addEventListener("scroll", update, { passive: true });
        return () => window.removeEventListener("scroll", update);
    }, [threshold]);

    return isPastThreshold;
}