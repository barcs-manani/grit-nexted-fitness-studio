"use client"

import PhoneInput from "react-phone-number-input";
import { fieldClass } from '@/styles/FormStyles';
import flags from "react-phone-number-input/flags";

const TextField = ({
    name = "",
    label = "",
    placeHolder = "",
    value = null,
    onChange,
    isEmail = false
}) => {
    const handleChange = (event) => {
        if (typeof onChange === "function")
            onChange(event);
        else {
            console.warn("'onChange' passed to 'TextField' in shared/forms/FormFields.jsx is not callable!");
        }
    }
    return (
        <div className="flex flex-col gap-1 justify-center items-start px-3">
            <label htmlFor={name} className="font-semibold text-lg text-(--ink-soft)">
                {label}
            </label>
            <input
                id={name}
                type={isEmail ? "email" : "text"}
                name={name}
                placeholder={placeHolder}
                className={fieldClass}
                value={value}
                onChange={handleChange}
                autoComplete={isEmail ? "email" : name === "name" ? "name" : undefined}
            />
        </div>
    );
};

const PhoneField = ({
    name = "",
    label = "",
    value = "",
    onChange
}) => {

    const handleChange = (fullNumber) => {
        if (typeof onChange === "function")
            onChange(fullNumber);
        else {
            console.warn("'onChange' passed to 'PhoneField' in shared/forms/FormFields.jsx is not callable!");
        }
    }
    return (
        <div className="flex flex-col gap-1 justify-center items-start px-3">
            <label htmlFor={name} className="font-semibold text-lg text-(--ink-soft)">
                {label}
            </label>
            <PhoneInput
                id={name}
                defaultCountry="US"
                name={name}
                flags={flags}
                value={value || undefined}
                onChange={handleChange}
                autoComplete='tel'
            />
        </div>
    )
};

const SingleSelect = ({
    label = "",
    name = "",
    options = [],
    value = "",
    placeHolder = "",
    onChange
}) => {
    return (
        <div className="flex flex-col gap-1 justify-center items-start px-3">
            <label htmlFor={name} className="font-semibold text-lg text-(--ink-soft)">
                {label}
            </label>
            <select
                id={name}
                name={name}
                className={fieldClass}
                onChange={onChange}
                placeholder={placeHolder}
                value={value}
            >
                <option value="" disabled>{placeHolder}</option>
                {options.map((o) => (
                    <option
                        key={o.value}
                        value={o.value}
                    >
                        {o.display}
                    </option>
                ))}
            </select>
        </div>
    );
};

const LoginPassword = ({
    name = "",
    label = "",
    value = null,
    onChange,
}) => {
    const handleChange = (event) => {
        if (typeof onChange === "function")
            onChange(event);
        else {
            console.warn("'onChange' passed to 'TextField' in shared/forms/FormFields.jsx is not callable!");
        }
    }
    return (
        <div className="flex flex-col gap-1 justify-center items-start px-3">
            <label htmlFor={name} className="font-semibold text-lg text-(--ink-soft)">
                {label}
            </label>
            <input
                id={name}
                type="password"
                name={name}
                placeholder="Enter password"
                className={fieldClass}
                value={value}
                onChange={handleChange}
            />
        </div>
    );
};

export { TextField, PhoneField, SingleSelect, LoginPassword }