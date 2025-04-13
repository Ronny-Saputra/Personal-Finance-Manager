document.addEventListener("DOMContentLoaded", function() {
  var ctx = document.getElementById("expensesChart").getContext("2d");

  var expensesChart = new Chart(ctx, {
      type: "bar",
      data: {
          labels: ["Transportation", "Entertainment", "Utilities", "Rent"],
          datasets: [
              {
                  label: "January",
                  backgroundColor: "#f4a261",
                  data: [200000, 180000, 300000, 600000]
              },
              {
                  label: "February",
                  backgroundColor: "#e76f51",
                  data: [150000, 160000, 250000, 400000]
              },
              {
                  label: "March",
                  backgroundColor: "#2a9d8f",
                  data: [170000, 160000, 250000, 200000]
              }
          ]
      },
      options: {
          responsive: true,
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
});
