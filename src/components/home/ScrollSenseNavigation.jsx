"use client"

import { useScrollDetect } from "@/hooks/useScrollDetect";
import { useEffect, useState } from "react";
import { MainNav } from "../shared/nav/Main";
import { useScreenDetect } from "@/hooks/useScreenDetect";

export function ScrollSenseNavigation({
    accountInfo
}) {
    const { isTablet, isMobile } = useScreenDetect();
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
    // console.log("Nav theme: ", navTheme);

    return (
        <MainNav
            theme={navTheme}
            isScrolled={isScrolled}
            menu={isTablet || isMobile ? "mini" : "full"}
            accountInfo={accountInfo}
        />
    );
}