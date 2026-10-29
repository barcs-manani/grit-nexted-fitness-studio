export function formatCurrency(currency, amount) {
    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currency,
    }).format(Number(amount))
}


export function toTitleCase(value) {
    if (typeof value !== "string" || !value.trim()) {
        return "";
    }

    return value
        .toLowerCase()
        .replace(/\b([a-z])/g, (match) => match.toUpperCase());
}

export function formatPeriod(value) {
    const periodKeys = {
        "yearly": "year",
        "monthly": "month",
        "weekly": "week",
        "daily": "day",
    };
    return periodKeys[value] ?? "None";
}