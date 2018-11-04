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
    displayTable();
});

function displayTable() {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;
        const table = new Table({
            head: ['ID', 'Name', 'Price']
            , colWidths: [10, 30, 10]
        });
        for (let i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].price]
            )
        }
        console.log(table.toString());
        buyProduct();
    })
}

function buyProduct() {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'whatItem',
                    type: 'input',
                    message: 'What item would you like to purchase?',
                },
                {
                    name: 'quantityPurchase',
                    type: 'input',
                    message: 'How many units would you like to purchase?'
                },
            ])
            .then(function (answer) {
                const updateID = parseInt(answer.whatItem) - 1;
                const productChosen = res[updateID].stock_quantity;
                const titleItem = res[updateID].product_name;
                const totalPrice = parseInt(answer.quantityPurchase) *  parseInt(res[updateID].price);

                if (productChosen < answer.quantityPurchase) {
                    console.log(`Insufficient quantity!`)
                    buyProduct();
                } else {
                    const updateQuantity = parseInt(productChosen) - parseInt(answer.quantityPurchase);
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
                            console.log(`You are purchasing ${answer.quantityPurchase} ${titleItem} for $${totalPrice}`)
                            console.log('Purchase Succesfully!');
                            connection.end();
                        }
                    )

                };
            });
    })
}
