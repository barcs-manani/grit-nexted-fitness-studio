const mailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

export { mailRegEx, passwordRules, isStrongPassword }