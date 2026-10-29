const mailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const digitStrRegEx = /^\d+$/;

// Single source of truth for what "strong" means.
// Edit here and the checklist, meter and validation all follow.
const passwordRules = [
    { id: "length", label: "At least 10 characters", test: (p) => p.length >= 10 },
    { id: "lower", label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
    { id: "upper", label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
    { id: "number", label: "One number", test: (p) => /\d/.test(p) },
    { id: "symbol", label: "One symbol (e.g. ! @ # $)", test: (p) => /[^A-Za-z0-9\s]/.test(p) },
];

function isStrongPassword(p) { return passwordRules.every((r) => r.test(p)); }

function validateFormInput(raw) {
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
}

export { mailRegEx, digitStrRegEx, passwordRules, isStrongPassword, validateFormInput }