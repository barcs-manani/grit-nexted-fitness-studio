"use client"

import { HeroNav } from "@/data/Navigation";
import { GritLogo } from "./brand/GritLogo";
import { Close, HamburgerMenu } from "@/assets/icons/Icons";
import { useState } from "react";
import { LoginModal } from "./modals/Login";
import { RegistrationModal } from "./modals/Registration";


const OverlayMenu = ({
    onClose
}) => (
    <div className="fixed inset-0 z-(--z-modal-backdrop) bg-(--ink)/75 flex justify-end items-start">
        <div
            aria-modal="true"
            aria-labelledby="overlay-menu"
            className="absolute z-(--z-modal) top-0 right-0 bottom-0 bg-(--bg)/85 w-75 pl-5 sm:pl-10"
        >
            <div className="flex w-full justify-end items-start p-2">
                <button
                    onClick={onClose}
                    className="w-10 h-10 text-(--bg) flex justify-center items-center cursor-pointer"
                >
                    <Close />
                </button>
            </div>
            <ul className="flex flex-col divider-y divider-(--line) gap-4 sm:gap-[3vh] xl:gap-9 list-none">
                {HeroNav.map((nv, idx) => (
                    <li key={idx} className="text-(--blue-dark)">
                        <a
                            href={nv.link}
                            className="
                                    relative
                                    py-1.5 
                                    opacity-85 
                                    font-semibold no-underline 
                                    transition-colors duration-200 ease-in-out

                                    after:content-['']
                                    after:absolute after:left-0 after:bottom-0
                                    after:w-full after:h-0.5 
                                    after:scale-x-0 after:origin-left
                                    after:transition-transform after:duration-250 after:ease-in-out

                                    hover:after:scale-x-100 focus-visible:hover:after:scale-x-100 

                                    hover:text-(--blue-dark) focus-visible:text-(--blue-dark) after:bg-(--blue)
                                "
                        >
                            {nv.text}
                        </a>
                    </li>
                ))}
            </ul>

        </div>
    </div>
);

