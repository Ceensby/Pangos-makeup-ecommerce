// formatPrice.js - Utility to format prices in Turkish Lira (TRY)

// Format number to TRY currency string (e.g., 299,99 TRY)
export const formatTRY = (value) => {
    if (value === null || value === undefined) return "";
    const number = parseFloat(value);
    if (isNaN(number)) return value;

    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY"
    }).format(number);
};
