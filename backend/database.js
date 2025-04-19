const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./data/database.db');

// Запросы для изменения базы данных
db.serialize(() => {
    // db.run(`
    //     DROP TABLE products;
    // `);

    // db.run(`
    //     INSERT INTO products (name, supplier, price, deliveryTime) VALUES
    //         ('CubeSat PCB Frame Kit (PC104)', 'ISISpace', 250, 7),
    //         ('Solar Panel for CubeSat (GOMSpace NanoSol)', 'GOMSpace', 800, 4),
    //         ('DC-DC Converter (Vicor DCM3623T50)', 'DigiKey', 480, 5),
    //         ('Sun Sensor Module (ISIS Space)', 'ISISpace', 1400, 8),
    //         ('OBC Module with RTEMS OS (GOMX-3)', 'GOMSpace', 5000, 14),
    //         ('Star Tracker (ST-16 by NewSpace)', 'NewSpace Systems', 25000, 14),
    //         ('Reaction Wheel (Blue Canyon RWpico)', 'Blue Canyon Technologies', 7000, 14),
    //         ('Magnetorquer (CubeSpace MTQ 3-Axis)', 'CubeSpace', 2500, 7),
    //         ('Kapton Thermal Blanket (DuPont)', 'DuPont', 80, 2),
    //         ('Mini Radiator Plate (Aluminum, Honeycomb)', 'Wellste', 300, 2),
    //         ('Vibration Isolator Mount (Sorbothane 30D)', 'Sorbothane', 14, 1);
    // `);

    // db.run(`
    //     UPDATE products
    //     SET price = 5000
    //     WHERE name IN ('IPhone 16');
    // `)
});