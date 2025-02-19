const API_URL = 'http://localhost:3000';

// Определяем язык страницы
const lang = document.documentElement.lang === 'ru' ? 'ru' : 'en';

const translations = {
    en: {
        failedFetchProduct: 'Failed to fetch product details',
        failedFetchSubcategories: 'Failed to fetch subcategories',
        failedSaveChanges: 'Failed to save changes',
        changesSaved: 'Changes saved successfully!',
        invalidProductId: 'Invalid product ID',
        invalidCategoryId: 'Invalid category ID',
        detailsFor: 'Details for',
        supplierExperience: 'Supplier experience of'
    },
    ru: {
        failedFetchProduct: 'Не удалось получить информацию о продукте',
        failedFetchSubcategories: 'Не удалось получить подкатегории',
        failedSaveChanges: 'Не удалось сохранить изменения',
        changesSaved: 'Изменения успешно сохранены!',
        invalidProductId: 'Некорректный идентификатор продукта',
        invalidCategoryId: 'Некорректный идентификатор категории',
        detailsFor: 'Детали для',
        supplierExperience: 'Опыт поставщика'
    }
};

async function fetchProductDetails(productId) {
    const response = await fetch(`${API_URL}/products/${productId}`);
    if (!response.ok) throw new Error(translations[lang].failedFetchProduct);
    return response.json();
}

async function fetchSubcategoriesOfProduct(productId) {
    const response = await fetch(`${API_URL}/product/${productId}/subcategories`);
    if (!response.ok) throw new Error(translations[lang].failedFetchSubcategories);
    return response.json();
}

async function fetchSubcategories() {
    const response = await fetch(`${API_URL}/subcategories`);
    if (!response.ok) throw new Error(translations[lang].failedFetchSubcategories);
    return response.json();
}

function renderSubcategories(product, subcategories, applies, categoryId) {
    const container = document.getElementById('subcategory-container');
    container.innerHTML = '';
    subcategories.forEach((subcategory) => {
        if (subcategory.categoryId != categoryId || subcategory.weight == 0) 
            return;
        
        const subDiv = document.createElement('div');
        subDiv.className = 'subcategory-item';
        subDiv.style.display = 'flex';

        const label = document.createElement('label');
        label.textContent = `${subcategory.name}: ${subcategory.weight}`;

        const toggle = document.createElement('input');
        toggle.type = 'checkbox';
        toggle.checked = applies.some((apply) => apply.subcategoryId === subcategory.id);
        toggle.dataset.subcategoryId = subcategory.id;

        subDiv.appendChild(label);
        subDiv.appendChild(toggle);
        container.appendChild(subDiv);
    });
}

async function saveChanges(productId) {
    const toggles = document.querySelectorAll('#subcategory-container input[type="checkbox"]');
    try {
        for (const toggle of toggles) {
            const subcategoryId = toggle.dataset.subcategoryId;
            const applies = toggle.checked;
            
            const response = await fetch(`${API_URL}/product/${productId}/subcategory/${subcategoryId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applies })
            });
            if (!response.ok) throw new Error(translations[lang].failedSaveChanges);
        }
        alert(translations[lang].changesSaved);
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

async function loadProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('productId');
    const categoryId = params.get('categoryId');
    if (!productId) {
        alert(translations[lang].invalidProductId);
        return;
    }
    if (!categoryId) {
        alert(translations[lang].invalidCategoryId);
        return;
    }

    try {
        const [product, subcategories, applies] = await Promise.all([
            fetchProductDetails(productId),
            fetchSubcategories(),
            fetchSubcategoriesOfProduct(productId)
        ]);

        if (categoryId == 1) {
            document.getElementById('product-name').textContent = `${translations[lang].detailsFor} ${product.name}`;
        } else if (categoryId == 3) {
            document.getElementById('product-name').textContent = `${translations[lang].supplierExperience} ${product.supplier}`;
        }
        
        renderSubcategories(product, subcategories, applies, categoryId);

        document.getElementById('save-button').onclick = () => saveChanges(productId);
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

document.addEventListener('DOMContentLoaded', loadProductDetails);
