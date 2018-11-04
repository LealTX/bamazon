require('dotenv').config();
const mysql = require('mysql');
const inquirer = require('inquirer');
const Table = require('cli-table2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || '',
});

connection.connect((err) => {
    if (err) throw (err);
    console.log(`connected as id ${connection.threadId}`);
    menuOption();
});

function menuOption() {
    inquirer
        .prompt({
            name: 'selectOption',
            type: 'list',
            message: 'Would you like to do?',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
        })
        .then(function (answer) {
            switch (answer.selectOption) {
                case 'View Products for Sale':
                    productSale();
                    break;
                case 'View Low Inventory':
                    lowInventory();
                    break;
                case 'Add to Inventory':
                    addInventory();
                    break;
                case 'Add New Product':
                    newProduct();
                    break;
            }
        });
}

function productSale() {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;
        const table = new Table({
            head: ['ID', 'Name', 'Price', 'Quantity']
            , colWidths: [10, 30, 10, 10]
        });
        for (let i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]
            )
        }
        console.log(`\n${table.toString()}`);
        menuOption();
    });
}

function lowInventory() {
    connection.query('SELECT * FROM products WHERE stock_quantity <= 5', function (err, res) {
        if (err) throw err;
        const table = new Table({
            head: ['ID', 'Name', 'Price', 'Quantity']
            , colWidths: [10, 30, 10, 10]
        });
        for (let i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]
            )
        }
        console.log(`\n${table.toString()}`);
        menuOption();
    });
}

function addInventory() {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'whatItem',
                    type: 'input',
                    message: 'What item ID would you like to refill?',
                },
                {
                    name: 'quantityPurchase',
                    type: 'input',
                    message: 'How many units would you like to add?'
                },
            ])
            .then(function (answer) {
                const updateID = parseInt(answer.whatItem) - 1;
                const productChosen = res[updateID].stock_quantity;
                const titleItem = res[updateID].product_name;

                const updateQuantity = parseInt(productChosen) + parseInt(answer.quantityPurchase);
                connection.query(`UPDATE products SET ? WHERE ?`,
                    [
                        {
                            stock_quantity: updateQuantity
                        },
                        {
                            item_id: answer.whatItem
                        },
                    ],
                    function (err) {
                        if (err) throw err;
                        console.log(`You have added ${answer.quantityPurchase} to ${titleItem}`);
                        menuOption();
                    }
                )
            });
    })
}

function newProduct(){
    inquirer
    .prompt([
        {
            name: 'productName',
            type: 'input',
            message: 'What Product would you like to add?',
        },
        {
            name: 'departmentType',
            type: 'input',
            message: 'What department does it go?',
        },
        {
            name: 'itemPrice',
            type: 'input',
            message: 'How much should it cost?',
        },
        {
            name: 'itemStock',
            type: 'input',
            message: 'How much should we order?',
        },
    ])
    .then(function(answer){
        connection.query(`INSERT INTO products (product_name, department_name, price, stock_quantity) 
        VALUES ('${answer.productName}','${answer.departmentType}',${answer.itemPrice},${answer.itemStock})`)
        menuOption();
    })

}