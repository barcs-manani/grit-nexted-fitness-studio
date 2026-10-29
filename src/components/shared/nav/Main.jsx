"use client"

import { AccountOptions, HeroNav } from "@/data/Navigation";
import { GritLogo } from "../brand/GritLogo";
import { HamburgerMenu } from "@/assets/icons/H/icons";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Drawer, DrawerItem } from "./NavDrawer";
import { AuthParent } from "../modals/auth/Main";

const MainNav = ({
    bgTheme = "dark", // dark, light
    isScrolled = false,
    menu = "full", // full, mini
    accountInfo = null,
}) => {
    const router = useRouter();
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
    const styles = themeStyles[bgTheme] ?? themeStyles.light;
    const [openAuth, setOpenAuth] = useState(false);
    const [openNavMenu, setOpenNavMenu] = useState(false);
    const [openAccountMenu, setOpenAccountMenu] = useState(false);

    const handleAccountOption= async (opt)=> {
        setOpenAccountMenu(false);
        if (opt.to === "logout") await handleLogout();
    };

    const handleLogout = async () => {
        try {
            const response = await fetch(
                "/api/auth/logout",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                }
            );
            const res = await response.json();
            if (!response.ok) throw new Error(res.error || "Logout request failed!");
            router.refresh();
            return res;
        } catch (err) {
            return err;
        }
    };

    const fullMenu = () => (
        <ul className="flex gap-4 sm:gap-[3vw] xl:gap-9 list-none">
            {HeroNav.map((nv) => (
                <li key={nv.id} className={styles.lv5}>
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
        const currentState = openAuth;
        return (
            <button
                onClick={() => setOpenAuth(!currentState)}
                className={`
                    py-1.5 px-4
                    text-lg font-semibold rounded-(--btn-radius)
                    ${styles.lv7}
                    focus-visible:outline-(--blue) focus-visible:outline-2 focus-visible:outline-offset-2 
                    cursor-pointer
                    transition-all
                `}
            >
                Signin
            </button>
        )
    };

    const profileButton = () => {
        const currentState = openAccountMenu;
        return (
            <button
                onClick={() => setOpenAccountMenu(!currentState)}
                className={`
                    py-1 px-3
                    text-2xl font-semibold rounded-full
                    cursor-pointer
                    ${styles.lv7}
                    focus-visible:outline-(--blue) focus-visible:outline-2 focus-visible:outline-offset-2 
                    transition-all
                `}
            >
                {accountInfo.fullName[0].toUpperCase()}
            </button>
        )
    };

    return (
        <>
            <header className={`fixed inset-x-0 top-0 z-(--z-nav-bar) px-(--gutter) py-3 transition-colors ${styles.lv1}`}>
                <nav id="hero-nav" className="relative mx-auto w-full max-w-(--max-w) flex justify-between items-center xl:px-(--gutter) gap-4">
                    <GritLogo bgTheme={bgTheme} />
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
            </header>
            {/* Everything below sits NEXT TO the header, not inside it.
                A blurred header (backdrop-blur) shrinks any "fixed" child down to the header's size,
                so overlays and modals must live outside it to cover the whole screen. */}

            <Drawer open={openNavMenu} onClose={() => setOpenNavMenu(false)} title="Menu">
                <ul className="list-none flex flex-col gap-1">
                    {HeroNav.map((nv) => (
                        <li key={nv.id}>
                            <DrawerItem href={nv.link} icon={nv.icon} onClick={() => setOpenNavMenu(false)}>
                                {nv.text}
                            </DrawerItem>
                        </li>
                    ))}
                </ul>
            </Drawer>

            {isSignedIn && (
                <Drawer open={openAccountMenu} onClose={() => setOpenAccountMenu(false)} title="Account">
                    <div className="flex items-center gap-3 px-3 pb-4 mb-2 border-b border-(--line)">
                        <span className="w-11 h-11 shrink-0 flex justify-center items-center rounded-full bg-(--blue) text-white text-xl font-bold">
                            {accountInfo.fullName[0].toUpperCase()}
                        </span>
                        <span className="font-semibold text-(--ink) truncate">{accountInfo.fullName}</span>
                    </div>
                    <ul className="list-none flex flex-col gap-1">
                        {AccountOptions.map((opt) => (
                            <li key={opt.id}>
                                {opt.type === "link"
                                    ? <DrawerItem href={opt.to} icon={opt.icon} onClick={() => setOpenAccountMenu(false)}>{opt.text}</DrawerItem>
                                    : <DrawerItem icon={opt.icon} onClick={() => handleAccountOption(opt)}>{opt.text}</DrawerItem>
                                }
                            </li>
                        ))}
                    </ul>
                </Drawer>
            )}
            <AuthParent
                isOpen={openAuth}
                onClose={() => setOpenAuth(false)}
            />
        </>
    );
}

export { MainNav }