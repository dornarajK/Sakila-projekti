let offset = 0;
const limit = 3;
let selectedFilms = new Set(); 

document.addEventListener('DOMContentLoaded', () => {
    loadFilms();
});

function loadFilms() {
    fetch(`/load-more?offset=${offset}&limit=${limit}`)
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('film-table');
            table.innerHTML = '';

            data.forEach(film => {
                const row = document.createElement('tr');
                const cell = document.createElement('td');
                cell.className = 'center-text';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = JSON.stringify({ id: film.film_id, title: film.title });
                checkbox.name = 'selectedFilms';
                checkbox.className = 'film-checkbox';
                

                if (selectedFilms.has(checkbox.value)) {
                    checkbox.checked = true;
                }

                checkbox.addEventListener('change', () => {
                    if (checkbox.checked) {
                        selectedFilms.add(checkbox.value);
                    } else {
                        selectedFilms.delete(checkbox.value);
                    }
                    updateSelectedFilms();
                });

                const filmName = document.createElement('span');
                filmName.textContent = film.title;
                cell.appendChild(checkbox);
                cell.appendChild(filmName);

                row.appendChild(cell);
                table.appendChild(row);
            });

            updateSelectedFilms();

            const nextButton = document.getElementById('next');
            const prevButton = document.getElementById('prev');

            prevButton.style.display = offset === 0 ? 'none' : 'block';
            nextButton.style.display = data.length < limit ? 'none' : 'block';
        })
        .catch(error => console.error('Error loading films:', error));
}

function loadNext() {
    offset += limit;
    loadFilms();
}

function loadPrev() {
    offset = Math.max(0, offset - limit);
    loadFilms();
}

function updateSelectedFilms() {
    const selectedFilmsDiv = document.getElementById('selectedFilms');
    selectedFilmsDiv.innerHTML = '';

    selectedFilms.forEach(film => {
        const filmObj = JSON.parse(film);
        const listItem = document.createElement('div');
        listItem.textContent = filmObj.title;
        selectedFilmsDiv.appendChild(listItem);
    });

   
    selectedFilmsDiv.querySelectorAll('input').forEach(input => input.remove());
    selectedFilms.forEach(film => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'selectedFilms';
        input.value = film;
        selectedFilmsDiv.appendChild(input);
    });
}
