export function calculateAdherencePercentage(
    dosesTaken: number,
    dosesScheduled: number
): number {
    if (dosesScheduled <= 0) {
        return 0;
    }

    if (dosesTaken < 0) {
        return 0;
    }

    const percentage = (dosesTaken / dosesScheduled) * 100;

    return Math.min(Math.round(percentage), 100);
}