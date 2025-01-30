export function formatNumber(n: number | undefined, maxFractionDigits: number) {
    if (n == null) {
        return;
    }

    return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: maxFractionDigits,
    }).format(n);
}
