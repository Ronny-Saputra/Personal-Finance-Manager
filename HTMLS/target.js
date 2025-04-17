// script.js
function calculateSavings() {
    let income = parseFloat(document.getElementById("income").value);
    let savingsPercentage = parseFloat(document.getElementById("savings").value);
    
    if (isNaN(income) || income <= 0 || isNaN(savingsPercentage) || savingsPercentage < 0 || savingsPercentage > 100) {
        document.getElementById("result").innerHTML = "Please enter valid numbers";
        document.getElementById("breakdown").innerHTML = "";
        return;
    }
    
    let savingAmount = (income * savingsPercentage) / 100;
    let needs = (income * 50) / 100;
    let wants = (income * 30) / 100;
    
    document.getElementById("result").innerHTML = `Your Saving Target: Rp ${savingAmount.toLocaleString("id-ID")}`;
    document.getElementById("breakdown").innerHTML = `
        Suggested Allocation:<br>
        Needs: Rp ${needs.toLocaleString("id-ID")}<br>
        Wants: Rp ${wants.toLocaleString("id-ID")}<br>
        Savings: Rp ${savingAmount.toLocaleString("id-ID")}
    `;
}

function saveSavings() {
    const monthlyIncome = parseFloat(document.getElementById("income").value);
    const savingsPercentage = parseFloat(document.getElementById("savings").value);
    const resultText = document.getElementById("result").textContent;

    const match = resultText.match(/Rp\s?([\d,.]+)/);
    const recommendedSavings = match ? parseInt(match[1].replace(/\./g, '').replace(/,/g, '')) : NaN;

    if (!monthlyIncome || !savingsPercentage || isNaN(recommendedSavings)) {
        alert("Please fill in and calculate your savings first.");
        return;
    }

    const newEntry = {
        monthlyIncome,
        savingsPercentage,
        recommendedSavings,
        createdAt: new Date().toISOString()
    };

    let savingsData = JSON.parse(localStorage.getItem("savingsData")) || [];
    savingsData.push(newEntry);
    localStorage.setItem("savingsData", JSON.stringify(savingsData));

    alert("Savings data has been saved!");
}
