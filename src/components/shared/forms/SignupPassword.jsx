"use client"

import { useState } from "react";
import { fieldClass } from "@/styles/FormStyles";
import { passwordRules, isStrongPassword } from "@/data/InputValidation";

const EyeIcon = ({ off }) => (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
        <circle cx="12" cy="12" r="3" />
        {off && <path d="M4 4l16 16" />}
    </svg>
);

const RuleIcon = ({ met }) => (
    <span
        aria-hidden="true"
        className={`flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors ${met ? "bg-(--blue) border-(--blue) text-white" : "border-(--line) text-transparent"}`}
    >
        <svg viewBox="0 0 12 12" className="size-2.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.5 6.2l2.4 2.4 4.6-5" />
        </svg>
    </span>
);

const PasswordInput = ({ name, label, value, onChange, onBlur, describedBy }) => {
    const [show, setShow] = useState(false);
    return (
        <div className="flex flex-col gap-1 justify-center items-start px-3">
            <label htmlFor={name} className="font-semibold text-lg text-(--ink-soft)">
                {label}
            </label>
            <div className="relative w-full">
                <input
                    id={name}
                    name={name}
                    type={show ? "text" : "password"}
                    placeholder="Enter password"
                    className={`${fieldClass} w-full pr-11`}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    autoComplete="new-password"
                    maxLength={128}
                    aria-describedby={describedBy}
                />
                <button
                    type="button"
                    aria-label={show ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
                    aria-pressed={show}
                    onClick={() => setShow((s) => !s)}
                    className="absolute inset-y-0 right-0 w-11 flex items-center justify-center text-(--ink-soft) hover:text-(--blue) cursor-pointer transition-colors rounded-r-(--field-radius) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--blue)"
                >
                    <EyeIcon off={show} />
                </button>
            </div>
        </div>
    );
};

/**
 * Props
 *  - defaultValue: the already-validated password held by the parent (restores both fields
 *    when the user navigates back to this step)
 *  - onChange(password): called on every keystroke. Receives the password only when it is
 *    strong AND matches the confirmation; otherwise receives "".
 */
const SignupPassword = ({
    defaultValue = "",
    onChange
}) => {
    const [password, setPassword] = useState(defaultValue);
    const [confirm, setConfirm] = useState(defaultValue);
    const [confirmTouched, setConfirmTouched] = useState(false);

    const results = passwordRules.map((r) => ({ ...r, met: r.test(password) }));
    const metCount = results.filter((r) => r.met).length;
    const strong = metCount === passwordRules.length;
    const matches = confirm.length > 0 && confirm === password;
    // Don't scold the user while they're still typing the confirmation
    const showMismatch =
        confirm.length > 0 && !matches && (confirmTouched || confirm.length >= password.length);

    const strengthLabel = !password
        ? ""
        : strong
            ? "Strong"
            : metCount >= 3
                ? "Almost there"
                : "Weak";

    const update = (nextPassword, nextConfirm) => {
        setPassword(nextPassword);
        setConfirm(nextConfirm);
        const valid = isStrongPassword(nextPassword) && nextPassword === nextConfirm;
        if (typeof onChange === "function") onChange(valid ? nextPassword : "");
    };

    return (
        <div className="flex flex-col gap-4">
            <PasswordInput
                name="password"
                label="Password"
                value={password}
                onChange={(e) => update(e.target.value, confirm)}
                describedBy="password-rules"
            />

            <div className="px-3 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex flex-1 gap-1" aria-hidden="true">
                        {passwordRules.map((r, i) => (
                            <span
                                key={r.id}
                                className={`h-1.5 flex-1 rounded-full transition-colors ${i < metCount ? "bg-(--blue)" : "bg-(--line)"}`}
                            />
                        ))}
                    </div>
                    <span className="w-28 text-sm font-semibold text-(--ink-soft)">{strengthLabel}</span>
                </div>
                <ul id="password-rules" className="list-none grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                    {results.map((r) => (
                        <li
                            key={r.id}
                            className={`flex items-center gap-2 text-sm ${r.met ? "text-(--ink)" : "text-(--ink-soft)"}`}
                        >
                            <RuleIcon met={r.met} />
                            <span className="sr-only">{r.met ? "Met: " : "Not met: "}</span>
                            {r.label}
                        </li>
                    ))}
                </ul>
            </div>

            <PasswordInput
                name="confirmPassword"
                label="Confirm Password"
                value={confirm}
                onChange={(e) => update(password, e.target.value)}
                onBlur={() => setConfirmTouched(true)}
                describedBy="confirm-status"
            />
            <p
                id="confirm-status"
                aria-live="polite"
                className={`px-3 min-h-5 text-sm font-semibold ${matches ? "text-(--blue-dark)" : "text-red-600"}`}
            >
                {matches ? "Passwords match" : showMismatch ? "Passwords don't match" : ""}
            </p>
        </div>
    );
};

export { SignupPassword }