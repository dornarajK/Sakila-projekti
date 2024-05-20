let offset = 0;
const limit = 3;

document.addEventListener('DOMContentLoaded', () => {
    loadFilms();
});

function loadFilms() {
    fetch(`/load-more?offset=${offset}&limit=${limit}`)
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('film-table');
            table.innerHTML = ''; // Clear the table

            data.forEach(film => {
                const row = document.createElement('tr');
                const cell = document.createElement('td');
                cell.className = 'center-text';
                cell.textContent = film.title;
                row.appendChild(cell);
                table.appendChild(row);
            });

            // Show/hide next/prev buttons based on offset
            const nextButton = document.getElementById('next');
            const prevButton = document.getElementById('prev');
            
            if (offset === 0) {
                prevButton.style.display = 'none'; // Hide prev button if offset is 0
            } else {
                prevButton.style.display = 'block'; // Show prev button if offset is not 0
            }
            
            if (data.length < limit) {
                nextButton.style.display = 'none'; // Hide next button if there are no more films to load
            } else {
                nextButton.style.display = 'block'; // Show next button if there are more films to load
            }
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
