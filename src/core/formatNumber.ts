export function formatNumber(n: number | undefined) {
    if (n == null) {
        return;
    }

    return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(n);
}
