var account = document.getElementById("account");
var form = document.forms[0];
var btnCalculate = document.getElementById("calculate");
var selector1 = document.querySelectorAll("select")[0];
var selector2 = document.querySelectorAll("select")[1];
var myStorage = window.localStorage;
var incomeRecords = [];
var expensesRecords = [];
var amount = Number(myStorage.getItem("amount"));
var btnShow = document.getElementById("show");
var btnSortIncome = document.getElementById("sortIncome");
var btnSortExpenses = document.getElementById("sortExpenses");
var expensesTable = document.getElementById("expenses");
var incomeTable = document.getElementById("income");
var clicked = false;
var filterIncome = document.getElementById("deposits");
var filterExpenses = document.getElementById("withdrawals");

function compareNumbers(a, b) {
    return a - b;
}

function createTable(storageItem, storageItemTable, colorNo) {
    for (i = 0; i < storageItem.length; i++) {
        var row = storageItemTable.getElementsByTagName('tbody')[0].insertRow(0);
        row.insertCell(0).innerHTML = `${storageItem[i]} Eur`;
        row.style.color = colorNo;
    }
};

function getAccountStatement() {
    var deposits = JSON.parse(myStorage.getItem("deposits"));
    createTable(deposits, incomeTable, "#2eb346");
    var withdrawals = JSON.parse(myStorage.getItem("withdrawals"));
    createTable(withdrawals, expensesTable, "#c22f2f");
}

account.innerHTML = `Jūsų sąskaitoje yra ${amount} Eur.`;

//store amount added/withdrawn into local storage
btnCalculate.addEventListener("click", function (e) {
    var record = form["record"].value;
    if (record != "") {
        if (selector1.value == 1) {
            e.preventDefault();
            amount += Number(record);
            myStorage.setItem("amount", amount);
            incomeRecords.push(record);
            myStorage.setItem("deposits", JSON.stringify(incomeRecords));
            account.innerHTML = `Jūsų sąskaitoje yra ${amount} Eur.`;
        } else if (selector1.value == 2) {
            e.preventDefault();
            amount += Number(record) * -1;
            myStorage.setItem("amount", amount);
            expensesRecords.push(record * -1);
            myStorage.setItem("withdrawals", JSON.stringify(expensesRecords));
            account.innerHTML = `Jūsų sąskaitoje yra ${amount} Eur.`;
        }
    }
});

//Show all operations
btnShow.addEventListener("click", function (e) {
    e.preventDefault();
    if (selector2.value == 0) {
        incomeTable.getElementsByTagName('tbody')[0].innerHTML = "";
        expensesTable.getElementsByTagName('tbody')[0].innerHTML = "";
        incomeTable.classList.remove("d-none");
        expensesTable.classList.remove("d-none");
        getAccountStatement();
    } else if (selector2.value == 1) {
        incomeTable.classList.remove("d-none");
        expensesTable.classList.add("d-none");
    } else if (selector2.value == 2) {
        expensesTable.classList.remove("d-none");
        incomeTable.classList.add("d-none");
    }
})

//Sort function, first click - sorts in descending order, second click - sorts in ascending order
btnSortIncome.addEventListener("click", function () {
    incomeTable.getElementsByTagName('tbody')[0].innerHTML = "";
    var deposits = JSON.parse(myStorage.getItem("deposits"));
    if (clicked) {
        deposits = deposits.sort(compareNumbers);
        createTable(deposits, incomeTable, "#2eb346");
        clicked = false;
    } else {
        deposits = deposits.sort(compareNumbers).reverse(compareNumbers);
        createTable(deposits, incomeTable, "#2eb346");
        clicked = true;
    }
})

//Sort function, first click - sorts in descending order, second click - sorts in ascending order
btnSortExpenses.addEventListener("click", function () {
    expensesTable.getElementsByTagName('tbody')[0].innerHTML = "";
    var withdrawals = JSON.parse(myStorage.getItem("withdrawals"));
    if (clicked) {
        withdrawals = withdrawals.sort(compareNumbers);
        createTable(withdrawals, expensesTable, "#c22f2f");
        clicked = false;
    } else {
        withdrawals = withdrawals.sort(compareNumbers).reverse(compareNumbers);
        createTable(withdrawals, expensesTable, "#c22f2f");
        clicked = true;
    }
})

//Filter function for income
filterIncome.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        var deposits = JSON.parse(myStorage.getItem("deposits"));
        var searchCriteria = filterIncome.value;
        incomeTable.getElementsByTagName('tbody')[0].innerHTML = "";
        var filteredArr = [];
        for (var i = 0; i < deposits.length; i++) {
            if (deposits[i].toString().indexOf(searchCriteria) != -1) {
                filteredArr.push(deposits[i]);
            }
        }
        createTable(filteredArr, incomeTable, "#2eb346");
    }
});

//Filter function for expenses
filterExpenses.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        var withdrawals = JSON.parse(myStorage.getItem("withdrawals"));
        var searchCriteria = filterExpenses.value;
        expensesTable.getElementsByTagName('tbody')[0].innerHTML = "";
        var filteredArr = [];
        for (var i = 0; i < withdrawals.length; i++) {
            if (withdrawals[i].toString().indexOf(searchCriteria) != -1) {
                filteredArr.push(withdrawals[i]);
            }
        }
        createTable(filteredArr, expensesTable, "#c22f2f");
    }
});
