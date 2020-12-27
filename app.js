class Transaction {
    constructor(id, text, amount) {
    this.id = id;
    this.text = text;
    this.amount = amount;
    }
}


const balance = document.getElementById('balance');
const money_income = document.getElementById('money-plus');
const money_expenses = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.querySelector('#form');
const text = document.getElementById('text');
const amount = document.querySelector('#amount');


/*const dummyTransactions = [
   { id: 1, text: 'Flower', amount: -20 },
   { id: 2, text: 'Salary', amount: 300 },
   { id: 3, text: 'Book', amount: -10 },
   { id: 4, text: 'Camera', amount: 150 }
]*/

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorageTransactions !== null ? localStorageTransactions : [];
//Add transactions to DOM list
function addTransactionDOM(transaction) {
    //Get sign
    const sign = transaction.amount < 0 ? '-' : '+';

    const item = document.createElement('li');
    
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
    
    item.innerHTML = `
    ${transaction.text} <span>${sign}$${Math.abs(transaction.amount)}</span>
    <button onclick="removeTransaction(${transaction.id})" class="delete-btn">X</button>
    `;
    list.appendChild(item);
} 

//Update the balance, income and expense
function updateValues() {
const amounts = transactions.map(function(item) {
    return item.amount;
});

const total = amounts.reduce((acc, item) => acc+=item, 0).toFixed(2);

const income = amounts
                    .filter(item => item > 0)
                    .reduce((acc, item) => acc+=item , 0).toFixed(2);
const expenses = amounts
                     .filter(item => item < 0)
                     .reduce((acc, item) => acc+=item, 0).toFixed(2);

//Set values in the DOM
balance.innerHTML = `$${total}`;
money_income.innerText = `$${income}`;
money_expenses.innerText = `$${expenses}`;

} 

//Update localStorage transactions
function updateLocalStorage() {
localStorage.setItem('transactions', JSON.stringify(transactions));
}
//init app
function init() {
    list.innerHTML = '';

    transactions.forEach(transaction => {
        addTransactionDOM(transaction);
    })
    updateValues();

    text.value = '';
    amount.value = '';
}
init();

form.addEventListener('submit', addTransaction);

function addTransaction(e) {
e.preventDefault();

if(text.value === '' || amount.value === '') {
showAlert('Please fill all the fields');
} else {
     const transaction = new Transaction(generateID(), text.value, 
     Number(amount.value));
     transactions.push(transaction);
     addTransactionDOM(transaction);
     updateLocalStorage();

     updateValues();
}
}

//Show alert function
function showAlert(message) {
    const element = document.createElement('div');
    element.classList.add('alert');
    element.appendChild(document.createTextNode(message));

    form.insertBefore(element, form.firstElementChild);
    setTimeout(() => element.remove(), 3000);
}

//Generate Random Id
function generateID() {
    return Math.floor(Math.random()*10000000);
}

//Remove Transaction
function removeTransaction(id) {
 transactions = transactions.filter
 (transaction => transaction.id !== id );
 
 updateLocalStorage();
 init();
}