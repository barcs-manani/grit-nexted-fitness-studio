"use client"

import { useMemo, useState } from "react";
import { Age } from "@/data/FormFields";
import { BranchLocations } from "@/data/Locations";
import { TextField, PhoneField, SingleSelect } from "../forms/FormFields";
import { mailRegEx } from "@/data/InputValidation";

const defaultFormData = {
    fullName: "",
    emailAddress: "",
    phoneNumber: "",
    age: "",
    branch: ""
};
const fieldNames = {
    fullName: "full name",
    emailAddress: "email address",
    phoneNumber: "phone number",
    age: "age",
    branch: "location"
};

const RegistrationModal = ({
    open,
    onClose,
    regData,
    onSubmit
}) => {
    const [formData, setFormData] = useState(defaultFormData);
    const [errors, setErrors] = useState([]);
    const ageOptions = useMemo(() => {
        return Age.filter((af) => (
            !regData?.type || regData.type === "custom"
                ? true
                : af.type === regData.type
        )).map((a) => ({
            value: String(a.id),
            display: a.group
        }))
    }, [regData]);
    const branchOptions = useMemo(() => {
        return BranchLocations.map((b) => ({
            value: String(b.id),
            display: `${b.city}, ${b.country}`
        }))
    }, []);

    const handleChange = (name, value) => {
        setFormData((prev) => {
            return {
                ...prev,
                [name]: value
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
        const newErrors = validate(formData);
        if (newErrors && newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors([]);
        const submitData = {
            ...formData,
            fullName: formData.fullName.trim(),
            emailAddress: formData.emailAddress.trim(),
            age: Number(formData.age),
            branch: Number(formData.branch),
        }
        if (typeof onSubmit === "function") {
            const res = await onSubmit(submitData);
            console.log("onSubmit response: ", res);
            if (res?.registration?.id) {
                setFormData(defaultFormData);
                handleClose();
            } else console.error(res);
        }
    };

    if (!open || !regData) return null;
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
                        {regData.name}
                    </h2>

                    <button
                        type="button"
                        aria-label="Close registration form"
                        onClick={handleClose}
                        className="w-9 h-9 bg-(--bg-secondary) text-(--ink-soft) border border-(--line) hover:bg-(--ice) hover:text-(--ink) rounded-full cursor-pointer font-bold flex justify-center items-center transition-colors"
                    >
                        x
                    </button>
                </div>
                {/* Fields */}
                <div className="overflow-y-auto flex-1 p-4 flex flex-col gap-4">
                    <TextField
                        label="Full Name"
                        name="fullName"
                        placeHolder="Peter Parker"
                        value={formData.fullName}
                        onChange={(e) => { handleChange("fullName", e.target.value) }}
                    />
                    <TextField
                        isEmail={true}
                        name="emailAddress"
                        label={regData?.type === "child" ? "Guardian's Email Address" : "Email Address"}
                        placeHolder="spiderman@mail.com"
                        value={formData.emailAddress}
                        onChange={(e) => { handleChange("emailAddress", e.target.value) }}
                    />
                    <PhoneField
                        name="phoneNumber"
                        label={regData?.type === "child" ? "Guardian's Phone Number" : "Phone Number"}
                        value={formData.phoneNumber}
                        onChange={(fullNum) => { handleChange("phoneNumber", fullNum) }}
                    />
                    <SingleSelect
                        name="age"
                        label="Age Group"
                        options={ageOptions}
                        value={formData.age}
                        placeHolder="Select the member's age"
                        onChange={(e) => handleChange("age", e.target.value)}
                    />
                    <SingleSelect
                        name="branch"
                        label="Branch Location"
                        options={branchOptions}
                        value={formData.branch}
                        placeHolder="Select the member's location"
                        onChange={(e) => handleChange("branch", e.target.value)}
                    />
                    <span className="w-full text-red-600 font-semibold text-md px-2">
                        {errors.length ? `Please fill the ${errors.join(", ")} field${errors.length > 1 ? 's' : ''}` : ''}
                    </span>
                </div>
                {/* Footer */}
                <div className="p-4 flex justify-end border-t border-(--line)">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="py-2.5 px-6 bg-(--blue) text-white font-semibold rounded-(--btn-radius) transition-colors hover:bg-(--blue-dark) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--blue)"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export { RegistrationModal }