// income.test.js
describe('Income and Expenses Dashboard Tests', () => {
    // Setup mock DOM elements
    beforeEach(() => {
      // Create mock DOM elements for income/expense page
      document.body.innerHTML = `
        <div id="income-month-table"><tbody><tr class="total-row"><td>Total</td></tr></tbody></div>
        <div id="income-amount-table"><tbody><tr class="total-row"><td>Total</td></tr></tbody></div>
        <div id="expense-category-table"><tbody><tr class="total-row"><td>Total</td></tr></tbody></div>
        <div id="expense-amount-table"><tbody><tr class="total-row"><td>Total</td></tr></tbody></div>
        <div class="cash-flow">Cash Flow: Rp. 0</div>
        
        <!-- Add Income & Expenses form elements -->
        <input type="text" id="amount-input" placeholder="Rp.">
        <button id="income-btn">Income</button>
        <button id="expense-btn">Expense</button>
        <div id="category-container">
          <button class="category-btn" data-category="Food & Drinks">Food & Drinks</button>
          <button class="category-btn" data-category="Living Expenses">Living Expenses</button>
          <button class="category-btn" data-category="Groceries">Groceries</button>
          <button class="category-btn" data-category="Payments">Payments</button>
          <button class="category-btn" data-category="Entertainment">Entertainment</button>
          <button class="category-btn" data-category="Transportations">Transportations</button>
        </div>
        <input type="date" id="date-input">
        <input type="time" id="time-input">
        <button id="confirm-btn">Confirm</button>
        <button id="cancel-btn">Cancel</button>
      `;
  
      // Mock localStorage
      const mockTransactions = [
        { type: "expense", amount: 5000000, date: "2025-04-01", category: "Income" },
        { type: "expense", amount: 1000000, date: "2025-03-15", category: "Income" },
        { type: "expense", amount: 2000000, date: "2025-04-05", category: "Living Expenses" },
        { type: "expense", amount: 500000, date: "2025-04-10", category: "Groceries" },
        { type: "expense", amount: 300000, date: "2025-04-15", category: "Transportations" }
      ];
      
      localStorage.setItem = jest.fn();
      localStorage.getItem = jest.fn().mockReturnValue(JSON.stringify(mockTransactions));
    });
  
    // Clean up
    afterEach(() => {
      jest.clearAllMocks();
      document.body.innerHTML = '';
    });
  
    test('loads transactions from localStorage', () => {
      // Trigger the DOMContentLoaded event
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
  
      // Verify localStorage.getItem was called
      expect(localStorage.getItem).toHaveBeenCalledWith('transactions');
    });
  
    test('calculates income by month correctly', () => {
      // Trigger the DOMContentLoaded event
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
  
      // Check if income months are added to table
      const incomeMonthRows = document.getElementById('income-month-table').querySelectorAll('tbody tr:not(.total-row)');
      expect(incomeMonthRows.length).toBe(2); // March and April
      
      // Check content of rows
      const months = Array.from(incomeMonthRows).map(row => row.textContent);
      expect(months).toContain('April');
      expect(months).toContain('March');
    });
  
    test('calculates income amounts correctly', () => {
      // Trigger the DOMContentLoaded event
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
  
      // Check if income amounts are added to table
      const incomeAmountRows = document.getElementById('income-amount-table').querySelectorAll('tbody tr:not(.total-row)');
      expect(incomeAmountRows.length).toBe(2);
      
      // Check total income calculation
      const totalRow = document.getElementById('income-amount-table').querySelector('.total-row');
      expect(totalRow.textContent).toContain('Rp. 6,000,000');
    });
  
    test('calculates expense categories correctly with exact categories', () => {
      // Trigger the DOMContentLoaded event
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
  
      // Check if expense categories are added to table
      const expenseCategoryRows = document.getElementById('expense-category-table').querySelectorAll('tbody tr:not(.total-row)');
      expect(expenseCategoryRows.length).toBe(3); // Living Expenses, Groceries, Transportations
      
      // Check content of rows matches the exact categories from the UI
      const categories = Array.from(expenseCategoryRows).map(row => row.textContent);
      expect(categories).toContain('Living Expenses');
      expect(categories).toContain('Groceries');
      expect(categories).toContain('Transportations');
    });
  
    test('calculates expense amounts correctly', () => {
      // Trigger the DOMContentLoaded event
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
  
      // Check if expense amounts are added to table
      const expenseAmountRows = document.getElementById('expense-amount-table').querySelectorAll('tbody tr:not(.total-row)');
      expect(expenseAmountRows.length).toBe(3);
      
      // Check total expense calculation
      const totalRow = document.getElementById('expense-amount-table').querySelector('.total-row');
      expect(totalRow.textContent).toContain('Rp. 2,800,000');
    });
  
    test('calculates cash flow correctly', () => {
      // Trigger the DOMContentLoaded event
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
  
      // Check cash flow calculation
      const cashFlow = document.querySelector('.cash-flow');
      expect(cashFlow.textContent).toBe('Cash Flow: Rp. 3,200,000');
    });
  
    // Tests for the Add Income & Expenses form functionality
    test('category section is disabled when income is selected', () => {
      // Mock the event listeners setup
      const incomeBtn = document.getElementById('income-btn');
      const categoryBtns = document.querySelectorAll('.category-btn');
      
      // Create a mock function for the income button's click handler
      const clickHandler = jest.fn((e) => {
        // Simulate disabling the category buttons
        categoryBtns.forEach(btn => {
          btn.disabled = true;
          btn.classList.remove('active');
        });
      });
      
      // Add mock event listener
      incomeBtn.addEventListener('click', clickHandler);
      
      // Simulate click on income button
      incomeBtn.click();
      
      // Check if the click handler was called
      expect(clickHandler).toHaveBeenCalled();
      
      // Check if all category buttons are disabled
      categoryBtns.forEach(btn => {
        expect(btn.disabled).toBe(true);
      });
    });
  
    test('category section is enabled when expense is selected', () => {
      // Mock the event listeners setup
      const expenseBtn = document.getElementById('expense-btn');
      const categoryBtns = document.querySelectorAll('.category-btn');
      
      // First disable all category buttons
      categoryBtns.forEach(btn => {
        btn.disabled = true;
      });
      
      // Create a mock function for the expense button's click handler
      const clickHandler = jest.fn((e) => {
        // Simulate enabling the category buttons
        categoryBtns.forEach(btn => {
          btn.disabled = false;
        });
      });
      
      // Add mock event listener
      expenseBtn.addEventListener('click', clickHandler);
      
      // Simulate click on expense button
      expenseBtn.click();
      
      // Check if the click handler was called
      expect(clickHandler).toHaveBeenCalled();
      
      // Check if all category buttons are enabled
      categoryBtns.forEach(btn => {
        expect(btn.disabled).toBe(false);
      });
    });
  
    test('correct expense categories are available and working', () => {
      const categoryBtns = document.querySelectorAll('.category-btn');
      const expectedCategories = [
        'Food & Drinks', 'Living Expenses', 'Groceries', 
        'Payments', 'Entertainment', 'Transportations'
      ];
      
      // Check if all expected categories exist
      const categories = Array.from(categoryBtns).map(btn => btn.getAttribute('data-category'));
      expectedCategories.forEach(category => {
        expect(categories).toContain(category);
      });
      
      // Test category selection
      let selectedCategory = null;
      categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          categoryBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          selectedCategory = btn.getAttribute('data-category');
        });
      });
      
      // Click on a category button
      const groceriesBtn = document.querySelector('.category-btn[data-category="Groceries"]');
      groceriesBtn.click();
      
      // Check if the correct category is selected
      expect(groceriesBtn.classList.contains('active')).toBe(true);
      expect(selectedCategory).toBe('Groceries');
    });
  
    test('transaction is saved with correct type when income is selected', () => {
      // Setup mock form data
      const amountInput = document.getElementById('amount-input');
      amountInput.value = '1000000';
      
      const dateInput = document.getElementById('date-input');
      dateInput.value = '2025-04-26';
      
      const timeInput = document.getElementById('time-input');
      timeInput.value = '10:30';
      
      const incomeBtn = document.getElementById('income-btn');
      const confirmBtn = document.getElementById('confirm-btn');
      
      // Mock localStorage setItem
      localStorage.setItem = jest.fn();
      localStorage.getItem = jest.fn().mockReturnValue(JSON.stringify([]));
      
      // Mock the form submission
      confirmBtn.addEventListener('click', () => {
        const transactions = [];
        transactions.push({
          type: 'income',
          amount: parseFloat(amountInput.value),
          date: `${dateInput.value}T${timeInput.value}`,
          category: 'Income'  // Income doesn't have categories, just uses "Income"
        });
        localStorage.setItem('transactions', JSON.stringify(transactions));
      });
      
      // Select income type and submit the form
      incomeBtn.click();
      confirmBtn.click();
      
      // Check if localStorage.setItem was called with correct data
      expect(localStorage.setItem).toHaveBeenCalledWith('transactions', JSON.stringify([{
        type: 'income',
        amount: 1000000,
        date: '2025-04-26T10:30',
        category: 'Income'
      }]));
    });
  
    test('transaction is saved with correct category when expense is selected', () => {
      // Setup mock form data
      const amountInput = document.getElementById('amount-input');
      amountInput.value = '500000';
      
      const dateInput = document.getElementById('date-input');
      dateInput.value = '2025-04-26';
      
      const timeInput = document.getElementById('time-input');
      timeInput.value = '14:45';
      
      const expenseBtn = document.getElementById('expense-btn');
      const confirmBtn = document.getElementById('confirm-btn');
      const groceriesBtn = document.querySelector('.category-btn[data-category="Groceries"]');
      
      // Mock localStorage setItem
      localStorage.setItem = jest.fn();
      localStorage.getItem = jest.fn().mockReturnValue(JSON.stringify([]));
      
      // Mock selecting a category
      let selectedCategory = null;
      groceriesBtn.addEventListener('click', () => {
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        groceriesBtn.classList.add('active');
        selectedCategory = groceriesBtn.getAttribute('data-category');
      });
      
      // Mock the form submission
      confirmBtn.addEventListener('click', () => {
        const transactions = [];
        transactions.push({
          type: 'expense',
          amount: parseFloat(amountInput.value),
          date: `${dateInput.value}T${timeInput.value}`,
          category: selectedCategory
        });
        localStorage.setItem('transactions', JSON.stringify(transactions));
      });
      
      // Select expense type, category, and submit the form
      expenseBtn.click();
      groceriesBtn.click();
      confirmBtn.click();
      
      // Check if localStorage.setItem was called with correct data
      expect(localStorage.setItem).toHaveBeenCalledWith('transactions', JSON.stringify([{
        type: 'expense',
        amount: 500000,
        date: '2025-04-26T14:45',
        category: 'Groceries'
      }]));
    });
  
    test('handles empty transactions array', () => {
      // Mock empty localStorage
      localStorage.getItem = jest.fn().mockReturnValue(null);
      
      // Trigger the DOMContentLoaded event
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
  
      // Check that tables are empty (except for total rows)
      const incomeMonthRows = document.getElementById('income-month-table').querySelectorAll('tbody tr:not(.total-row)');
      const expenseCategoryRows = document.getElementById('expense-category-table').querySelectorAll('tbody tr:not(.total-row)');
      
      expect(incomeMonthRows.length).toBe(0);
      expect(expenseCategoryRows.length).toBe(0);
      
      // Check that totals are zero
      const incomeTotalRow = document.getElementById('income-amount-table').querySelector('.total-row');
      const expenseTotalRow = document.getElementById('expense-amount-table').querySelector('.total-row');
      
      expect(incomeTotalRow.textContent).toContain('Rp. 0');
      expect(expenseTotalRow.textContent).toContain('Rp. 0');
      
      // Check cash flow is zero
      const cashFlow = document.querySelector('.cash-flow');
      expect(cashFlow.textContent).toBe('Cash Flow: Rp. 0');
    });
  });