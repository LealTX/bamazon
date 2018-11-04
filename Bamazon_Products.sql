CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INTEGER AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(30) NOT NULL,
    department_name VARCHAR(30) NOT NULL,
	price FLOAT(200,2) NOT NULL,
    stock_quantity INTEGER NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("Chalk", "Lifting", 10, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("Shorts", "Clothing", 20, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("Wrist Wraps", "Lifting", 20, 10);


UPDATE products
SET department_name = "Outdoors"
WHERE item_id = 5;


SELECT * FROM products;