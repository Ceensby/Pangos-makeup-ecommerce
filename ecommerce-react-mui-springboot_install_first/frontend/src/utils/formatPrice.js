export const formatTRY = (value) => {
    if (value === null || value === undefined) return "";
    const number = parseFloat(value);
    if (isNaN(number)) return value; // Return original if not a number

    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY"
    }).format(number);
};