const PrimaryNav = ({
    theme = "dark", // dark, light
    isScrolled = false,
    menu = "full", // full, mini
    accountInfo = null,
}) => {
    const isSignedIn = accountInfo?.id ?? false;
    const themeStyles = {
        dark: {
            lv1: isScrolled ? "bg-black/25 backdrop-blur-sm" : "bg-transparent", // header
            // lv2: "", // nav, lv3: "", // div, lv4: "", // ul,
            lv5: "text-white", // li
            lv6: "hover:text-(--bg) focus-visible:text-(--bg) after:bg-(--ice)", // a
            lv7: "bg-(--bg) text-(--blue) hover:bg-(--ice)", // button
            lv7_2: "text-(--bg)"
        },
        light: {
            lv1: "bg-(--bg)/65 backdrop-blur-sm shadow-sm",
            // lv2: "", lv3: "", lv4: "",
            lv5: "text-(--blue-dark)",
            lv6: "hover:text-(--blue-dark) focus-visible:text-(--blue-dark) after:bg-(--blue)",
            lv7: "bg-(--blue) text-(--bg) hover:bg-(--blue-dark)",
            lv7_2: "text-(--blue)"
        }
    };
    const styles = themeStyles[theme] ?? themeStyles.light;
    const [openNavMenu, setOpenNavMenu] = useState(false);
    const [openLogin, setOpenLogin] = useState(false);
    const [openReg, setOpenReg] = useState(false);
    const [openAccountMenu, setOpenAccountMenu] = useState(false);
    const [ageGroups, setAgeGroups] = useState([]);
    const [branchLocations, setBranchLocations] = useState([]);

    const handleAuthSwitch = async (currentType) => {
        if (currentType === "signup") {
            setOpenReg(false);
            setOpenLogin(true);
        } else if (currentType === "login") {
            try {
                const [ageResponse, branchResponse] = await Promise.all([
                    fetch("/api/base/age-groups", { cache: "no-store" }),
                    fetch("/api/base/branch-locations", { cache: "no-store" }),
                ]);

                const [ages, branches] = await Promise.all([
                    ageResponse.json(),
                    branchResponse.json(),
                ]);

                if (!ageResponse.ok) throw new Error(ages.error || "Could not load age groups");
                if (!branchResponse.ok) throw new Error(branches.error || "Could not load branch locations");
                if (!Array.isArray(ages)) throw new Error("Age groups request returned an invalid response");
                if (!Array.isArray(branches)) throw new Error("Branch locations request returned an invalid response");

                setAgeGroups(ages);
                setBranchLocations(branches);
                setOpenLogin(false);
                setOpenReg(true);
            } catch (error) {
                console.error(error);
                setError(error?.message || "Failed to prepare registration form.");
            }
        }
    }
    const handleSubmit = async (type, creds) => {
        const apis = {
            login: "/api/auth/login",
            signup: "/api/auth/signup"
        };
        const api = apis[type];
        try {
            const response = await fetch(
                api,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(creds),
                }
            );
            const res = await response.json();
            if (!response.ok) throw new Error(res.error || "Login failed");
            return res;
        } catch (err) {
            return err;
        }
    };

    const fullMenu = () => (
        <ul className="flex gap-4 sm:gap-[3vw] xl:gap-9 list-none">
            {HeroNav.map((nv, idx) => (
                <li key={idx} className={styles.lv5}>
                    <a
                        href={nv.link}
                        className={`
                                    relative
                                    py-1.5 
                                    opacity-85 
                                    font-semibold no-underline 
                                    transition-colors duration-200 ease-in-out

                                    after:content-['']
                                    after:absolute after:left-0 after:bottom-0
                                    after:w-full after:h-0.5 
                                    after:scale-x-0 after:origin-left
                                    after:transition-transform after:duration-250 after:ease-in-out

                                    hover:after:scale-x-100 focus-visible:hover:after:scale-x-100 

                                    ${styles.lv6}
                                `}
                    >
                        {nv.text}
                    </a>
                </li>
            ))}
        </ul>
    );

    const miniMenu = () => (
        <button
            type="button"
            className={`${styles.lv7_2} cursor-pointer w-7 h-7`}
            onClick={() => setOpenNavMenu(!openNavMenu)}
        >
            <HamburgerMenu />
        </button>
    );

    const loginButton = () => {
        const currentState = openLogin;
        return (
            <button
                onClick={() => setOpenLogin(!currentState)}
                className={`
                    py-1.5 px-4
                    text-lg font-semibold rounded-(--btn-radius)
                    ${styles.lv7}
                    focus-visible:outline-(--blue) focus-visible:outline-2 focus-visible:outline-offset-2 
                    transition-colors
                `}
            >
                Signin
            </button>
        )
    };

    const profileButton = () => { };

    return (
        <header className={`fixed inset-x-0 top-0 z-(--z-nav-bar) px-(--gutter) py-3 transition-colors ${styles.lv1}`}>
            <nav id="hero-nav" className="relative mx-auto w-full max-w-(--max-w) flex justify-between items-center xl:px-(--gutter) gap-4">
                <GritLogo theme={theme} />
                <div className="flex gap-4 sm:gap-[3vw] xl:gap-9 items-center">
                    {menu === "full"
                        ? fullMenu()
                        : miniMenu()
                    }
                    {isSignedIn
                        ? profileButton()
                        : loginButton()
                    }
                </div>
            </nav>
            {openNavMenu &&
                <OverlayMenu onClose={() => setOpenNavMenu(false)} />
            }
            <LoginModal
                open={openLogin}
                onClose={() => setOpenLogin(false)}
                onSubmit={async (creds) => handleSubmit("login", creds)}
                switchToSignup={async () => handleAuthSwitch("login")}
            />
            <RegistrationModal
                open={openReg}
                onClose={() => setOpenReg(false)}
                memberAges={ageGroups}
                branchLocations={branchLocations}
                onSubmit={async (creds) => handleSubmit("signup", creds)}
                accountOnly={true}
                switchToLogin={() => handleAuthSwitch("signup")}
            />
        </header>
    );
}

export { PrimaryNav }