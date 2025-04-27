// reports.test.js
describe('Monthly Reports Tests', () => {
    // Mock Chart.js
    let originalChart;
    beforeAll(() => {
      originalChart = global.Chart;
      global.Chart = jest.fn().mockImplementation(() => ({
        destroy: jest.fn()
      }));
    });
  
    afterAll(() => {
      global.Chart = originalChart;
    });
  
    // Setup mock DOM elements
    beforeEach(() => {
      // Create mock DOM elements
      document.body.innerHTML = `
        <select id="month-select">
          <option>January</option>
          <option>February</option>
          <option>March</option>
          <option>April</option>
          <option>May</option>
          <option>June</option>
          <option>July</option>
          <option>August</option>
          <option>September</option>
          <option>October</option>
          <option>November</option>
          <option>December</option>
        </select>
        <canvas id="monthlyExpenseChart"></canvas>
        <div id="total-income-value">0</div>
        <div id="cashflow-value">0</div>
        <table id="report-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Expense</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      `;
  
      // Mock canvas context
      const canvas = document.getElementById('monthlyExpenseChart');
      canvas.getContext = jest.fn().mockReturnValue({});
      
      // Mock localStorage
      const mockTransactions = [
        { type: "income", amount: 5000000, date: "2025-04-01", category: "Income" },
        { type: "income", amount: 3000000, date: "2025-03-15", category: "Income" },
        { type: "expense", amount: 1500000, date: "2025-04-05", category: "Food & Drinks" },
        { type: "expense", amount: 800000, date: "2025-04-10", category: "Groceries" },
        { type: "expense", amount: 2000000, date: "2025-04-15", category: "Living Expenses" },
        { type: "expense", amount: 500000, date: "2025-04-20", category: "Entertainment" },
        { type: "expense", amount: 1200000, date: "2025-04-25", category: "Payments" },
        { type: "expense", amount: 700000, date: "2025-04-30", category: "Transportations" },
        { type: "expense", amount: 1000000, date: "2025-03-10", category: "Food & Drinks" },
        { type: "expense", amount: 600000, date: "2025-03-20", category: "Groceries" }
      ];
      
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
  
    test('renders initial month data correctly', () => {
      // Trigger the DOMContentLoaded event
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
  
      // Check if Chart constructor was called
      expect(Chart).toHaveBeenCalled();
      
      // April is selected by default in our test
      const monthSelect = document.getElementById('month-select');
      expect(monthSelect.value).toBe('January'); // Default first option
    });
  
    test('updates data when month is changed', () => {
      // Trigger the DOMContentLoaded event
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
  
      // Get the initial chart instance count
      const initialCallCount = Chart.mock.calls.length;
      
      // Change month to March
      const monthSelect = document.getElementById('month-select');
      monthSelect.value = 'March';
      
      // Trigger change event
      const changeEvent = new Event('change');
      monthSelect.dispatchEvent(changeEvent);
      
      // Check if Chart constructor was called again
      expect(Chart.mock.calls.length).toBe(initialCallCount + 1);
    });
  
    test('calculates April income correctly', () => {
      // Set month to April
      const monthSelect = document.getElementById('month-select');
      monthSelect.value = 'April';
      
      // Trigger the DOMContentLoaded event
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
      
      // Trigger change event to render April data
      const changeEvent = new Event('change');
      monthSelect.dispatchEvent(changeEvent);
      
      // Check April income (5,000,000)
      const totalIncomeDisplay = document.getElementById('total-income-value');
      expect(totalIncomeDisplay.textContent).toBe('5,000,000');
    });
  
    test('calculates April expenses correctly', () => {
      // Set month to April
      const monthSelect = document.getElementById('month-select');
      monthSelect.value = 'April';
      
      // Trigger the DOMContentLoaded event
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
      
      // Trigger change event to render April data
      const changeEvent = new Event('change');
      monthSelect.dispatchEvent(changeEvent);
      
      // Check if all predefined categories are in the table
      const reportTable = document.getElementById('report-table').querySelector('tbody');
      const rows = reportTable.querySelectorAll('tr');
      expect(rows.length).toBe(6); // 6 predefined categories
      
      // Check if expenses match expected values
      const categories = ['Food & Drinks', 'Groceries', 'Entertainment', 'Living Expenses', 'Payments', 'Transportations'];
      const expectedValues = [1500000, 800000, 500000, 2000000, 1200000, 700000];
      
      categories.forEach((category, index) => {
        // Find the row for this category
        const row = Array.from(rows).find(row => row.querySelector('td').textContent === category);
        expect(row).toBeTruthy();
        
        // Check the expense value
        const expenseCell = row.querySelectorAll('td')[1];
        expect(expenseCell.textContent.trim()).toBe(`Rp ${expectedValues[index].toLocaleString()}`);
      });
    });
  
    test('calculates April cashflow correctly', () => {
      // Set month to April
      const monthSelect = document.getElementById('month-select');
      monthSelect.value = 'April';
      
      // Trigger the DOMContentLoaded event
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
      
      // Trigger change event to render April data
      const changeEvent = new Event('change');
      monthSelect.dispatchEvent(changeEvent);
      
      // April income: 5,000,000
      // April expenses: 1,500,000 + 800,000 + 500,000 + 2,000,000 + 1,200,000 + 700,000 = 6,700,000
      // Cashflow: 5,000,000 - 6,700,000 = -1,700,000
      const cashflowDisplay = document.getElementById('cashflow-value');
      expect(cashflowDisplay.textContent).toBe('-1,700,000');
    });
  
    test('calculates March income correctly', () => {
      // Set month to March
      const monthSelect = document.getElementById('month-select');
      monthSelect.value = 'March';
      
      // Trigger the DOMContentLoaded event
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
      
      // Trigger change event to render March data
      const changeEvent = new Event('change');
      monthSelect.dispatchEvent(changeEvent);
      
      // Check March income (3,000,000)
      const totalIncomeDisplay = document.getElementById('total-income-value');
      expect(totalIncomeDisplay.textContent).toBe('3,000,000');
    });
  
    test('calculates March expenses correctly', () => {
      // Set month to March
      const monthSelect = document.getElementById('month-select');
      monthSelect.value = 'March';
      
      // Trigger the DOMContentLoaded event
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
      
      // Trigger change event to render March data
      const changeEvent = new Event('change');
      monthSelect.dispatchEvent(changeEvent);
      
      // Check if all predefined categories are in the table
      const reportTable = document.getElementById('report-table').querySelector('tbody');
      const rows = reportTable.querySelectorAll('tr');
      expect(rows.length).toBe(6); // 6 predefined categories
      
      // In March, only Food & Drinks (1,000,000) and Groceries (600,000) have expenses
      let foodRow = null;
      let groceriesRow = null;
      
      for (const row of rows) {
        const category = row.querySelector('td').textContent;
        if (category === 'Food & Drinks') foodRow = row;
        if (category === 'Groceries') groceriesRow = row;
      }
      
      expect(foodRow.querySelectorAll('td')[1].textContent.trim()).toBe('Rp 1,000,000');
      expect(groceriesRow.querySelectorAll('td')[1].textContent.trim()).toBe('Rp 600,000');
    });
  
    test('calculates March cashflow correctly', () => {
      // Set month to March
      const monthSelect = document.getElementById('month-select');
      monthSelect.value = 'March';
      
      // Trigger the DOMContentLoaded event
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
      
      // Trigger change event to render March data
      const changeEvent = new Event('change');
      monthSelect.dispatchEvent(changeEvent);
      
      // March income: 3,000,000
      // March expenses: 1,000,000 + 600,000 = 1,600,000
      // Cashflow: 3,000,000 - 1,600,000 = 1,400,000
      const cashflowDisplay = document.getElementById('cashflow-value');
      expect(cashflowDisplay.textContent).toBe('1,400,000');
    });
  
    test('renders empty month data correctly', () => {
      // Set month to February (no transactions)
      const monthSelect = document.getElementById('month-select');
      monthSelect.value = 'February';
      
      // Trigger the DOMContentLoaded event
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
      
      // Trigger change event to render February data
      const changeEvent = new Event('change');
      monthSelect.dispatchEvent(changeEvent);
      
      // Check February income (0)
      const totalIncomeDisplay = document.getElementById('total-income-value');
      expect(totalIncomeDisplay.textContent).toBe('0');
      
      // Check if all predefined categories are in the table with zero values
      const reportTable = document.getElementById('report-table').querySelector('tbody');
      const rows = reportTable.querySelectorAll('tr');
      expect(rows.length).toBe(6); // 6 predefined categories
      
      // All categories should have zero expenses
      for (const row of rows) {
        const expenseCell = row.querySelectorAll('td')[1];
        expect(expenseCell.textContent.trim()).toBe('Rp 0');
      }
      
      // Cashflow should be 0
      const cashflowDisplay = document.getElementById('cashflow-value');
      expect(cashflowDisplay.textContent).toBe('0');
    });
  
    test('handles empty transactions array', () => {
      // Mock empty localStorage
      localStorage.getItem = jest.fn().mockReturnValue(null);
      
      // Trigger the DOMContentLoaded event
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
  
      // Check if Chart constructor was still called
      expect(Chart).toHaveBeenCalled();
      
      // Check income (0)
      const totalIncomeDisplay = document.getElementById('total-income-value');
      expect(totalIncomeDisplay.textContent).toBe('0');
      
      // Check cashflow (0)
      const cashflowDisplay = document.getElementById('cashflow-value');
      expect(cashflowDisplay.textContent).toBe('0');
    });
  
    test('chart creation uses correct colors for categories', () => {
      // Trigger the DOMContentLoaded event
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
      
      // Get the chart options from the most recent Chart constructor call
      const chartOptions = Chart.mock.calls[0][1];
      const backgroundColors = chartOptions.data.datasets[0].backgroundColor;
      
      // Verify colors for April data
      // The categories are: Food & Drinks, Groceries, Living Expenses, Entertainment, Payments, Transportations
      // And each should have a specific color defined in categoryColors
      expect(backgroundColors).toEqual(expect.arrayContaining(['#e74c3c', '#f1c40f', '#9b59b6', '#3498db', '#2ecc71', '#e67e22']));
    });
  
    test('chart updates on month change and destroys old chart', () => {
      // Trigger the DOMContentLoaded event
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
      
      // Get the chart instance
      const chartInstance = Chart.mock.results[0].value;
      
      // Change month
      const monthSelect = document.getElementById('month-select');
      monthSelect.value = 'March';
      
      // Trigger change event
      const changeEvent = new Event('change');
      monthSelect.dispatchEvent(changeEvent);
      
      // Check if destroy was called on the old chart
      expect(chartInstance.destroy).toHaveBeenCalled();
      
      // Check if a new chart was created
      expect(Chart.mock.calls.length).toBe(2);
    });
  });