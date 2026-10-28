"use client"

import { useEffect, useState } from "react";
import { LoginModal } from "./Login";
import { RegistrationModal } from "./Registration";

const AuthParent = ({
    isOpen,
    onClose,
    onAuthSuccess,
    onAuthFailure
}) => {
    const [openLogin, setOpenLogin] = useState(isOpen);
    const [openReg, setOpenReg] = useState(false);

    // One-time external interaction based on open button.
    useEffect(() =>{
        if (!isOpen) return;
        //eslint-disable-next-line
        setOpenLogin(isOpen);
    }, [isOpen]);

    const handleAuthSwitch = async (currentType) => {
        if (currentType === "signup") {
            setOpenReg(false);
            setOpenLogin(true);
        } else if (currentType === "login") {
            setOpenLogin(false);
            setOpenReg(true);
        }
    }

    const handleAuth = async (type, creds) => {
        const apis = {
            login: "/api/auth/login",
            signup: "/api/auth/signup",
            // logout: "/api/auth/logout"
        };
        const api = apis[type];
        try {
            const response = await fetch(
                api,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    // body: type !== "logout" ? JSON.stringify(creds) : null,
                    body: JSON.stringify(creds),
                }
            );
            const res = await response.json();
            if (!response.ok) throw new Error(res.error || `${type.toUpperCase()} request failed!`);
            // if (type === "logout" || res?.account?.id) router.refresh();
            router.refresh();
            if (typeof onAuthSuccess === "function") onAuthSuccess();
            return res;
        } catch (err) {
            if (typeof onAuthFailure === "function") onAuthFailure();
            return err;
        }
    };

    const handleClose=(type)=> {
        if (type === "login") setOpenLogin(false);
        else setOpenReg(false);
        onClose();
    };

    if (!isOpen) return null;
    return (
        <>
            <LoginModal
                open={openLogin}
                onClose={() => handleClose("login")}
                onSubmit={async (creds) => handleAuth("login", creds)}
                switchToSignup={async () => handleAuthSwitch("login")}
            />
            <RegistrationModal
                open={openReg}
                onClose={() => handleClose("signup")}
                onSubmit={async (creds) => handleAuth("signup", creds)}
                switchToLogin={() => handleAuthSwitch("signup")}
            />
        </>
    );
};

export { AuthParent }