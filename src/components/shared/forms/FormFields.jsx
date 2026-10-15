import 'react-phone-number-input/style.css';
import '../../../styles/PhoneInput.css';
import PhoneInput from "react-phone-number-input";
import { fieldClass } from "../../../styles/FormStyles";
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
            return;
        }
    }
    return (
        <div className="flex flex-col gap-1 justify-center items-start px-3">
            <label className="font-semibold text-lg text-(--ink-soft)">
                {label}
            </label>
            <input
                type={isEmail ? "email" : "text"}
                name={name}
                placeholder={placeHolder}
                className={fieldClass}
                value={value}
                onChange={handleChange}
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
            return;
        }
    }
    return (
        <div className="flex flex-col gap-1 justify-center items-start px-3">
            <label className="font-semibold text-lg text-(--ink-soft)">
                {label}
            </label>
            <PhoneInput
                name={name}
                flags={flags}
                value={value}
                onChange={handleChange}
            />
        </div>
    )
};

export { TextField, PhoneField }