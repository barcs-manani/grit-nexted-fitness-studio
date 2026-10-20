"use client"

import { useScrollDetect } from "@/hooks/useScrollDetect";
import { useEffect, useState } from "react";
import { PrimaryNav } from "../shared/Navigation";

export function ScrollSenseNavigation() {
    const isScrolled = useScrollDetect({ threshold: 0 });
    const [navTheme, setNavTheme] = useState("dark");

    useEffect(() => {
        const hero = document.querySelector('#hero');
        if (!hero) return;

        const observer = new IntersectionObserver(
            ([entry]) => setNavTheme(entry.isIntersecting ? "dark" : "light"),
            { rootMargin: "-80px 0px 0px 0px" } // MAtch the navbar's height
        );

        observer.observe(hero);
        return () => observer.disconnect();
    }, []);

    return <PrimaryNav theme={navTheme} isScrolled={isScrolled} />
}