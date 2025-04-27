/**
 * @jest-environment jsdom
 */

// Import the functions to test
// Note: In a real scenario, you would need to export these functions from your add.js file
// For this test, we'll mock them directly

describe('Add Income & Expenses Page', () => {
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
    
    Object.defineProperty(window, 'alert', {
      value: jest.fn()
    });
    
    Object.defineProperty(window, 'location', {
      value: { href: '' }
    });
    
    // Set up our document body with the required HTML structure
    beforeEach(() => {
      document.body.innerHTML = `
        <div class="form-wrapper">
          <div class="form-section">
            <input type="number" id="amount" class="input yellow" placeholder="Rp." />
          </div>
          
          <div class="form-section">
            <button class="toggle-btn income">Income</button>
            <button class="toggle-btn expense">Expense</button>
          </div>
          
          <div class="form-section">
            <div class="category-grid">
              <button>Food & Drinks</button>
              <button>Living Expenses</button>
              <button>Groceries</button>
              <button>Payments</button>
              <button>Entertainment</button>
              <button>Transportations</button>
            </div>
          </div>
          
          <div class="form-section">
            <input type="date" id="date" class="input blue" />
            <input type="time" id="time" class="input blue" />
          </div>
        </div>
      `;
      
      // Reset globals
      global.selectedType = "income";
      global.selectedCategory = null;
      
      // Define the functions from add.js in the global scope
      global.selectType = function(type) {
        selectedType = type;
        document.querySelectorAll(".toggle-btn").forEach(btn => btn.classList.remove("selected"));
        document.querySelector(`.toggle-btn.${type}`).classList.add("selected");
        
        const categoryButtons = document.querySelectorAll(".category-grid button");
        
        if (type === "income") {
          selectedCategory = null;
          categoryButtons.forEach(btn => {
            btn.classList.remove("selected");
            btn.disabled = true;
            btn.style.opacity = 0.5;
            btn.style.cursor = "not-allowed";
          });
        } else {
          categoryButtons.forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = 1;
            btn.style.cursor = "pointer";
          });
        }
      };
      
      global.selectCategory = function(button) {
        document.querySelectorAll(".category-grid button").forEach(btn => btn.classList.remove("selected"));
        button.classList.add("selected");
        selectedCategory = button.textContent.trim();
      };
      
      global.submitForm = function() {
        const amount = parseFloat(document.getElementById("amount").value);
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
        
        if (!amount || !date || !time || (selectedType === "expense" && !selectedCategory)) {
          alert("Please fill in all required fields.");
          return;
        }
        
        const fullDateTime = `${date}T${time}`;
        
        const newTransaction = {
          amount,
          type: selectedType,
          category: selectedType === "income" ? "Income" : selectedCategory,
          date: fullDateTime
        };
        
        let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        transactions.push(newTransaction);
        localStorage.setItem("transactions", JSON.stringify(transactions));
        
        alert("Transaction successfully added!");
        window.location.href = "dashboard.html";
      };
    });
    
    // Tests for selectType function
    describe('selectType function', () => {
      test('should set selectedType to income and update UI accordingly', () => {
        // Call the function
        selectType('income');
        
        // Check if global variable was updated
        expect(selectedType).toBe('income');
        
        // Check if the appropriate button was selected
        const incomeBtn = document.querySelector('.toggle-btn.income');
        expect(incomeBtn.classList.contains('selected')).toBe(true);
        
        // Check if expense button was deselected
        const expenseBtn = document.querySelector('.toggle-btn.expense');
        expect(expenseBtn.classList.contains('selected')).toBe(false);
        
        // Check if category buttons were disabled for income
        const categoryButtons = document.querySelectorAll('.category-grid button');
        categoryButtons.forEach(btn => {
          expect(btn.disabled).toBe(true);
          expect(btn.style.opacity).toBe('0.5');
          expect(btn.style.cursor).toBe('not-allowed');
        });
      });
      
      test('should set selectedType to expense and update UI accordingly', () => {
        // Call the function
        selectType('expense');
        
        // Check if global variable was updated
        expect(selectedType).toBe('expense');
        
        // Check if the appropriate button was selected
        const expenseBtn = document.querySelector('.toggle-btn.expense');
        expect(expenseBtn.classList.contains('selected')).toBe(true);
        
        // Check if income button was deselected
        const incomeBtn = document.querySelector('.toggle-btn.income');
        expect(incomeBtn.classList.contains('selected')).toBe(false);
        
        // Check if category buttons were enabled for expense
        const categoryButtons = document.querySelectorAll('.category-grid button');
        categoryButtons.forEach(btn => {
          expect(btn.disabled).toBe(false);
          expect(btn.style.opacity).toBe('1');
          expect(btn.style.cursor).toBe('pointer');
        });
      });
    });
    
    // Tests for selectCategory function
    describe('selectCategory function', () => {
      test('should set selectedCategory to the text content of the clicked button', () => {
        // First set type to expense to enable category buttons
        selectType('expense');
        
        // Get a category button
        const categoryButton = document.querySelector('.category-grid button');
        
        // Call the function
        selectCategory(categoryButton);
        
        // Check if global variable was updated
        expect(selectedCategory).toBe(categoryButton.textContent.trim());
        
        // Check if the button was selected
        expect(categoryButton.classList.contains('selected')).toBe(true);
        
        // Check if other buttons were deselected
        const otherButtons = Array.from(document.querySelectorAll('.category-grid button')).filter(btn => btn !== categoryButton);
        otherButtons.forEach(btn => {
          expect(btn.classList.contains('selected')).toBe(false);
        });
      });
    });
    
    // Tests for submitForm function
    describe('submitForm function', () => {
      test('should show alert if amount is not provided', () => {
        // Set up form values
        document.getElementById('date').value = '2025-04-26';
        document.getElementById('time').value = '14:30';
        
        // Call the function
        submitForm();
        
        // Check if alert was called
        expect(window.alert).toHaveBeenCalledWith('Please fill in all required fields.');
      });
      
      test('should show alert if date is not provided', () => {
        // Set up form values
        document.getElementById('amount').value = '100';
        document.getElementById('time').value = '14:30';
        
        // Call the function
        submitForm();
        
        // Check if alert was called
        expect(window.alert).toHaveBeenCalledWith('Please fill in all required fields.');
      });
      
      test('should show alert if time is not provided', () => {
        // Set up form values
        document.getElementById('amount').value = '100';
        document.getElementById('date').value = '2025-04-26';
        
        // Call the function
        submitForm();
        
        // Check if alert was called
        expect(window.alert).toHaveBeenCalledWith('Please fill in all required fields.');
      });
      
      test('should show alert if type is expense but no category is selected', () => {
        // Set up form values
        document.getElementById('amount').value = '100';
        document.getElementById('date').value = '2025-04-26';
        document.getElementById('time').value = '14:30';
        
        // Set type to expense but don't select a category
        selectType('expense');
        
        // Call the function
        submitForm();
        
        // Check if alert was called
        expect(window.alert).toHaveBeenCalledWith('Please fill in all required fields.');
      });
      
      test('should save income transaction and redirect to dashboard', () => {
        // Set up form values
        document.getElementById('amount').value = '100';
        document.getElementById('date').value = '2025-04-26';
        document.getElementById('time').value = '14:30';
        
        // Set type to income
        selectType('income');
        
        // Mock localStorage.getItem to return empty array
        localStorage.getItem.mockReturnValueOnce('[]');
        
        // Call the function
        submitForm();
        
        // Check if transaction was saved to localStorage
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'transactions', 
          JSON.stringify([{
            amount: 100,
            type: 'income',
            category: 'Income',
            date: '2025-04-26T14:30'
          }])
        );
        
        // Check if success alert was shown
        expect(window.alert).toHaveBeenCalledWith('Transaction successfully added!');
        
        // Check if redirect happened
        expect(window.location.href).toBe('dashboard.html');
      });
      
      test('should save expense transaction and redirect to dashboard', () => {
        // Set up form values
        document.getElementById('amount').value = '50';
        document.getElementById('date').value = '2025-04-26';
        document.getElementById('time').value = '15:45';
        
        // Set type to expense and select a category
        selectType('expense');
        const categoryButton = document.querySelector('.category-grid button');
        selectCategory(categoryButton);
        
        // Mock localStorage.getItem to return existing transactions
        localStorage.getItem.mockReturnValueOnce(JSON.stringify([
          {
            amount: 100,
            type: 'income',
            category: 'Income',
            date: '2025-04-25T10:00'
          }
        ]));
        
        // Call the function
        submitForm();
        
        // Check if transaction was saved to localStorage
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'transactions', 
          JSON.stringify([
            {
              amount: 100,
              type: 'income',
              category: 'Income',
              date: '2025-04-25T10:00'
            },
            {
              amount: 50,
              type: 'expense',
              category: categoryButton.textContent.trim(),
              date: '2025-04-26T15:45'
            }
          ])
        );
        
        // Check if success alert was shown
        expect(window.alert).toHaveBeenCalledWith('Transaction successfully added!');
        
        // Check if redirect happened
        expect(window.location.href).toBe('dashboard.html');
      });
    });
  });