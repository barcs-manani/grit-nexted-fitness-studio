export function formatCurrency(currency, amount) {
    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currency,
    }).format(Number(amount))
}