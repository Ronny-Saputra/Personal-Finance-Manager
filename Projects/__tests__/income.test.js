/**
 * @jest-environment jsdom
 */

// 1) Set up the DOM before importing income.js
beforeAll(() => {
  document.body.innerHTML = `
    <table id="income-month-table">
      <tbody>
        <tr class="total-row"><td>Total</td></tr>
      </tbody>
    </table>
    <table id="income-amount-table">
      <tbody>
        <tr class="total-row"><td>Total</td></tr>
      </tbody>
    </table>
    <table id="expense-category-table">
      <tbody>
        <tr class="total-row"><td>Total</td></tr>
      </tbody>
    </table>
    <table id="expense-amount-table">
      <tbody>
        <tr class="total-row"><td>Total</td></tr>
      </tbody>
    </table>
    <div class="cash-flow"></div>
    <dialog id="notify-dialog"><p id="notify-message"></p><button id="notify-ok">OK</button></dialog>
  `;
});

// 2) Mock firebaseAuth so that income.js can import without error
jest.mock('../src/firebaseAuth.js', () => ({
  auth: {},
  db: {},
  onAuthStateChanged: (auth, cb) => { /* do nothing */ },
  collection: () => {},
  getDocs: async () => ({ docs: [] }),
  query: () => {},
  orderBy: () => {}
}));

// 3) Import the module under test
import { renderIncomePage } from '../js/income.js';

describe('renderIncomePage (integration)', () => {
  const sampleTx = [
    { type: 'income', amount: 1000, date: new Date('2025-01-05') },
    { type: 'income', amount: 500,  date: new Date('2025-01-20') },
    { type: 'expense', category: 'Food', amount: 300, date: new Date('2025-01-10') },
    { type: 'expense', category: 'Rent', amount: 700, date: new Date('2025-01-15') }
  ];

  test('populates income and expense tables and cash flow correctly', () => {
    renderIncomePage(sampleTx);

    // Income Month Table: one row per month
    const monthCells = Array.from(
      document
        .getElementById('income-month-table')
        .querySelectorAll('tbody tr:not(.total-row) td')
    ).map(td => td.textContent);
    expect(monthCells).toEqual(['January']);

    // Income Amount Table: one row with summed amount
    const amtCells = Array.from(
      document
        .getElementById('income-amount-table')
        .querySelectorAll('tbody tr:not(.total-row) td')
    ).map(td => td.textContent);
    expect(amtCells).toHaveLength(1);
    expect(amtCells[0]).toMatch(/^Rp\s?1\.500$/);
    
    // Total Income
    const totalIncome = document
      .getElementById('income-amount-table')
      .querySelector('tbody .total-row td')
      .textContent;
    expect(totalIncome).toMatch(/Rp\s?1\.500/);

    // Expense Category Table: one row per category
    const catCells = Array.from(
      document
        .getElementById('expense-category-table')
        .querySelectorAll('tbody tr:not(.total-row) td')
    ).map(td => td.textContent);
    expect(catCells.sort()).toEqual(['Food', 'Rent']);

    // Expense Amount Table: one row per category sum
    const expAmtCells = Array.from(
      document
        .getElementById('expense-amount-table')
        .querySelectorAll('tbody tr:not(.total-row) td')
    ).map(td => td.textContent);
    expect(expAmtCells).toHaveLength(2);
    expect(expAmtCells.sort()[0]).toMatch(/^Rp\s?300$/);
    expect(expAmtCells.sort()[1]).toMatch(/^Rp\s?700$/);
    
    // Total Expense
    const totalExpense = document
      .getElementById('expense-amount-table')
      .querySelector('tbody .total-row td')
      .textContent;
    expect(totalExpense).toMatch(/Rp\s?1\.000/);

    // Cash Flow
    const cashFlowText = document.querySelector('.cash-flow').textContent;
    expect(cashFlowText).toMatch(/Cash Flow:\s?Rp\s?500/);
  });
});
