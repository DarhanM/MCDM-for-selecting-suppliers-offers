const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./data/database.db');

// Запросы для изменения базы данных
db.serialize(() => {
    // db.run(`
    //     DROP TABLE products;
    // `);

    // db.run(`
    //     DROP TABLE product_subcategories;
    // `);

    // db.run(`
    //     INSERT INTO categories (name, percentage) VALUES
    //         ('Quality', 0),
    //         ('Price', 0),
    //         ('Supplier Experience', 0),
    //         ('Delivery Time', 0)
    // `);

    // db.run(`
    //     UPDATE categories
    //     SET percentage = 50
    //     WHERE name = 'Quality'
    // `)

    // db.run(`
    //     INSERT INTO products (name, supplier, price, deliveryTime) VALUES
    //         ('Phone (IPhone 16)', 'Apple', 2000, 4),
    //         ('Phone (Samsung S24)', 'Samsung', 1800, 2),
    //         ('Phone (Pixel 8)', 'Google', 800, 6),
    //         ('Phone (Galaxy Fold 5)', 'Samsung', 1600, 8),
    //         ('Laptop (MacBook Pro)', 'Apple', 3000, 10),
    //         ('Laptop (Dell XPS 15)', 'Dell', 2000, 8),
    //         ('Laptop (ThinkPad X1 Carbon)', 'Lenovo', 4000, 8),
    //         ('Tablet (iPad Pro)', 'Apple', 1600, 6),
    //         ('Tablet (Surface Pro 9)', 'Microsoft', 1000, 4),
    //         ('Phone (Asus ROG Phone 7)', 'Asus', 1000, 2),
    //         ('Phone (OnePlus 12)', 'OnePlus', 800, 2);
    // `);    

    // db.run(`
    //     INSERT INTO products (name, supplier, price, deliveryTime) VALUES
    //     ('Sony WH-CH720N Noise Canceling Wireless Headphones Bluetooth Over The Ear Headset with Microphone and Alexa Built-in, Black New', 'Sony', 1000, 5);
    // `)

    // db.run(`
    //     UPDATE products
    //     SET price = 5000
    //     WHERE name IN ('IPhone 16');
    // `)
});