document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.category-buttons button');
    const filmItems = document.querySelectorAll('.film-item');
    const filmContainer = document.getElementById('valitit'); // Updated to match the new id

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');

            filmItems.forEach(item => {
                const itemCategories = item.getAttribute('data-category').split(', ');

                if (category === 'All' || itemCategories.includes(category)) {
                    item.classList.add('show');
                } else {
                    item.classList.remove('show');
                }
            });

        });
    });

    // Show all movies by default when the page loads
    document.querySelector('.category-buttons button[data-category="All"]').click();

    // Add event listener for checkbox changes
    document.querySelectorAll('.film-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            // Clear current content
            filmContainer.innerHTML = '';

            // Get all checked checkboxes
            const checkedBoxes = document.querySelectorAll('.film-checkbox:checked');

            checkedBoxes.forEach(checkbox => {
                const film = JSON.parse(checkbox.value);
                const title = film.title;

                // Create a new element to display the film title
                const titleElement = document.createElement('p');
                titleElement.textContent = title;
                filmContainer.appendChild(titleElement);
            });
        });
    });
});
