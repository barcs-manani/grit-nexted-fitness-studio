import { useState } from "react";
import { Branches } from "../../../data/FooterData";
import { Age } from "../../../data/FormFields";
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'

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
        age: null,
        branch: null
    };
    const [formData, setFormData] = useState(defaultFormData);

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
    const handleSubmit = () => {
        console.log(JSON.stringify(formData));
        typeof onSubmit === "function" ? onSubmit(formData) : "";
    };

    if (!open || !regData) return null;
    return (
        <div className="fixed top-0 left-0 bottom-0 w-full z-(--z-modal-backdrop) bg-(--ink) opacity-75 flex justify-center items-center">
            <div className="relative z-(--z-modal) bg-(--bg) sm:rounded-(--card-radius) shadow-sm overflow-hidden flex flex-col justify-between w-full sm:w-[90vw] xl:w-150 h-screen sm:h-[80vh] xl:h-150">
                {/* Header */}
                <div className="flex justify-between p-4 text-2xl">
                    <span>{regData.type}</span>
                    <button
                        className="w-8 h-8 bg-white border-2 border-(--line) hover:shadow-xl rounded-full cursor-pointer font-extrabold flex justify-center items-center"
                        onClick={onClose}
                    >
                        x
                    </button>
                </div>
                {/* Fields */}
                <div className="w-full flex flex-col gap-3 justify-start px-2">
                    <div className="flex flex-col gap-1 justify-center items-start px-3">
                        <label className="font-semibold text-lg text-(--ink-soft)">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Peter Parker"
                            className="border border-(--line) rounded-(--field-radius) focus:border-(--blue) w-full py-1 px-2"
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
                            className="border border-(--line) rounded-(--field-radius) focus:border-(--blue) w-full py-1 px-2"
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
                            className="border border-(--line) rounded-(--field-radius) focus:border-(--blue) w-full p-2"
                            onChange={(e) => handleChange("age", e.target.value)}
                            placeholder="Select the member's age"
                            value={formData.age}
                        >
                            {Age.map((a) => (
                                <option
                                    key={a.id}
                                    value={a}
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
                            className="border border-(--line) rounded-(--field-radius) focus:border-(--blue) w-full p-2"
                            onChange={(e) => handleChange("branch", e)}
                            placeholder="Select your location"
                            value={formData.branch}
                        >
                            {Branches.map((b, idx) => (
                                <option
                                    key={idx}
                                    value={b}
                                >
                                    {b.city}, {b.country}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                {/* Footer */}
                <div className="w-full p-2 flex items-center justify-end">
                    <button
                        onClick={handleSubmit}
                        className="py-2.5 px-5.5 bg-(--blue) text-white font-semibold no-underline rounded-(--btn-radius) transition-colors delay-200 ease-in-out hover:bg-(--blue-dark)"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export { RegistrationModal }