import { useState } from "react";
import { Branches } from "../../../data/FooterData";
import { Age } from "../../../data/FormFields";
import 'react-phone-number-input/style.css';
import '../../../styles/PhoneInput.css'
import PhoneInput from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'
import { fieldClass } from "../../../styles/FormStyles";

const RegistrationModal = ({
    open,
    onClose,
    regData,
    onSubmit
}) => {
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
    const [formData, setFormData] = useState(defaultFormData);
    const [errors, setErrors] = useState([]);

    const handleChange = (n, val) => {
        console.log(val);
        setFormData((prev) => {
            return {
                ...prev,
                [n]: val
            }
        })
    };
    const handleSetPhoneNumber = (val) => {
        setFormData((prev) => {
            return {
                ...prev,
                "phoneNumber": val
            }
        })
    };
    const validate = (raw) => {
        const newErrors = [];
        for (const k in raw) {
            if (raw[k] == null || (typeof raw[k] === "string" && !raw[k].trim())) {
                newErrors.push(fieldNames[k])
            }
        }
        return newErrors;
    };
    const handleSubmit = () => {
        const newErrors = validate(formData);
        if (newErrors && newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors([]);
        const formDataFmt = {
            ...formData,
            age: Age.filter((i) => `${i.id}` === formData.age).group,
            branch: Branches.filter((j) => `${j.id}` === formData.branch).city
        }
        if (onSubmit === "function") {
            setFormData(defaultFormData);
            onSubmit(formDataFmt);
            onClose();
        }
    };

    if (!open || !regData) return null;
    return (
        <div className="fixed inset-0 z-(--z-modal-backdrop) bg-(--ink)/75 flex justify-center items-center p-3 sm:p-6">
            {/* Modal panel */}
            <div className="relative z-(--z-modal) bg-(--bg) text-(--ink) border border-(--line) rounded-(--card-radius) shadow-2xl overflow-hidden flex flex-col w-full max-w-2xl max-h-[90dvh]">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-(--line)">
                    <h2 className="text-2xl font-bold">
                        {regData.type}
                    </h2>

                    <button
                        type="button"
                        aria-label="Close registration form"
                        onClick={onClose}
                        className="w-9 h-9 bg-(--bg-secondary) text-(--ink-soft) border border-(--line) hover:bg-(--ice) hover:text-(--ink) rounded-full cursor-pointer font-bold flex justify-center items-center transition-colors"
                    >
                        x
                    </button>
                </div>
                {/* Fields */}
                <div className="overflow-y-auto flex-1 p-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-1 justify-center items-start px-3">
                        <label className="font-semibold text-lg text-(--ink-soft)">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Peter Parker"
                            className={fieldClass}
                            value={formData.fullName}
                            onChange={(e) => { handleChange("fullName", e.target.value) }}
                        />
                    </div>
                    <div className="flex flex-col gap-1 justify-center items-start px-3">
                        <label className="font-semibold text-lg text-(--ink-soft)">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="emailAddress"
                            placeholder="spiderman@mail.com"
                            className={fieldClass}
                            value={formData.emailAddress}
                            onChange={(e) => { handleChange("emailAddress", e.target.value) }}
                        />
                    </div>
                    <div className="flex flex-col gap-1 justify-center items-start px-3">
                        <label className="font-semibold text-lg text-(--ink-soft)">
                            Phone Number
                        </label>
                        <PhoneInput
                            name="phoneNumber"
                            flags={flags}
                            value={formData.phoneNumber}
                            onChange={handleSetPhoneNumber}
                        />
                    </div>
                    <div className="flex flex-col gap-1 justify-center items-start px-3">
                        <label className="font-semibold text-lg text-(--ink-soft)">
                            Age Group
                        </label>
                        <select
                            name="age"
                            className={fieldClass}
                            onChange={(e) => handleChange("age", e.target.value)}
                            placeholder="Select the member's age"
                            value={formData.age}
                        >
                            <option value="" disabled>Select the member's age</option>
                            {Age.map((a) => (
                                <option
                                    key={a.id}
                                    value={`${a.id}`}
                                >
                                    {a.group}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1 justify-center items-start px-3">
                        <label className="font-semibold text-lg text-(--ink-soft)">
                            Branch Location
                        </label>
                        <select
                            name="branch"
                            className={fieldClass}
                            onChange={(e) => handleChange("branch", e)}
                            placeholder="Select your location"
                            value={formData.branch}
                        >
                            <option value="" disabled>Select the member's location</option>
                            {Branches.map((b) => (
                                <option
                                    key={b.id}
                                    value={`${b.id}`}
                                >
                                    {b.city}, {b.country}
                                </option>
                            ))}
                        </select>
                    </div>
                    <span className="w-full text-red-600 font-semibold text-sm">
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