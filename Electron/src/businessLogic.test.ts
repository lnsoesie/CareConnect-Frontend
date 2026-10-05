import { calculateAdherencePercentage } from './businessLogic';

describe('Medication adherence business logic', () => {
    test('calculates adherence percentage correctly', () => {
        expect(calculateAdherencePercentage(9, 10)).toBe(90);
    });

    test('returns 0 when no doses are scheduled', () => {
        expect(calculateAdherencePercentage(0, 0)).toBe(0);
    });

    test('does not allow adherence above 100 percent', () => {
        expect(calculateAdherencePercentage(12, 10)).toBe(100);
    });

    test('returns 0 for a negative number of doses taken', () => {
        expect(calculateAdherencePercentage(-1, 10)).toBe(0);
    });
});