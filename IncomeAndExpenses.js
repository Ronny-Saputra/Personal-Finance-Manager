// Bar Chart untuk Income
const incomeCtx = document.getElementById('incomeChart').getContext('2d');
const incomeChart = new Chart(incomeCtx, {
  type: 'bar',
  data: {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [{
      label: 'Income',
      data: [6500000, 7000000, 8000000, 6700000, 6200000],
      backgroundColor: '#27ae60'
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          // Anda bisa menyesuaikan format tampilan (misalnya menambahkan "Rp" dsb)
          callback: function(value) {
            return 'Rp. ' + value.toLocaleString();
          }
        }
      }
    }
  }
});

// Doughnut Chart untuk Expenses
const expensesCtx = document.getElementById('expensesChart').getContext('2d');
const expensesChart = new Chart(expensesCtx, {
  type: 'doughnut',
  data: {
    labels: [
      'Food and Drinks',
      'Groceries',
      'Entertainment',
      'Transportation',
      'Payments',
      'Living Expenses'
    ],
    datasets: [{
      data: [5744000, 2600000, 1700000, 2000000, 3100000, 4000000],
      backgroundColor: [
        '#f1c40f',
        '#e67e22',
        '#9b59b6',
        '#3498db',
        '#e74c3c',
        '#2ecc71'
      ]
    }]
  },
  options: {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            let value = context.parsed;
            // Format angka agar terlihat seperti rupiah
            return context.label + ': Rp. ' + value.toLocaleString();
          }
        }
      }
    }
  }
});
