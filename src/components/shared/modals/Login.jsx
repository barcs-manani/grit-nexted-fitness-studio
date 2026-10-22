"use client"

import { useState } from "react";
import { TextField } from "../forms/FormFields";
import { mailRegEx } from "@/data/InputValidation";
import { Close } from "@/assets/icons/Icons";

const defaultFormData = {
    emailAddress: "",
    password: ""
};

const fieldNames = {
    emailAddress: "email address",
    password: "password",
};

const LoginModal = ({
    open,
    onClose,
    onSubmit
}) => {
    const [formData, setFormData] = useState(defaultFormData);
    const [errors, setErrors] = useState([]);

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
        const submitData = {
            password: formData.password,
            emailAddress: formData.emailAddress.trim(),
        }
        if (typeof onSubmit === "function") {
            const res = await onSubmit(submitData);
            // console.log("onSubmit response: ", res);
            if (res?.login?.id) {
                setFormData(defaultFormData);
                handleClose();
            } else console.error(res);
        }

    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-(--z-modal-backdrop) bg-(--ink)/75 flex justify-center items-center p-3 sm:p-6">
            {/* Modal panel */}
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="mem-reg-title"
                className="relative z-(--z-modal) bg-(--bg) text-(--ink) border border-(--line) rounded-(--card-radius) shadow-2xl overflow-hidden flex flex-col w-full max-w-2xl max-h-[70dvh]"
            >

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-(--line)">
                    <h2 id="mem-reg-title" className="text-2xl font-bold">
                        Welcome back!
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
                    <TextField
                        isEmail={true}
                        name="emailAddress"
                        label="Email Address"
                        placeHolder="spiderman@mail.com"
                        value={formData.emailAddress}
                        onChange={(e) => { handleChange("emailAddress", e.target.value) }}
                    />
                    <TextField
                        label="Password"
                        name="password"
                        value={formData.password}
                        onChange={(e) => { handleChange("password", e.target.value) }}
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
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export { LoginModal }