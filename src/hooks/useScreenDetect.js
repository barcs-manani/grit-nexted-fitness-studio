import { useState, useEffect } from "react";

export function useScreenDetect() {
    const [deviceType, setDeviceType] = useState(null); // 'mobile', 'tablet', etc
    const [deviceWidth, setDeviceWidth] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (typeof window === "undefined") return;

        let timeout;

        const detectDevice = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const width = window.innerWidth;
                setDeviceWidth(window.innerWidth);
                if (width < 640) {
                    setDeviceType("mobile");
                } else if (width >= 640 && width < 1024) {
                    setDeviceType("tablet");
                } else if (width >= 1024 && width < 1279) {
                    setDeviceType("small-desktop");
                } else if (width >= 1280 && width < 1535) {
                    setDeviceType("base-desktop");
                } else {
                    setDeviceType("wide-desktop");
                }

                setIsLoading(false); // only set once width is determined
            }, 150);
        };

        detectDevice(); // Initial check
        window.addEventListener("resize", detectDevice);
        return () => window.removeEventListener("resize", detectDevice);
    }, []);

    return {
        deviceType,
        deviceWidth,
        isLoading,
        isMobile: deviceType === "mobile",
        isTablet: deviceType === "tablet",
        isSmDesktop: deviceType === "small-desktop",
        isBsDesktop: deviceType === "base-desktop",
        isWdDesktop: deviceType === "wide-desktop"
    };
};