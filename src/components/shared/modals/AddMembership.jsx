"use client"

import { useMemo, useState } from "react";
import { TextField, PhoneField, SingleSelect } from "../forms/FormFields";
import { mailRegEx } from "@/lib/validation";
import { isValidPhoneNumber } from "react-phone-number-input";
import { Close } from "@/assets/icons/C/icons";
import Image from "next/image";
import { gritLogo } from "@/assets/images";
import { LockIcon } from "@/assets/icons/L/icons";
import { formatPeriod } from "@/lib/formatters";
import { Spinner } from "../animations/Spinner";

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

const PaymentSummary = ({
    details = [],
    total,
    provider = "Stripe"
}) => {
    const rows = details.filter((d) => d.value);

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h3 className="text-xl font-bold text-(--ink)">Review your order</h3>
                <p className="text-(--ink-soft)">
                    Check the details below, then continue to {provider} to pay.
                </p>
            </div>

            <dl className="rounded-(--card-radius) border border-(--line) bg-(--bg-secondary) divide-y divide-(--line) overflow-hidden">
                {rows.map((d) => (
                    <div key={d.label} className="flex justify-between gap-4 px-4 py-3">
                        <dt className="text-(--ink-soft)">{d.label}</dt>
                        <dd className="font-semibold text-right wrap-anywhere">{d.value}</dd>
                    </div>
                ))}
                {total && (
                    <div className="flex justify-between gap-4 px-4 py-3 bg-(--bg)">
                        <dt className="font-bold">Total</dt>
                        <dd className="font-bold text-lg">{total}</dd>
                    </div>
                )}
            </dl>

            <div className="flex items-start gap-3 rounded-(--card-radius) border border-(--ice) bg-(--ice)/30 px-4 py-3">
                <span className="mt-0.5 shrink-0 text-(--blue-dark)">
                    <LockIcon />
                </span>
                <p className="text-sm text-(--ink-soft)">
                    <span className="font-semibold text-(--ink)">You&apos;ll be taken to {provider}&apos;s secure checkout.</span>{" "}
                    Your card details are entered on their page and never reach our servers.
                    Need to change something? Use Previous before you continue.
                </p>
            </div>
        </div>
    );
};

const AddMembershipModal = ({
    open,
    onClose,
    membershipPlan,
    memberAges = [],
    branchLocations = [],
    accountInfo,
    onSubmit
}) => {
    const maxViews = 3;
    const [formData, setFormData] = useState(defaultFormData);
    const [currentView, setCurrentView] = useState(1);
    const [showErrors, setShowErrors] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const errors = useMemo(() => (
        showErrors ? validate(formData[`view${currentView}`]) : []
    ), [showErrors, currentView, formData]);

    const ageOptions = useMemo(() => {
        return (memberAges || []).map((a) => ({
            value: String(a.id),
            display: a.group
        }))
    }, [memberAges]);

    const branchOptions = useMemo(() => {
        return (branchLocations || []).map((b) => ({
            value: String(b.id),
            display: `${b.city}, ${b.country}`
        }))
    }, [branchLocations]);

    const selectedAgeGroup = useMemo(() => {
        const selectedAgeId = formData.view1?.age.trim();
        return (memberAges || []).find((age) => age.id === selectedAgeId)
    }, [formData.view1.age, memberAges]);
    const selectedBranch = branchOptions.find((b) => b.value === formData.view1.branch);

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
            const emailFmt = formData.view2.emailAddress.trim();
            if (!accountInfo) throw new Error("Missing user account information.");
            const primaryAccount = emailFmt === accountInfo.emailAddress;
            const submitData = {
                primaryAccount: primaryAccount, // check if account email matches to set true
                ageGroupId: Number(formData.view1.age),
                branchId: Number(formData.view1.branch),
                fullName: formData.view2.fullName.trim(),
                emailAddress: emailFmt,
                phoneNumber: formData.view2.phoneNumber,
                membershipPlanId: membershipPlan.id
            }
            if (typeof onSubmit === "function") {
                const res = await onSubmit(submitData);
                // console.log("onSubmit response: ", res);
                if (!res?.orderId) console.error(res);
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

    const paymentCheckoutView = () => {
        const getTotal = (price) => {
            const periodFmt = formatPeriod(price.period);
            return `${price.currency} ${price.amount}/${periodFmt}`;
        };
        return (
            <PaymentSummary
                details={[
                    { label: "Member", value: formData.view2.fullName.trim() },
                    { label: "Age group", value: selectedAgeGroup?.group },
                    { label: "Location", value: selectedBranch?.display },
                    { label: "Email", value: formData.view2.emailAddress.trim() },
                ]}
                total={getTotal(membershipPlan.pricing[0])}
            />
        );
    }

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

    if (!open || !membershipPlan?.id || !accountInfo) return null;
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
                                Join {membershipPlan.name} Plan
                            </h2>
                            <p>{viewStates[String(currentView)].text}</p>
                        </span>
                    </div>
                </div>

                {/* Fields */}
                <div className="overflow-y-auto flex-1 p-4 flex flex-col gap-4 justify-around">
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
                        <button
                            type="button"
                            onClick={async () => handleRegNavigation("next")}
                            disabled={errors.length > 0 || submitting}
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
                            {submitting ?
                                <Spinner size={8} variant="current" />
                                : currentView === maxViews
                                    ? 'Proceed to Stripe'
                                    : 'Next'
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { AddMembershipModal }