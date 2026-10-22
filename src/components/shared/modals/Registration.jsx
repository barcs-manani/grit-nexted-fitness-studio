"use client"

import { useMemo, useState } from "react";
import { TextField, PhoneField, SingleSelect } from "../forms/FormFields";
import { mailRegEx } from "@/data/InputValidation";
import { isValidPhoneNumber } from "react-phone-number-input";
import { Close } from "@/assets/icons/Icons";
import { SignupPassword } from "../forms/SignupPassword";

const defaultFormData = {
    view1: {
        fullName: "",
        emailAddress: "",
        phoneNumber: "",
    },
    view2: {
        password: "",
    },
    view3: {
        age: "",
        branch: ""
    }
};
const fieldNames = {
    fullName: "full name",
    emailAddress: "email address",
    phoneNumber: "phone number",
    password: "password",
    confirmPassword: "confirm password",
    age: "age",
    branch: "location"
};

const viewStates = {
    "1": {
        tag: "required-account-info",
        text: "Please fill all fields in this section"
    },
    "2": {
        tag: "password",
        text: "Please setup a strong, long password"
    },
    "3": {
        tag: "primary-member",
        text: "Please add a few more details for your membership"
    },
    "4": {
        tag: "payment",
        text: "Complete payment to finalize member registration"
    }
};

const validate = (raw) => {
    const newErrors = [];
    for (const k in raw) {
        const val = raw[k];
        if (
            val == null ||
            (typeof val === "string" && !val.trim())
        ) newErrors.push(fieldNames[k]);
    }
    if (
        raw?.emailAddress?.trim() &&
        !mailRegEx.test(raw.emailAddress.trim())
    ) newErrors.push("valid email address");

    if (
        raw?.phoneNumber &&
        !isValidPhoneNumber(raw.phoneNumber)
    ) newErrors.push("valid phone number");

    return newErrors;
};

const RegistrationModal = ({
    open,
    onClose,
    membershipPlan,
    memberAges,
    branchLocations,
    onSubmit,
    accountOnly = false, // Not for membership registration
    switchToLogin,
}) => {
    const maxViews = accountOnly ? 2 : 4;
    const [formData, setFormData] = useState(defaultFormData);
    const [currentView, setCurrentView] = useState(1);
    const [showErrors, setShowErrors] = useState(false);

    const errors = useMemo(() => (
        showErrors ? validate(formData[`view${currentView}`]) : []
    ), [showErrors, currentView, formData]);

    const ageOptions = useMemo(() => {
        return memberAges.filter((af) => (
            !membershipPlan?.type || membershipPlan.type === "custom"
                ? true
                : af.type === membershipPlan.type
        )).map((a) => ({
            value: String(a.id),
            display: a.group
        }))
    }, [membershipPlan, memberAges]);

    const branchOptions = useMemo(() => {
        return branchLocations.map((b) => ({
            value: String(b.id),
            display: `${b.city}, ${b.country}`
        }))
    }, [branchLocations]);

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
        const member = !accountOnly && membershipPlan
            ? {
                primaryAccount: true,
                ageGroupId: Number(formData.view3.age),
                branchId: Number(formData.view3.branch),
                membershipPlanId: membershipPlan.id
            }
            : null;
        const submitData = {
            fullName: formData.view1.fullName.trim(),
            emailAddress: formData.view1.emailAddress.trim(),
            phoneNumber: formData.view1.phoneNumber,
            password: formData.view2.password,
            member
        }
        if (typeof onSubmit === "function") {
            const res = await onSubmit(submitData);
            // console.log("onSubmit response: ", res);
            if (!res?.signup?.id) console.error(res);
            else {
                setFormData(defaultFormData);
                handleClose();
            }
        }
    };

    const handleRegNavigation = async (direction) => {
        if (direction === "prev") {
            setShowErrors(false);
            setCurrentView((v) => v - 1);
            return;
        }
        if (validate(formData[`view${currentView}`]).length > 0) {
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
                label={membershipPlan?.type === "child" ? "Guardian's Email Address" : "Email Address"}
                placeHolder="spiderman@mail.com"
                value={formData.view1.emailAddress}
                onChange={(e) => { handleChange("view1", "emailAddress", e.target.value) }}
            />
            <PhoneField
                name="phoneNumber"
                label={membershipPlan?.type === "child" ? "Guardian's Phone Number" : "Phone Number"}
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

    const primaryMemberView = () => (
        <>
            <SingleSelect
                name="age"
                label="Age Group"
                options={ageOptions}
                value={formData.view3.age}
                placeHolder="Select the member's age"
                onChange={(e) => handleChange("view3", "age", e.target.value)}
            />
            <SingleSelect
                name="branch"
                label="Branch Location"
                options={branchOptions}
                value={formData.view3.branch}
                placeHolder="Select the member's location"
                onChange={(e) => handleChange("view3", "branch", e.target.value)}
            />
        </>
    );

    const getView = (num) => {
        switch (num) {
            case 1:
                return userAccountView();
            case 2:
                return passwordView();
            case 3:
                return primaryMemberView();
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
                className="relative z-(--z-modal) bg-(--bg) text-(--ink) border border-(--line) rounded-(--card-radius) shadow-2xl overflow-hidden flex flex-col w-full max-w-2xl max-h-[90dvh]"
            >

                {/* Header */}
                <div className="flex justify-between items-start p-4 border-b border-(--line)">
                    <span>
                        <h2 id="mem-reg-title" className="text-2xl font-bold">
                            {membershipPlan?.name ?? "Welcome to GRIT"}
                        </h2>
                        <p>We&apos;re excited to have you join us in this extraordinary journey of physical and mental growth.</p>
                    </span>
                    <button
                        type="button"
                        aria-label="Close registration form"
                        onClick={handleClose}
                        className="w-9 h-9 text-(--bg) hover:text-(--blue) cursor-pointer flex justify-center items-center transition-colors"
                    >
                        <Close />
                    </button>
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
                    {accountOnly && (
                        <button
                            type="button"
                            onClick={handleSwitchToLogin}
                            disabled={!accountOnly}
                            className="text-(--blue)/80 cursor-pointer hover:text-(--blue-dark) disabled:cursor-not-allowed"
                        >
                            Already have an account
                        </button>
                    )}
                    <div className="flex justify-between items-center">
                        <button
                            type="button"
                            onClick={async () => handleRegNavigation("prev")}
                            disabled={currentView < 2}
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
                        <span className="">{viewStates[String(currentView)].text}</span>
                        <button
                            type="button"
                            onClick={async () => handleRegNavigation("next")}
                            disabled={errors.length > 0}
                            className={`
                            py-2.5 px-6 
                            ${errors.length
                                    ? 'bg-(--bg) text-(--ink-soft)/50 cursor-not-allowed'
                                    : 'bg-(--blue) text-white cursor-pointer hover:bg-(--blue-dark) focus-visible:outline-(--blue)'
                                } 
                            font-semibold rounded-(--btn-radius) transition-colors  
                            focus-visible:outline-2 focus-visible:outline-offset-2 
                        `}
                        >
                            {currentView === maxViews ? 'Finish' : 'Next'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { RegistrationModal }