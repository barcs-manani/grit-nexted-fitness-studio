"use client"

import { useMemo, useState } from "react";
import { TextField, PhoneField, SingleSelect } from "../../forms/FormFields";
import { mailRegEx, validateFormInput } from "@/lib/validation";
import { isValidPhoneNumber } from "react-phone-number-input";
import { Close } from "@/assets/icons/C/icons";
import { SignupPassword } from "../../forms/SignupPassword";
import Image from "next/image";
import { gritLogo } from "@/assets/images";
import { Spinner } from "../../animations/Spinner";

const defaultFormData = {
    view1: {
        fullName: "",
        emailAddress: "",
        phoneNumber: "",
    },
    view2: {
        password: "",
    }
};
const fieldNames = {
    fullName: "full name",
    emailAddress: "email address",
    phoneNumber: "phone number",
    password: "password",
    confirmPassword: "confirm password"
};

const viewStates = {
    "1": {
        tag: "required-account-info",
        text: "Please fill all fields in this section"
    },
    "2": {
        tag: "password",
        text: "Please setup a strong, long password"
    }
};

const RegistrationModal = ({
    open,
    onClose,
    onSubmit,
    switchToLogin,
}) => {
    const maxViews = 2;
    const [formData, setFormData] = useState(defaultFormData);
    const [currentView, setCurrentView] = useState(1);
    const [showErrors, setShowErrors] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const errors = useMemo(() => (
        showErrors ? validateFormInput(formData[`view${currentView}`]) : []
    ), [showErrors, currentView, formData]);

    const handleChange = (view, name, value) => {
        setFormData((prev) => {
            return {
                ...prev,
                [view]: {
                    ...prev[view],
                    [name]: value
                }
            }
        })
    };

    const handleClose = () => {
        setFormData(defaultFormData);
        setShowErrors(false);
        onClose?.();
    }

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const submitData = {
                fullName: formData.view1.fullName.trim(),
                emailAddress: formData.view1.emailAddress.trim(),
                phoneNumber: formData.view1.phoneNumber,
                password: formData.view2.password
            }
            if (typeof onSubmit === "function") {
                const res = await onSubmit(submitData);
                // console.log("onSubmit response: ", res);
                if (!res?.account?.id) console.error(res);
                else {
                    setFormData(defaultFormData);
                    handleClose();
                }
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleRegNavigation = async (direction) => {
        if (direction === "prev") {
            setShowErrors(false);
            setCurrentView((v) => v - 1);
            return;
        }
        if (validateFormInput(formData[`view${currentView}`]).length > 0) {
            setShowErrors(true);
            return;
        }
        setShowErrors(false);
        if (currentView < maxViews) setCurrentView((v) => v + 1);
        else await handleSubmit();

    };

    const handleSwitchToLogin = () => {
        setFormData(defaultFormData);
        setShowErrors(false);
        switchToLogin();
    };

    const userAccountView = () => (
        <>
            <TextField
                label="Full Name"
                name="fullName"
                placeHolder="Peter Parker"
                value={formData.view1.fullName}
                onChange={(e) => { handleChange("view1", "fullName", e.target.value) }}
            />
            <TextField
                isEmail={true}
                name="emailAddress"
                label="Email Address"
                placeHolder="spiderman@mail.com"
                value={formData.view1.emailAddress}
                onChange={(e) => { handleChange("view1", "emailAddress", e.target.value) }}
            />
            <PhoneField
                name="phoneNumber"
                label="Phone Number"
                value={formData.view1.phoneNumber}
                onChange={(fullNum) => { handleChange("view1", "phoneNumber", fullNum) }}
            />
        </>
    );

    const passwordView = () => (
        <SignupPassword
            defaultValue={formData.view2.password}
            onChange={(pw) => { handleChange("view2", "password", pw) }}
        />
    );

    const getView = (num) => {
        switch (num) {
            case 1:
                return userAccountView();
            case 2:
                return passwordView();
            default:
                break;
        }
    }

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-(--z-modal-backdrop) bg-(--ink)/75 flex justify-center items-center p-3 sm:p-6">
            {/* Modal panel */}
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="mem-reg-title"
                className="
                    relative z-(--z-modal) 
                    bg-(--bg) text-(--ink) 
                    border border-(--line) 
                    rounded-(--card-radius) shadow-2xl 
                    overflow-hidden flex flex-col 
                    w-full md:max-w-xl lg:max-w-2xl min-h-150 max-h-[90dvh]
                "
            >

                {/* Header */}
                <div className="relative flex justify-center items-center border-b border-(--line)">
                    <button
                        type="button"
                        aria-label="Close registration form"
                        onClick={handleClose}
                        className="absolute top-2 right-2 w-9 h-9 text-(--bg) hover:text-(--blue) cursor-pointer flex justify-center items-center transition-colors"
                    >
                        <Close />
                    </button>
                    <div className="w-full p-4 flex flex-col gap-1 items-center">
                        <div
                            className="
                                flex justify-center items-center
                                w-20 h-20 rounded-full
                                bg-linear-to-b from-(--bg) to-(--violet)
                            "
                        >
                            <Image
                                alt="Grit logo"
                                src={gritLogo}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="w-full flex flex-col items-center text-center">
                            <h2 id="mem-reg-title" className="text-2xl font-bold">
                                Welcome to GRIT
                            </h2>
                            <p>We&apos;re excited to have you join us in this extraordinary journey of physical and mental growth.</p>
                        </span>
                    </div>
                </div>

                {/* Fields */}
                <div className="overflow-y-auto flex-1 p-4 flex flex-col gap-4">
                    {getView(currentView)}
                    <span className="w-full text-red-600 font-semibold text-md px-2">
                        {errors.length ? `Please fill the ${errors.join(", ")} field${errors.length > 1 ? 's' : ''}` : ''}
                    </span>
                </div>
                {/* Footer */}
                <div className="p-4 border-t border-(--line) flex flex-col gap-2">
                    <button
                        type="button"
                        onClick={handleSwitchToLogin}
                        className="text-(--blue)/80 cursor-pointer hover:text-(--blue-dark) disabled:cursor-not-allowed"
                    >
                        I already have an account?
                    </button>
                    <div className="flex justify-between items-center">
                        <button
                            type="button"
                            onClick={async () => handleRegNavigation("prev")}
                            disabled={currentView < 2 || submitting}
                            className={`
                            py-2.5 px-6 
                            ${currentView < 2
                                    ? 'bg-(--bg) text-(--ink-soft)/50 cursor-not-allowed'
                                    : 'bg-(--violet) text-white cursor-pointer hover:bg-(--blue-dark) focus-visible:outline-(--blue)'
                                } 
                            font-semibold rounded-(--btn-radius) transition-colors  
                            focus-visible:outline-2 focus-visible:outline-offset-2 
                        `}
                        >
                            Previous
                        </button>
                        <span className="text-sm">{viewStates[String(currentView)].text}</span>
                        <button
                            type="button"
                            onClick={async () => handleRegNavigation("next")}
                            disabled={errors.length > 0 || submitting}
                            className={`
                            py-2.5 px-6 
                            flex items-center justify-center
                            ${errors.length
                                    ? 'bg-(--bg) text-(--ink-soft)/50 cursor-not-allowed'
                                    : 'bg-(--blue) text-white cursor-pointer hover:bg-(--blue-dark) focus-visible:outline-(--blue)'
                                } 
                            font-semibold rounded-(--btn-radius) transition-colors  
                            focus-visible:outline-2 focus-visible:outline-offset-2 
                        `}
                        >
                            {submitting
                                ? <Spinner size={24} variant="center" />
                                : currentView === maxViews
                                    ? 'Register'
                                    : 'Next'
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { RegistrationModal }