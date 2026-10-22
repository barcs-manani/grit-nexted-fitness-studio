"use client"

import { useMemo, useState } from "react";
import { TextField, PhoneField, SingleSelect } from "../forms/FormFields";
import { mailRegEx } from "@/data/InputValidation";
import { Close } from "@/assets/icons/Icons";

const defaultFormData = {
    view1: {
        fullName: "",
        emailAddress: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
    },
    view2: {
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

const viewStates = [
    {
        id: 1,
        tag: "user-account",
        text: "Setup your account"
    },
    {
        id: 2,
        tag: "primary-member",
        text: "Please add a few more details for your membership"
    },
    {
        id: 3,
        tag: "payment",
        text: "Complete payment to finalize member registration"
    }
];

const RegistrationModal = ({
    open,
    onClose,
    membershipPlan,
    memberAges,
    branchLocations,
    onSubmit
}) => {
    const [formData, setFormData] = useState(defaultFormData);
    const [currentView, setCurrentView] = useState(1);
    const [errors, setErrors] = useState([]);
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
        setErrors([]);
        onClose?.();
    }

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
            raw.emailAddress.trim() &&
            !mailRegEx.test(raw.emailAddress.trim())
        ) newErrors.push("valid email address");

        return newErrors;
    };

    const handleSubmit = async () => {
        const submitData = {
            fullName: formData.view1.fullName.trim(),
            emailAddress: formData.view1.emailAddress.trim(),
            phoneNumber: formData.view1.phoneNumber,
            password: formData.view1.password,
            members: [
                {
                    ageGroupId: Number(formData.view2.age),
                    branchId: Number(formData.view2.branch),
                }
            ]
        }
        if (typeof onSubmit === "function") {
            const res = await onSubmit(submitData);
            // console.log("onSubmit response: ", res);
            if (res?.registration?.id) {
                setFormData(defaultFormData);
                handleClose();
            } else console.error(res);
        }

    };

    const handleRegNavigation = async (direction) => {
        const prevView = currentView;
        if (direction === "prev") {
            setCurrentView(prevView - 1);
            return;
        }
        else if (direction === "next" && currentView < 3) {
            const newErrors = validate(formData[`view${currentView}`]);
            if (newErrors && newErrors.length > 0) {
                setErrors(newErrors);
                return;
            }
            setErrors([]);
            setCurrentView(prevView + 1);
        }
        else {
            return await handleSubmit();
        }
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
            <TextField
                label="Password"
                name="password"
                value={formData.view1.password}
                onChange={(e) => { handleChange("view1", "password", e.target.value) }}
            />
            <TextField
                label="Confirm Password"
                name="confirmPassword"
                value={formData.view1.confirmPassword}
                onChange={(e) => { handleChange("view1", "confirmPassword", e.target.value) }}
            />
        </>
    );

    const primaryMemberView = () => (
        <>
            <SingleSelect
                name="age"
                label="Age Group"
                options={ageOptions}
                value={formData.view2.age}
                placeHolder="Select the member's age"
                onChange={(e) => handleChange("view2", "age", e.target.value)}
            />
            <SingleSelect
                name="branch"
                label="Branch Location"
                options={branchOptions}
                value={formData.view2.branch}
                placeHolder="Select the member's location"
                onChange={(e) => handleChange("view2", "branch", e.target.value)}
            />
        </>
    );

    if (!open || !membershipPlan) return null;
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
                <div className="flex justify-between items-center p-4 border-b border-(--line)">
                    <h2 id="mem-reg-title" className="text-2xl font-bold">
                        {membershipPlan.name}
                    </h2>

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
                    {currentView === 1
                        ? userAccountView()
                        : primaryMemberView()
                    }
                    <span className="w-full text-red-600 font-semibold text-md px-2">
                        {errors.length ? `Please fill the ${errors.join(", ")} field${errors.length > 1 ? 's' : ''}` : ''}
                    </span>
                </div>
                {/* Footer */}
                <div className="p-4 flex justify-between border-t border-(--line)">
                    <button
                        type="button"
                        onClick={async () => handleRegNavigation("prev")}
                        disabled={currentView < 2}
                        className={`
                            py-2.5 px-6 
                            ${currentView < 2
                                ? 'bg-(--bg) text-(--ink-soft)/50 cursor-not-allowed'
                                : 'bg-(--blue) text-white cursor-pointer hover:bg-(--blue-dark) focus-visible:outline-(--blue)'
                            } 
                            font-semibold rounded-(--btn-radius) transition-colors  
                            focus-visible:outline-2 focus-visible:outline-offset-2 
                        `}
                    >
                        Previous
                    </button>
                    <span className="">{viewStates[currentView].text}</span>
                    <button
                        type="button"
                        onClick={async () => handleRegNavigation("next")}
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
                        {currentView > 2 ? 'Finish' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export { RegistrationModal }