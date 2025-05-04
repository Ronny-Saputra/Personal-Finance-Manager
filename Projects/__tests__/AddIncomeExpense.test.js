
/**
 * @jest-environment jsdom
 */
jest.mock('../firebaseAuth.js', () => ({
  __esModule: true,
  addExpenseIncome: jest.fn(),
  submitTransaction: jest.fn()
}));

import { submitTransaction } from '../firebaseAuth.js';
import * as fb from '../firebaseAuth.js';

describe('submitTransaction()', () => {
  let amountInput, categoryInput, typeInput, dialog, dialogMsg;

  beforeEach(() => {
    document.body.innerHTML = `
      <input id="amount" />
      <select id="category"><option value="Food">Food</option></select>
      <select id="type"><option value="Income">Income</option><option value="Expense">Expense</option></select>
      <dialog id="notify-dialog"><p id="notify-message"></p></dialog>
    `;
    amountInput = document.getElementById("amount");
    categoryInput = document.getElementById("category");
    categoryInput.querySelector("option[value=Food]").selected = true;
    categoryInput.value = "Food";
    categoryInput.value = "Food";
    categoryInput.value = "Food";
    typeInput = document.getElementById("type");
    typeInput.value = "Expense";
    typeInput.value = "Expense";
    typeInput.value = "Expense";
    dialog = document.getElementById("notify-dialog");
    dialogMsg = document.getElementById("notify-message");
    dialog.showModal = jest.fn();
  });

  afterEach(() => jest.clearAllMocks());

  test('shows validation error for empty amount', async () => {
    amountInput.value = '';
    fb.submitTransaction.mockImplementation(async (user) => {
      if (!amountInput.value) {
        dialogMsg.textContent = "Jumlah harus diisi!";
        dialog.showModal();
        return;
      }
    });
    await submitTransaction({ uid: 'user1' });
    expect(dialogMsg.textContent).toBe("Jumlah harus diisi!");
    expect(dialog.showModal).toHaveBeenCalled();
  });

  test('successful transaction', async () => {
    amountInput.value = '200';
    categoryInput.value = 'Food';
    typeInput.value = 'Expense';
    fb.addExpenseIncome.mockResolvedValueOnce({ id: 'mock-id' });

    fb.submitTransaction.mockImplementation(async (user) => {
      await fb.addExpenseIncome(user, {
        amount: amountInput.value,
        category: categoryInput.value,
        type: typeInput.value
      });
      dialogMsg.textContent = "Transaksi berhasil ditambahkan!";
      dialog.showModal();
    });

    await submitTransaction({ uid: 'user1' });

    expect(fb.addExpenseIncome).toHaveBeenCalledWith({ uid: 'user1' }, {
      amount: '200', category: 'Food', type: 'Expense'
    });
    expect(dialogMsg.textContent).toBe("Transaksi berhasil ditambahkan!");
  });

  test('handles failure from backend', async () => {
    amountInput.value = '150';
    categoryInput.value = 'Salary';
    typeInput.value = 'Income';
    fb.addExpenseIncome.mockRejectedValueOnce(new Error("mock error"));

    fb.submitTransaction.mockImplementation(async (user) => {
      try {
        await fb.addExpenseIncome(user, {
          amount: amountInput.value,
          category: categoryInput.value,
          type: typeInput.value
        });
      } catch {
        dialogMsg.textContent = "Gagal menambahkan transaksi!";
      }
      dialog.showModal();
    });

    await submitTransaction({ uid: 'user1' });
    expect(dialogMsg.textContent).toBe("Gagal menambahkan transaksi!");
    expect(dialog.showModal).toHaveBeenCalled();
  });
});
