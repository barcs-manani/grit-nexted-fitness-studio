"use client"

import { useMemo, useState } from "react";
import { TextField, PhoneField, SingleSelect } from "../forms/FormFields";
import { mailRegEx } from "@/lib/validation";
import { isValidPhoneNumber } from "react-phone-number-input";
import { Close } from "@/assets/icons/C/icons";
import Image from "next/image";
import { gritLogo } from "@/assets/images";

const defaultFormData = {
    view1: {
        age: "",
        branch: ""
    },
    view2: {
        fullName: "",
        emailAddress: "",
        phoneNumber: "",
    }
};
const fieldNames = {
    age: "age",
    branch: "location",
    fullName: "full name",
    emailAddress: "email address",
    phoneNumber: "phone number"
};

const viewStates = {
    "1": {
        tag: "account-info-1",
        text: "Please fill all fields in this section"
    },
    "2": {
        tag: "account-info-2",
        text: "Please fill all fields in this section"
    },
    "3": {
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

const AddMembershipModal = ({
    open,
    onClose,
    membershipPlan,
    memberAges = [],
    branchLocations = [],
    onSubmit
}) => {
    const maxViews = 3;
    const [formData, setFormData] = useState(defaultFormData);
    const [currentView, setCurrentView] = useState(1);
    const [showErrors, setShowErrors] = useState(false);

    const errors = useMemo(() => (
        showErrors ? validate(formData[`view${currentView}`]) : []
    ), [showErrors, currentView, formData]);

    const ageOptions = useMemo(() => {
        return (memberAges || []).filter((af) => (
            !membershipPlan?.type || membershipPlan.type === "custom"
                ? true
                : af.type === membershipPlan.type
        )).map((a) => ({
            value: String(a.id),
            display: a.group
        }))
    }, [membershipPlan, memberAges]);

    const branchOptions = useMemo(() => {
        return (branchLocations || []).map((b) => ({
            value: String(b.id),
            display: `${b.city}, ${b.country}`
        }))
    }, [branchLocations]);

    const selectedAgeGroup = useMemo(() => {
        const selectedAgeId = formData.view1?.age.trim();
        return (memberAges || []).filter((age) => age.id === selectedAgeId)
    }, [formData.view1.age, memberAges]);

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
        const submitData = {
            primaryAccount: true, // check if account email matches to set true
            ageGroupId: Number(formData.view1.age),
            branchId: Number(formData.view1.branch),
            fullName: formData.view2.fullName.trim(),
            emailAddress: formData.view2.emailAddress.trim(),
            phoneNumber: formData.view2.phoneNumber,
            membershipPlanId: membershipPlan.id
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

    const memberView1 = () => (
        <>
            <SingleSelect
                name="age"
                label="Age Group"
                options={ageOptions}
                value={formData.view1.age}
                placeHolder="Select the member's age"
                onChange={(e) => handleChange("view1", "age", e.target.value)}
            />
            <SingleSelect
                name="branch"
                label="Branch Location"
                options={branchOptions}
                value={formData.view1.branch}
                placeHolder="Select the member's location"
                onChange={(e) => handleChange("view1", "branch", e.target.value)}
            />
        </>
    );

    const memberView2 = () => (
        <>
            <TextField
                label="Member Full Name"
                name="fullName"
                placeHolder="Peter Parker"
                value={formData.view2.fullName}
                onChange={(e) => { handleChange("view2", "fullName", e.target.value) }}
            />
            <TextField
                isEmail={true}
                name="emailAddress"
                label={selectedAgeGroup?.type === "child" ? "Guardian's Email Address" : "Member Email Address"}
                placeHolder="spiderman@mail.com"
                value={formData.view2.emailAddress}
                onChange={(e) => { handleChange("view2", "emailAddress", e.target.value) }}
            />
            <PhoneField
                name="phoneNumber"
                label={selectedAgeGroup?.type === "child" ? "Guardian's Phone Number" : "Member Phone Number"}
                value={formData.view2.phoneNumber}
                onChange={(fullNum) => { handleChange("view2", "phoneNumber", fullNum) }}
            />
        </>
    );

    const paymentCheckoutView = () => { };

    const getView = (num) => {
        switch (num) {
            case 1:
                return memberView1();
            case 2:
                return memberView2();
            case 3:
                return paymentCheckoutView();
            default:
                break;
        }
    }

    if (!open || !membershipPlan?.id) return null;
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
                                {membershipPlan.name}
                            </h2>
                            <p>We&apos;re thrilled to see you fully commit to this growth journey.</p>
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
                        <span className="text-sm">{viewStates[String(currentView)].text}</span>
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

export { AddMembershipModal }