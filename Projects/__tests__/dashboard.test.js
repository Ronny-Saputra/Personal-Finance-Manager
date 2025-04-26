/**
 * @jest-environment jsdom
 */

// Mock Chart.js
jest.mock('chart.js', () => {
    return class Chart {
      constructor() {
        return {};
      }
    };
  });
  
  describe('Dashboard Page', () => {
    // Mock localStorage
    const localStorageMock = (function() {
      let store = {};
      return {
        getItem: jest.fn(key => store[key] || null),
        setItem: jest.fn((key, value) => {
          store[key] = value.toString();
        }),
        clear: function() {
          store = {};
        }
      };
    })();
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });
    
    // Sample test data
    const sampleTransactions = [
      {
        amount: 5000000,
        type: 'income',
        category: 'Income',
        date: '2025-01-15T10:00'
      },
      {
        amount: 1000000,
        type: 'expense',
        category: 'Food & Drinks',
        date: '2025-01-20T12:30'
      },
      {
        amount: 2000000,
        type: 'expense',
        category: 'Living Expenses',
        date: '2025-01-25T15:45'
      },
      {
        amount: 4000000,
        type: 'income',
        category: 'Income',
        date: '2025-02-15T10:00'
      }
    ];
    
    const sampleSavingsData = [
      {
        month: 'January',
        targetAmount: 5000000,
        monthlyIncome: 10000000,
        recommendedSavings: 4000000,
        savingsPercentage: 40,
        createdAt: '2025-01-01T10:00'
      },
      {
        month: 'February',
        targetAmount: 6000000,
        monthlyIncome: 12000000,
        recommendedSavings: 4800000,
        savingsPercentage: 40,
        createdAt: '2025-02-01T10:00'
      }
    ];
    
    // Setup DOM before each test
    beforeEach(() => {
      // Set up our document body for testing
      document.body.innerHTML = `
        <div class="main-content">
          <div class="graph-row">
            <div class="graph-container">
              <canvas id="incomeChart"></canvas>
            </div>
            <div class="graph-container">
              <canvas id="expenseChart"></canvas>
            </div>
          </div>
          <div class="data-section">
            <div class="data-card">
              <h3>Income Summary</h3>
              <table class="data-table" id="income-summary">
                <tr><th>Month</th><th>Amount</th></tr>
              </table>
            </div>
            <div class="data-card">
              <h3>Expense Percentage</h3>
              <table class="data-table" id="expense-percentage">
                <tr><th>Category</th><th>Percentage</th></tr>
              </table>
            </div>
          </div>
          <div class="data-card">
            <h3>Saved Savings Plans</h3>
            <table class="data-table" id="savings-list">
              <tr>
                <th>Month</th>
                <th>Target</th>
                <th>Income</th>
                <th>Saved</th>
                <th>Percent</th>
                <th>Date</th>
              </tr>
            </table>
          </div>
        </div>
      `;
      
      // Reset localStorage mock
      localStorage.clear();
    });
    
    // Load the dashboard.js script content here to access the functions
    function loadDashboardScript() {
      // Define the function from dashboard.js in the global scope
      document.addEventListener("DOMContentLoaded", () => {
        // Function to populate the Saved Savings Plans table
        function populateSavingsTable() {
          const savingsList = document.getElementById("savings-list");
          if (!savingsList) return;
      
          // Clear existing rows in the table
          savingsList.innerHTML = `
            <tr>
              <th>Month</th>
              <th>Target</th>
              <th>Income</th>
              <th>Saved</th>
              <th>Percent</th>
              <th>Date</th>
            </tr>
          `;
      
          // Retrieve savings data from localStorage
          const savingsData = JSON.parse(localStorage.getItem("savingsData")) || [];
      
          // Populate the table with savings data
          savingsData.forEach(entry => {
            // Calculate progress percentage
            const progressPercentage = entry.targetAmount
              ? ((entry.recommendedSavings / entry.targetAmount) * 100).toFixed(1)
              : 0;
      
            // Create a new row for the table
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
              <td>${entry.month}</td>
              <td>Rp. ${entry.targetAmount ? entry.targetAmount.toLocaleString() : "-"}</td>
              <td>Rp. ${entry.monthlyIncome.toLocaleString()}</td>
              <td>Rp. ${entry.recommendedSavings.toLocaleString()}</td>
              <td>${entry.savingsPercentage}%</td>
              <td>${new Date(entry.createdAt).toLocaleDateString()}</td>
            `;
      
            // Append the row to the table
            savingsList.appendChild(newRow);
      
            // Create a container for the progress bar
            const progressBarContainer = document.createElement("tr");
            progressBarContainer.innerHTML = `
              <td colspan="6">
                <div class="progress-bar-container">
                  <strong>Progress:</strong>
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercentage}%;"></div>
                  </div>
                  <p>Rp. ${entry.recommendedSavings.toLocaleString()} / Rp. ${entry.targetAmount ? entry.targetAmount.toLocaleString() : "-"}</p>
                </div>
              </td>
            `;
      
            // Append the progress bar container to the table
            savingsList.appendChild(progressBarContainer);
          });
        }
      
        // Initial population of the savings table
        populateSavingsTable();
      
        // ✅ Income Summary Table
        const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        const incomeSummary = {};
        const expenseCategories = {};
        transactions.forEach(t => {
          const month = new Date(t.date).toLocaleString("default", { month: "long" });
          if (t.type === "income") {
            incomeSummary[month] = (incomeSummary[month] || 0) + t.amount;
          } else if (t.type === "expense") {
            expenseCategories[t.category] = (expenseCategories[t.category] || 0) + t.amount;
          }
        });
      
        const incomeTable = document.getElementById("income-summary");
        if (incomeTable) {
          let total = 0;
          incomeTable.innerHTML = "<tr><th>Month</th><th>Amount</th></tr>";
          Object.keys(incomeSummary).forEach(month => {
            const amt = incomeSummary[month];
            total += amt;
            incomeTable.innerHTML += `<tr><td>${month}</td><td>Rp. ${amt.toLocaleString()}</td></tr>`;
          });
          incomeTable.innerHTML += `
            <tr class="total-row">
              <td><strong>Total</strong></td>
              <td><strong>Rp. ${total.toLocaleString()}</strong></td>
            </tr>
          `;
        }
      
        // ✅ Expense Percentage Table
        const expenseTable = document.getElementById("expense-percentage");
        if (expenseTable) {
          let totalExpense = Object.values(expenseCategories).reduce((a, b) => a + b, 0);
          expenseTable.innerHTML = "<tr><th>Category</th><th>Percentage</th></tr>";
          Object.entries(expenseCategories).forEach(([cat, amt]) => {
            let perc = ((amt / totalExpense) * 100).toFixed(1);
            expenseTable.innerHTML += `<tr><td>${cat}</td><td>${perc}%</td></tr>`;
          });
          expenseTable.innerHTML += `
            <tr class="total-row">
              <td><strong>Total</strong></td>
              <td><strong>100%</strong></td>
            </tr>
          `;
        }
      
        // ✅ Income Pie Chart
        const incomeCtx = document.getElementById("incomeChart");
        if (incomeCtx && Object.keys(incomeSummary).length > 0) {
          new Chart(incomeCtx, {
            type: 'pie',
            data: {
              labels: Object.keys(incomeSummary),
              datasets: [{
                label: 'Monthly Income',
                data: Object.values(incomeSummary),
                backgroundColor: [
                  '#4caf50', '#2196f3', '#ff9800', '#e91e63', '#9c27b0', '#00bcd4'
                ],
                borderColor: '#fff',
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom'
                },
                title: {
                  display: true,
                  text: 'Income by Month'
                }
              }
            }
          });
        }
      
        // ✅ Expense Pie Chart
        const expCtx = document.getElementById("expenseChart");
        if (expCtx && Object.keys(expenseCategories).length > 0) {
          const totalExpenseAmount = Object.values(expenseCategories).reduce((a, b) => a + b, 0);
          const expenseLabels = Object.keys(expenseCategories);
          const expenseValues = Object.values(expenseCategories);
          new Chart(expCtx, {
            type: 'pie',
            data: {
              labels: expenseLabels,
              datasets: [{
                label: 'Expense Distribution',
                data: expenseValues,
                backgroundColor: [
                  '#ff5722', '#ffc107', '#8bc34a', '#00bcd4', '#9c27b0', '#ff9800'
                ],
                borderColor: '#fff',
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom'
                },
                title: {
                  display: true,
                  text: 'Expense by Category'
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const amount = context.raw;
                      const percentage = ((amount / totalExpenseAmount) * 100).toFixed(1);
                      return `${context.label}: Rp. ${amount.toLocaleString()} (${percentage}%)`;
                    }
                  }
                }
              }
            }
          });
        }
      });
      
      // Trigger the DOMContentLoaded event
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
    }
  
    test('should populate savings list table correctly', () => {
      // Mock localStorage.getItem to return sample data
      localStorage.getItem.mockReturnValueOnce(JSON.stringify(sampleSavingsData));
      
      // Load script and trigger initialization
      loadDashboardScript();
      
      // Check if table has correct number of rows (header + 2 savings entries + 2 progress bars)
      const tableRows = document.querySelectorAll('#savings-list tr');
      expect(tableRows.length).toBe(5); // 1 header + 2 data rows + 2 progress bar rows
      
      // Check if January savings data is displayed correctly
      const januaryRow = tableRows[1];
      expect(januaryRow.cells[0].textContent).toBe('January');
      expect(januaryRow.cells[1].textContent).toBe('Rp. 5,000,000');
      expect(januaryRow.cells[2].textContent).toBe('Rp. 10,000,000');
      expect(januaryRow.cells[3].textContent).toBe('Rp. 4,000,000');
      expect(januaryRow.cells[4].textContent).toBe('40%');
      
      // Check if progress bars are rendered
      const firstProgressBar = document.querySelector('.progress-fill');
      expect(firstProgressBar).not.toBeNull();
      expect(firstProgressBar.style.width).toBe('80%');
    });
    
    test('should populate income summary table correctly', () => {
      // Mock localStorage.getItem to return sample data
      localStorage.getItem.mockReturnValueOnce(JSON.stringify(sampleTransactions));
      
      // Load script and trigger initialization
      loadDashboardScript();
      
      // Check if table has correct data
      const tableRows = document.querySelectorAll('#income-summary tr');
      
      // Should have 4 rows: header + January + February + Total
      expect(tableRows.length).toBe(4);
      
      // Check January income
      expect(tableRows[1].cells[0].textContent).toBe('January');
      expect(tableRows[1].cells[1].textContent).toBe('Rp. 5,000,000');
      
      // Check February income
      expect(tableRows[2].cells[0].textContent).toBe('February');
      expect(tableRows[2].cells[1].textContent).toBe('Rp. 4,000,000');
      
      // Check total row
      expect(tableRows[3].cells[0].textContent).toBe('Total');
      expect(tableRows[3].cells[1].textContent).toBe('Rp. 9,000,000');
    });
    
    test('should populate expense percentage table correctly', () => {
      // Mock localStorage.getItem to return sample data
      localStorage.getItem.mockReturnValueOnce(JSON.stringify(sampleTransactions));
      
      // Load script and trigger initialization
      loadDashboardScript();
      
      // Check if table has correct data
      const tableRows = document.querySelectorAll('#expense-percentage tr');
      
      // Should have 4 rows: header + Food & Drinks + Living Expenses + Total
      expect(tableRows.length).toBe(4);
      
      // Find Food & Drinks row (order might vary)
      let foodRow = null;
      let livingRow = null;
      
      for (let i = 1; i < tableRows.length - 1; i++) {
        const category = tableRows[i].cells[0].textContent;
        if (category === 'Food & Drinks') {
          foodRow = tableRows[i];
        } else if (category === 'Living Expenses') {
          livingRow = tableRows[i];
        }
      }
      
      // Food & Drinks should be 33.3% of total expenses
      expect(foodRow.cells[0].textContent).toBe('Food & Drinks');
      expect(parseFloat(foodRow.cells[1].textContent)).toBeCloseTo(33.3, 1);
      
      // Living Expenses should be 66.7% of total expenses
      expect(livingRow.cells[0].textContent).toBe('Living Expenses');
      expect(parseFloat(livingRow.cells[1].textContent)).toBeCloseTo(66.7, 1);
      
      // Check total row
      expect(tableRows[3].cells[0].textContent).toBe('Total');
      expect(tableRows[3].cells[1].textContent).toBe('100%');
    });
    
    test('should handle empty transactions data', () => {
      // Mock localStorage.getItem to return empty array
      localStorage.getItem.mockReturnValueOnce('[]');
      
      // Load script and trigger initialization
      loadDashboardScript();
      
      // Check if income table only has header row
      const incomeTableRows = document.querySelectorAll('#income-summary tr');
      expect(incomeTableRows.length).toBe(2); // Header + total row
      
      // Check total is 0
      expect(incomeTableRows[1].cells[1].textContent).toBe('Rp. 0');
      
      // Check if expense table only has header row
      const expenseTableRows = document.querySelectorAll('#expense-percentage tr');
      expect(expenseTableRows.length).toBe(2); // Header + total row
    });
    
    test('should handle empty savings data', () => {
      // Mock localStorage.getItem to return empty array
      localStorage.getItem.mockReturnValueOnce('[]');
      
      // Load script and trigger initialization
      loadDashboardScript();
      
      // Check if savings table only has header row
      const savingsTableRows = document.querySelectorAll('#savings-list tr');
      expect(savingsTableRows.length).toBe(1); // Just the header
    });
    
    test('should correctly format currency values', () => {
      // Mock localStorage.getItem to return sample data
      localStorage.getItem.mockReturnValueOnce(JSON.stringify(sampleSavingsData));
      
      // Load script and trigger initialization
      loadDashboardScript();
      
      // Check if numbers are formatted with thousand separators
      const tableRows = document.querySelectorAll('#savings-list tr');
      const januaryRow = tableRows[1];
      
      expect(januaryRow.cells[1].textContent).toBe('Rp. 5,000,000');
      expect(januaryRow.cells[2].textContent).toBe('Rp. 10,000,000');
      expect(januaryRow.cells[3].textContent).toBe('Rp. 4,000,000');
    });
    
    test('should correctly calculate savings progress percentage', () => {
      // Create custom savings data with specific values for testing percentage
      const customSavingsData = [{
        month: 'March',
        targetAmount: 2000000,
        monthlyIncome: 5000000,
        recommendedSavings: 1000000, // 50% of target
        savingsPercentage: 20,
        createdAt: '2025-03-01T10:00'
      }];
      
      // Mock localStorage.getItem to return custom data
      localStorage.getItem.mockReturnValueOnce(JSON.stringify(customSavingsData));
      
      // Load script and trigger initialization
      loadDashboardScript();
      
      // Check if progress bar width is correctly set to 50%
      const progressBar = document.querySelector('.progress-fill');
      expect(progressBar.style.width).toBe('50%');
      
      // Check progress text
      const progressText = document.querySelector('.progress-bar-container p').textContent;
      expect(progressText).toBe('Rp. 1,000,000 / Rp. 2,000,000');
    });
  });