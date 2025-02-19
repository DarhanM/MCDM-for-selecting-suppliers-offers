const API_URL = 'http://localhost:3000';

const isRussian = document.documentElement.lang === 'ru';
const categoryNamesRu = {
    1: 'Качество',
    2: 'Цена',
    3: 'Опыт поставщика',
    4: 'Срок доставки',
}

const categoryNamesEn = {
    1: 'Quality',
    2: 'Price',
    3: 'Supplier Experience',
    4: 'Delivery Time',
}

async function fetchSubcategories(categoryId) {
    const response = await fetch(`${API_URL}/category/${categoryId}/subcategories`);
    if (!response.ok) throw new Error(isRussian ? 'Не удалось получить подкатегории' : 'Failed to fetch subcategories');
    return response.json();
}

function addSubcategory(name, weight, categoryId) {
    fetch(`${API_URL}/subcategory`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, weight, categoryId }),
    })
    .then(response => {
        if (!response.ok)
            throw new Error(isRussian ? 'Не удалось создать подкатегорию' : 'Failed to create subcategory');
        return response.json();
    })
    .then((result) => {
        alert(isRussian ? "Подкатегория успешно добавлена!" : "Subcategory added successfully!");
        console.log(result);
    })
    .catch(error => {
        console.error("Error:", error);
        alert(isRussian ? "Произошла ошибка при создании подкатегории." : "An error occurred while creating subcategory.");
    });
}

async function updateSubcategory(subcategoryId) {
    const weight = document.getElementById(`weight-${subcategoryId}`).value;
    fetch(`${API_URL}/subcategory/${subcategoryId}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight }),
    })
    .then(response => {
        if (!response.ok)
            throw new Error(isRussian ? 'Не удалось обновить вес подкатегории!' : 'Failed to update subcategory weight!');
        return response.json();
    })
    .then((result) => {
        alert(isRussian ? "Подкатегория успешно обновлена!" : "Subcategory updated successfully!");
        console.log(result);
    })
    .catch(error => {
        console.error("Error:", error);
        alert(isRussian ? "Произошла ошибка при обновлении подкатегории." : "An error occurred while updating subcategory.");
    });
}

async function deleteSubcategory(subcategoryId) {
    fetch(`${API_URL}/subcategory/${subcategoryId}`, {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => {
        if (!response.ok)
            throw new Error(isRussian ? 'Не удалось удалить подкатегорию!' : 'Failed to delete subcategory!');
        return response.json();
    })
    .then((result) => {
        alert(isRussian ? "Подкатегория успешно удалена!" : "Subcategory deleted successfully!");
        console.log(result);
    })
    .catch(error => {
        console.error("Error:", error);
        alert(isRussian ? "Произошла ошибка при удалении подкатегории." : "An error occurred while deleting subcategory.");
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('categoryId');

    const categoryName = isRussian ? categoryNamesRu[categoryId] : categoryNamesEn[categoryId];
    
    document.getElementById('category-name').textContent = categoryName;

    const subcategoryForm = document.getElementById('add-subcategory-form');
    const subcategoryTable = document.getElementById('subcategory-table').getElementsByTagName('tbody')[0];

    subcategoryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const subcategoryName = document.getElementById('subcategory-name').value;
        const subcategoryWeight = document.getElementById('subcategory-weight').value;

        if (subcategoryName && subcategoryWeight) {
            addSubcategory(subcategoryName, subcategoryWeight, categoryId);
            renderSubcategories();
        }
    });

    async function renderSubcategories() {
        const subcategories = await fetchSubcategories(categoryId);
        subcategoryTable.innerHTML = '';
        subcategories.forEach((subcategory) => {
            const row = subcategoryTable.insertRow();
            row.innerHTML = `
                <td>${subcategory.name}</td>
                <td><input type="number" id="weight-${subcategory.id}" value="${subcategory.weight}" step="1" min="0" max="100"></td>
                <td>
                    <button onclick="updateSubcategory(${subcategory.id})">${isRussian ? 'Обновить' : 'Update'}</button>
                    <button onclick="deleteSubcategory(${subcategory.id})">${isRussian ? 'Удалить' : 'Delete'}</button>
                </td>
            `;
        });
    }

    renderSubcategories();
});
