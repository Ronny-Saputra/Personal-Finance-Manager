// test.js - Unit Tests for Monthly Savings Calculator

// Mock localStorage
const localStorageMock = (function() {
    let store = {};
    return {
      getItem: function(key) {
        return store[key] || null;
      },
      setItem: function(key, value) {
        store[key] = value.toString();
      },
      removeItem: function(key) {
        delete store[key];
      },
      clear: function() {
        store = {};
      }
    };
  })();
  
  // Replace localStorage with mock
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
  });
  
  // Mock DOM elements
  function setupDOMElements() {
    document.body.innerHTML = `
      <select id="month">
        <option value="January">January</option>
        <option value="February">February</option>
      </select>
      <input type="text" id="income" value="100.000.000">
      <input type="number" id="percentage" value="20">
      <input type="text" id="contribution" value="500.000">
      <div id="result"></div>
      <div id="breakdown"></div>
      <div id="allocation"></div>
      <div id="history"></div>
    `;
    
    // Mock alert
    window.alert = jest.fn();
    window.confirm = jest.fn();
  }
  
  describe('Savings Calculator', () => {
    beforeEach(() => {
      // Setup DOM elements before each test
      setupDOMElements();
      localStorageMock.clear();
      window.alert.mockClear();
      window.confirm.mockClear();
      // Reset current savings
      currentSavings = {};
    });
  
    // Test calculateSavings function
    describe('calculateSavings', () => {
      test('calculates savings goal correctly', () => {
        // Setup
        document.getElementById('income').value = '100.000.000';
        document.getElementById('percentage').value = '20';
        
        // Execute
        calculateSavings();
        
        // Assert
        expect(document.getElementById('result').textContent).toBe('Savings Goal: Rp 20.000.000');
        expect(document.getElementById('allocation').innerHTML).toContain('Needs (50%)');
        expect(document.getElementById('allocation').innerHTML).toContain('Wants (30%)');
        expect(document.getElementById('allocation').innerHTML).toContain('Savings (20%)');
      });
      
      test('shows alert for invalid income', () => {
        // Setup
        document.getElementById('income').value = '';
        
        // Execute
        calculateSavings();
        
        // Assert
        expect(window.alert).toHaveBeenCalledWith('Please enter a valid positive income.');
      });
      
      test('shows alert for invalid percentage', () => {
        // Setup
        document.getElementById('income').value = '100000';
        document.getElementById('percentage').value = '101';
        
        // Execute
        calculateSavings();
        
        // Assert
        expect(window.alert).toHaveBeenCalledWith('Please enter a valid percentage between 0 and 100.');
      });
    });
  
    // Test saveSavings function
    describe('saveSavings', () => {
      test('saves savings data to localStorage', () => {
        // Setup
        document.getElementById('month').value = 'January';
        document.getElementById('income').value = '100.000.000';
        document.getElementById('percentage').value = '20';
        
        // Execute
        saveSavings();
        
        // Assert
        const savedData = JSON.parse(localStorage.getItem('savingsData'));
        expect(savedData).toHaveLength(1);
        expect(savedData[0].month).toBe('January');
        expect(savedData[0].monthlyIncome).toBe(100000000);
        expect(savedData[0].savingsPercentage).toBe(20);
        expect(savedData[0].targetAmount).toBe(20000000);
        expect(window.alert).toHaveBeenCalledWith('Savings plan saved!');
      });
      
      test('appends new entry without replacing old ones', () => {
        // Setup - First entry
        document.getElementById('month').value = 'January';
        document.getElementById('income').value = '100.000.000';
        document.getElementById('percentage').value = '20';
        saveSavings();
        
        // Setup - Second entry
        document.getElementById('month').value = 'February';
        document.getElementById('income').value = '200.000.000';
        document.getElementById('percentage').value = '30';
        
        // Execute
        saveSavings();
        
        // Assert
        const savedData = JSON.parse(localStorage.getItem('savingsData'));
        expect(savedData).toHaveLength(2);
        expect(savedData[0].month).toBe('January');
        expect(savedData[1].month).toBe('February');
        expect(savedData[1].monthlyIncome).toBe(200000000);
      });
      
      test('shows alert for invalid income', () => {
        // Setup
        document.getElementById('income').value = '';
        
        // Execute
        saveSavings();
        
        // Assert
        expect(window.alert).toHaveBeenCalledWith('Please enter a valid positive income.');
      });
    });
  
    // Test showHistory function
    describe('showHistory', () => {
      test('displays message when no history exists', () => {
        // Execute
        showHistory();
        
        // Assert
        expect(document.getElementById('history').innerText).toBe('No savings history found.');
      });
      
      test('displays history entries correctly', () => {
        // Setup
        const mockHistory = [
          {
            month: 'January',
            monthlyIncome: 100000000,
            savingsPercentage: 20,
            targetAmount: 20000000,
            recommendedSavings: 5000000,
            createdAt: new Date().toISOString()
          }
        ];
        localStorage.setItem('savingsData', JSON.stringify(mockHistory));
        
        // Execute
        showHistory();
        
        // Assert
        const historyDiv = document.getElementById('history');
        expect(historyDiv.innerHTML).toContain('Month: January');
        expect(historyDiv.innerHTML).toContain('Income: Rp 100.000.000');
        expect(historyDiv.innerHTML).toContain('Percentage: 20%');
      });
    });
  
    // Test addContribution function
    describe('addContribution', () => {
      test('adds contribution to existing month', () => {
        // Setup
        const mockHistory = [
          {
            month: 'January',
            monthlyIncome: 100000000,
            savingsPercentage: 20,
            targetAmount: 20000000,
            recommendedSavings: 5000000,
            createdAt: new Date().toISOString()
          }
        ];
        localStorage.setItem('savingsData', JSON.stringify(mockHistory));
        document.getElementById('month').value = 'January';
        document.getElementById('contribution').value = '500.000';
        
        // Execute
        addContribution();
        
        // Assert
        const updatedData = JSON.parse(localStorage.getItem('savingsData'));
        expect(updatedData[0].recommendedSavings).toBe(5500000);
        expect(window.alert).toHaveBeenCalledWith('Contribution added!');
        expect(document.getElementById('contribution').value).toBe('');
      });
      
      test('shows alert when no savings plan exists for selected month', () => {
        // Setup
        const mockHistory = [
          {
            month: 'January',
            monthlyIncome: 100000000,
            savingsPercentage: 20,
            targetAmount: 20000000,
            recommendedSavings: 5000000,
            createdAt: new Date().toISOString()
          }
        ];
        localStorage.setItem('savingsData', JSON.stringify(mockHistory));
        document.getElementById('month').value = 'February';
        document.getElementById('contribution').value = '500.000';
        
        // Execute
        addContribution();
        
        // Assert
        expect(window.alert).toHaveBeenCalledWith('No savings plan found for the selected month.');
      });
      
      test('shows alert for invalid contribution', () => {
        // Setup
        document.getElementById('contribution').value = '';
        
        // Execute
        addContribution();
        
        // Assert
        expect(window.alert).toHaveBeenCalledWith('Please enter a valid contribution amount.');
      });
    });
  
    // Test clearHistory function
    describe('clearHistory', () => {
      test('clears history when confirmed', () => {
        // Setup
        const mockHistory = [
          {
            month: 'January',
            monthlyIncome: 100000000,
            savingsPercentage: 20,
            targetAmount: 20000000,
            recommendedSavings: 5000000,
            createdAt: new Date().toISOString()
          }
        ];
        localStorage.setItem('savingsData', JSON.stringify(mockHistory));
        window.confirm.mockReturnValue(true);
        
        // Execute
        clearHistory();
        
        // Assert
        expect(localStorage.getItem('savingsData')).toBeNull();
        expect(window.alert).toHaveBeenCalledWith('Savings history cleared!');
      });
      
      test('does not clear history when not confirmed', () => {
        // Setup
        const mockHistory = [
          {
            month: 'January',
            monthlyIncome: 100000000,
            savingsPercentage: 20,
            targetAmount: 20000000,
            recommendedSavings: 5000000,
            createdAt: new Date().toISOString()
          }
        ];
        localStorage.setItem('savingsData', JSON.stringify(mockHistory));
        window.confirm.mockReturnValue(false);
        
        // Execute
        clearHistory();
        
        // Assert
        expect(localStorage.getItem('savingsData')).not.toBeNull();
        expect(window.alert).not.toHaveBeenCalled();
      });
    });
  
    // Test input formatting
    describe('Input Formatting', () => {
      test('formats income input with thousand separators', () => {
        // Setup
        const incomeInput = document.getElementById('income');
        const event = new Event('input');
        
        // Execute
        incomeInput.value = '1000000';
        incomeInput.dispatchEvent(event);
        
        // Assert
        expect(incomeInput.value).toBe('1.000.000');
      });
      
      test('formats contribution input with thousand separators', () => {
        // Setup
        const contributionInput = document.getElementById('contribution');
        const event = new Event('input');
        
        // Execute
        contributionInput.value = '500000';
        contributionInput.dispatchEvent(event);
        
        // Assert
        expect(contributionInput.value).toBe('500.000');
      });
    });
  });
  
  // Integration tests
  describe('Integration Tests', () => {
    beforeEach(() => {
      setupDOMElements();
      localStorageMock.clear();
      window.alert.mockClear();
      currentSavings = {};
    });
    
    test('Complete savings workflow', () => {
      // 1. Calculate savings
      document.getElementById('month').value = 'January';
      document.getElementById('income').value = '100.000.000';
      document.getElementById('percentage').value = '20';
      calculateSavings();
      expect(document.getElementById('result').textContent).toBe('Savings Goal: Rp 20.000.000');
      
      // 2. Save savings plan
      saveSavings();
      let savedData = JSON.parse(localStorage.getItem('savingsData'));
      expect(savedData).toHaveLength(1);
      
      // 3. Add contribution
      document.getElementById('contribution').value = '5.000.000';
      addContribution();
      savedData = JSON.parse(localStorage.getItem('savingsData'));
      expect(savedData[0].recommendedSavings).toBe(5000000);
      
      // 4. Add another contribution
      document.getElementById('contribution').value = '2.000.000';
      addContribution();
      savedData = JSON.parse(localStorage.getItem('savingsData'));
      expect(savedData[0].recommendedSavings).toBe(7000000);
      
      // 5. Create savings plan for another month
      document.getElementById('month').value = 'February';
      document.getElementById('income').value = '150.000.000';
      document.getElementById('percentage').value = '25';
      calculateSavings();
      saveSavings();
      savedData = JSON.parse(localStorage.getItem('savingsData'));
      expect(savedData).toHaveLength(2);
      
      // 6. Verify history display
      showHistory();
      const historyDiv = document.getElementById('history');
      expect(historyDiv.innerHTML).toContain('Month: January');
      expect(historyDiv.innerHTML).toContain('Month: February');
    });
  });