/**
 * @jest-environment jsdom
 */

// 1) Set up the DOM before importing dashboard.js
beforeAll(() => {
  document.body.innerHTML = `
    <canvas id="incomeChart"></canvas>
    <canvas id="expenseChart"></canvas>
    <table id="income-summary"></table>
    <table id="expense-percentage"></table>
    <table id="savings-list"></table>
  `;
});

// 2) Mock Chart.js so imports of 'chart.js/auto' resolve
jest.mock('chart.js/auto', () => {
  return {
    __esModule: true,
    default: class {
      constructor(ctx, config) { /* no-op */ }
      destroy() { /* no-op */ }
    }
  };
});

// 3) Now import the functions under test
import { renderSummary, renderSavingsPlans } from '../js/dashboard.js';

describe('renderSummary', () => {
  let incomeTable, expenseTable;

  beforeEach(() => {
    incomeTable  = document.getElementById('income-summary');
    expenseTable = document.getElementById('expense-percentage');
  });

  test('renders correct totals', () => {
    const transactions = [
      { type: 'income', amount: 1000, date: new Date('2025-01-01') },
      { type: 'income', amount: 500,  date: new Date('2025-01-15') },
      { type: 'income', amount: 200,  date: new Date('2025-02-01') },
      { type: 'expense', category: 'Food', amount: 300, date: new Date('2025-01-05') },
      { type: 'expense', category: 'Rent', amount: 700, date: new Date('2025-01-10') },
    ];

    renderSummary(transactions);

    // Income: Jan 1500, Feb 200, Total 1700
    expect(incomeTable.querySelectorAll('tr').length).toBe(4); // header + 2 months + total
    expect(incomeTable.textContent).toMatch(/Jan/);
    expect(incomeTable.textContent).toMatch(/Rp 1\.500/);
    expect(incomeTable.textContent).toMatch(/Feb/);
    expect(incomeTable.textContent).toMatch(/Rp 200/);
    expect(incomeTable.textContent).toMatch(/Total[\s\S]*Rp 1\.700/);

    // Expense percentages: Food 30.0%, Rent 70.0%, Total 100%
    expect(expenseTable.textContent).toMatch(/Food/);
    expect(expenseTable.textContent).toMatch(/30\.0%/);
    expect(expenseTable.textContent).toMatch(/Rent/);
    expect(expenseTable.textContent).toMatch(/70\.0%/);
    expect(expenseTable.textContent).toMatch(/100%/);
  });
});

describe('renderSavingsPlans', () => {
  let savingsList;

  beforeEach(() => {
    savingsList = document.getElementById('savings-list');
  });

  test('renders saving plans and progress rows', () => {
    const savings = [
      { month: 'Jan', target: 1000, income: 2000, saved: 500, percent: 50, date: new Date('2025-01-31') },
      { month: 'Feb', target: 2000, income: 1000, saved: 200, percent: 20, date: new Date('2025-02-28') }
    ];

    renderSavingsPlans(savings);

    // Header + 2 plans × 2 rows = 1 + 4 = 5 rows
    expect(savingsList.querySelectorAll('tr').length).toBe(5);

    // Check sample content
    expect(savingsList.textContent).toMatch(/Jan/);
    expect(savingsList.textContent).toMatch(/Rp 1\.000/); // target formatting
    expect(savingsList.textContent).toMatch(/Progress/);
    expect(savingsList.textContent).toMatch(/50%/);

    expect(savingsList.textContent).toMatch(/Feb/);
    expect(savingsList.textContent).toMatch(/Rp 2\.000/);
    expect(savingsList.textContent).toMatch(/20%/);
  });
});
