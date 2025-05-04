
/**
 * @jest-environment jsdom
 */
import { calculateMonthlyReport } from '../firebaseAuth.js';

describe('calculateMonthlyReport()', () => {
  const baseDate = (month, day) => ({ toDate: () => new Date(2024, month, day) });

  test('calculates correct income and expense for May 2024', () => {
    const transactions = [
      { amount: '1000', type: 'Income', created: baseDate(4, 1) },
      { amount: '500', type: 'Expense', created: baseDate(4, 5) },
      { amount: '500', type: 'Income', created: baseDate(4, 10) }
    ];
    const result = calculateMonthlyReport(transactions, 4, 2024);
    expect(result.totalIncome).toBe(1500);
    expect(result.totalExpense).toBe(500);
  });

  test('returns 0 income and expense on empty transaction list', () => {
    const result = calculateMonthlyReport([], 4, 2024);
    expect(result.totalIncome).toBe(0);
    expect(result.totalExpense).toBe(0);
  });

  test('ignores malformed entries', () => {
    const transactions = [
      { created: baseDate(4, 1), amount: 'abc', type: 'Income' },
      { created: baseDate(4, 2), type: 'Expense' },
      { amount: 100, type: 'Expense' },
      {}
    ];
    const result = calculateMonthlyReport(transactions, 4, 2024);
    expect(result.totalIncome).toBe(0);
    expect(result.totalExpense).toBe(0);
  });

  test('parses numeric strings and numbers properly', () => {
    const transactions = [
      { created: baseDate(4, 10), amount: '1000', type: 'Income' },
      { created: baseDate(4, 11), amount: 500, type: 'Income' },
      { created: baseDate(4, 12), amount: '500', type: 'Expense' }
    ];
    const result = calculateMonthlyReport(transactions, 4, 2024);
    expect(result.totalIncome).toBeCloseTo(1500);
    expect(result.totalExpense).toBe(500);
  });

  test('skips transactions from other months/years', () => {
    const transactions = [
      { created: baseDate(5, 1), amount: 100, type: 'Income' }, // June
      { created: () => new Date(2023, 4, 1), amount: 200, type: 'Income' } // May 2023
    ];
    const result = calculateMonthlyReport(transactions, 4, 2024);
    expect(result.totalIncome).toBe(0);
    expect(result.totalExpense).toBe(0);
  });
});
