const API_URL = 'http://localhost:3000';

// Узнать текущий язык сайта
const lang = document.documentElement.lang || 'en';

// Локализация по языкам
const translations = {
    en: {
        fetchError: 'Failed to fetch',
        alertWeight: 'The total weight must equal 100%',
        bestProvider: 'Best provider is',
        withScore: 'with a score of',
        viewDetails: 'View Details',
        appProductFetchError: 'Failed to create new product',
        alertNewProductSuccess: 'Product added successfully!',
        alertNewProductFail: 'An error occurred while creating product',
    },
    ru: {
        fetchError: 'Не удалось получить данные',
        alertWeight: 'Общий вес должен быть равен 100%',
        bestProvider: 'Лучший поставщик',
        withScore: 'с оценкой',
        viewDetails: 'Подробнее',
        appProductFetchError: 'Не получилось создать новый товар',
        alertNewProductSuccess: 'Товар успешно добавлен!',
        alertNewProductFail: 'Произошла ошибка при создании товара',
    }
};

// Функции для обращения к серверу
async function fetchProducts(filter = '') {
    const response = await fetch(`${API_URL}/product${filter ? `/filter?name=${filter}` : 's'}`);
    if (!response.ok) throw new Error(`${translations[lang].fetchError} products`);
    return response.json();
}

async function fetchSubcategories() {
    const response = await fetch(`${API_URL}/subcategories`);
    if (!response.ok) throw new Error(`${translations[lang].fetchError} subcategories`);
    return response.json();
}

async function fetchSubcategoriesByCategory(categoryId) {
    const response = await fetch(`${API_URL}/categories/${categoryId}/subcategories`);
    if (!response.ok) throw new Error(`${translations[lang].fetchError} subcategories by category`);
    return response.json();
}

async function fetchProductSubcategories(productId) {
    const response = await fetch(`${API_URL}/product/${productId}/subcategories`);
    if (!response.ok) throw new Error(`${translations[lang].fetchError} subcategories by product`);
    return response.json();
}

// Функции для изменения сайта
// Для вставления товаров в таблицу
async function displayProducts(filter = '') {
    const products = await fetchProducts(filter);
    const tbody = document.querySelector('#products-table tbody');
    tbody.innerHTML = '';
    products.forEach((product) => {
        let row;
        if (lang == 'en') {
            row = `<tr>
                <td>${product.name}</td>
                <td>${product.supplier}</td>
                <td>${product.price}</td>
                <td>${product.deliveryTime}</td>
                <td><button onclick="window.location.href='product_details.html?productId=${product.id}&categoryId=1'">${translations[lang].viewDetails}</button></td>
                <td><button onclick="window.location.href='product_details.html?productId=${product.id}&categoryId=3'">${translations[lang].viewDetails}</button></td>
            </tr>`;
        } else if (lang == 'ru') {
            row = `<tr>
                <td>${product.name}</td>
                <td>${product.supplier}</td>
                <td>${product.price}</td>
                <td>${product.deliveryTime}</td>
                <td><button onclick="window.location.href='product_details_ru.html?productId=${product.id}&categoryId=1'">${translations[lang].viewDetails}</button></td>
                <td><button onclick="window.location.href='product_details_ru.html?productId=${product.id}&categoryId=3'">${translations[lang].viewDetails}</button></td>
            </tr>`;
        }
        tbody.innerHTML += row;
    });
}

// Посчитать лучший товар
async function calculateBest() {
    const categorySums = {};
    const percents = {}

    const valueQuality = parseInt(document.getElementById("weight-quality").value);
    const valuePrice = parseInt(document.getElementById("weight-price").value);
    const valueSupplierExperience = parseInt(document.getElementById("weight-supplier-experience").value);
    const valueDeliveryTime = parseInt(document.getElementById("weight-delivery-time").value);

    if (valueQuality + valuePrice + valueSupplierExperience + valueDeliveryTime !== 100) {
        // console.log(valueQuality + valuePrice + valueSupplierExperience + valueDeliveryTime);
        alert(translations[lang].alertWeight);
        return;
    }

    // Перевод всех процентов в коэффиценты
    categorySums[1] = 0;
    categorySums[3] = 0;
    percents[1] = valueQuality / 100;
    percents[2] = valuePrice / 100;
    percents[3] = valueSupplierExperience / 100;
    percents[4] = valueDeliveryTime / 100;

    // Для каждой подкатегории добавляется её вес
    const subcategories = await fetchSubcategories();
    subcategories.forEach((subcategory) => {
        categorySums[subcategory.categoryId] += subcategory.weight;
    });

    // список товаров соответствующих фильтру
    const filter = document.getElementById('filter-name').value;
    const products = await fetchProducts(filter);
    
    // минимальные значения стоимости и срока поставки
    const minPrice = products.map((product) => product.price).reduce((a, b) => Math.min(a, b));
    const minDeliveryTime = products.map((product) => product.deliveryTime).reduce((a, b) => Math.min(a, b));

    // подсчет поставщика победителя и его результат
    (async function calculateBestProduct() {
        const best = {
            bestProvider: '',
            bestValue: -1,
        }

        const productPromises = products.map(async (product) => {
            const appliedSubcategories = await fetchProductSubcategories(product.id);

            let sum1 = 0;
            let sum3 = 0;
            appliedSubcategories.forEach((subcategory) => {
                if (subcategory.categoryId === 1)
                    sum1 += subcategory.weight;
                if (subcategory.categoryId === 3)
                    sum3 += subcategory.weight;
            });

            let result = 0;
            if (categorySums[1] !== 0)
                result += (sum1 / categorySums[1]) * 100 * percents[1];

            if (categorySums[3] !== 0)
                result += (sum3 / categorySums[3]) * 100 * percents[3];

            result += (minPrice / product.price) * 100 * percents[2];
            result += (minDeliveryTime / product.deliveryTime) * 100 * percents[4];

            if (result > best.bestValue) {
                best.bestProvider = product.name;
                best.bestValue = result;
            }
        });

        await Promise.all(productPromises);

        if (document)
            document.getElementById('result').innerText = `${translations[lang].bestProvider} ${best.bestProvider} ${translations[lang].withScore} ${best.bestValue.toFixed(2)}.`;
    })();

}

async function filterProducts() {
    const filter = document.getElementById('filter-name').value;
    displayProducts(filter);
}

async function addNewProduct() {
    const name = document.getElementById('product-name').value;
    const supplier = document.getElementById('product-supplier').value;
    const price = document.getElementById('product-price').value;
    const deliveryTime = document.getElementById('product-delivery-time').value;

    fetch(`${API_URL}/product`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, supplier, price, deliveryTime }),
    })
    .then(response => {
        if (!response.ok)
            throw new Error(translations[lang].appProductFetchError)
        return response.json()
    })
    .then(result => {
        alert(translations[lang].alertNewProductSuccess)
    })
    .catch(error => {
        console.error("Error: " + error)
        alert(translations[lang].alertNewProductFail)
    })
}

// Загрузка товаров при загрузке страницы
displayProducts(document.getElementById('filter-name').value);
