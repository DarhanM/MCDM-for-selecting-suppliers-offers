// Библиотека
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Подключение к базе данных
const db = new sqlite3.Database('./data/database.db');

// Создание таблиц в базе данных
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            supplier TEXT NOT NULL,
            price INTEGER NOT NULL,
            deliveryTime INTEGER NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS subcategories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            weight INTEGER,
            categoryId INTEGER NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS product_details (
            productId INTEGER NOT NULL,
            subcategoryId INTEGER NOT NULL,
            applies BOOLEAN NOT NULL,
            PRIMARY KEY (productId, subcategoryId),
            FOREIGN KEY (productId) REFERENCES products(id),
            FOREIGN KEY (subcategoryId) REFERENCES subcategories(id)
        )
    `);
});

// АПИ для получения всех товаров
app.get('/products', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// АПИ для получения товара по его id
app.get('/products/:id', (req, res) => {
    const { id } = req.params;

    try {
        db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(row);
        });
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// АПИ для получения товаров по фильтру (по названию)
app.get('/product/filter', (req, res) => {
    const { name } = req.query;
    db.all(
        'SELECT * FROM products WHERE name LIKE ?',
        [`%${name}%`],
        (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        }
    );
});

// АПИ для получения характеристик товара
app.get('/product/:id/subcategories', (req, res) => {
    const { id } = req.params;
    db.all(
        `SELECT ps.subcategoryId, ps.applies, s.name, s.weight, s.categoryId
         FROM product_details ps
         JOIN subcategories s ON ps.subcategoryId = s.id
         WHERE ps.productId = ? AND ps.applies = true`,
        [id],
        (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        }
    );
});

// Для обновления наличия характеристики у товара
app.post('/product/:id/subcategory/:subcategoryId', (req, res) => {
    const { id, subcategoryId } = req.params;
    const { applies } = req.body;

    db.run(
        `INSERT INTO product_details (productId, subcategoryId, applies) 
         VALUES (?, ?, ?)
         ON CONFLICT(productId, subcategoryId) 
         DO UPDATE SET applies = ?`,
        [id, subcategoryId, applies, applies],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Updated successfully' });
        }
    );
});

// АПИ для получения характеристики категории
app.get('/categories/:categoryId/subcategories', (req, res) => {
    const { categoryId } = req.params;

    db.all(
        `SELECT id AS subcategoryId, name AS subcategoryName 
         FROM subcategories 
         WHERE categoryId = ?`,
        [categoryId],
        (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        }
    );
});

app.get('/category/:categoryId/subcategories', (req, res) => {
    const { categoryId } = req.params;
    db.all('SELECT id, name, weight FROM subcategories WHERE categoryId = ?',
        [categoryId],
        (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        }
    )
})

// АПИ для получения всех характеристик
app.get('/subcategories', (req, res) => {
    db.all('SELECT * FROM subcategories', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// АПИ для создания характеристики
app.post('/subcategory', (req, res) => {
    const { name, weight, categoryId } = req.body;
    
    db.run(`INSERT INTO subcategories (name, weight, categoryId)
        VALUES (?, ?, ?)`,
        [name, weight, categoryId],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Created successfully' });
        }
    )
})

// АПИ для изменения характеристики
app.put('/subcategory/:subcategoryId', (req, res) => {
    const { subcategoryId } = req.params;
    const { weight } = req.body;

    db.run('UPDATE subcategories SET weight = ? WHERE id = ?',
        [weight, subcategoryId],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Updated successfully' });
        }
    )
})

// АПИ для удаления характеристики
app.delete('/subcategory/:subcategoryId', (req, res) => {
    const { subcategoryId } = req.params;

    db.run('DELETE FROM subcategories WHERE id = ?',
        [subcategoryId],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Deleted successfully' });
        }
    )
})

app.post('/product', (req, res) => {
    const {name, supplier, price, deliveryTime} = req.body;
    console.log(name, supplier, price, deliveryTime);

    db.run(`INSERT INTO products (name, supplier, price, deliveryTime)
        VALUES (?, ?, ?, ?)`,
        [name, supplier, price, deliveryTime],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message })
                return;
            }
            res.json({ message: 'Created successfully'} )
        }
    )
})

app.delete('/product/:id', (req, res) => {
    const {id} = req.params;

    db.run(`DELETE FROM products WHERE id = ?`,
        [id],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Deleted successfully' });
        }
    )
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
