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
            table.innerHTML = '';

            data.forEach(film => {
                const row = document.createElement('tr');
                const cell = document.createElement('td');
                cell.className = 'center-text';
                cell.textContent = film.title;
                row.appendChild(cell);
                table.appendChild(row);
            });

        //? napin esintuminen 
            const nextButton = document.getElementById('next');
            const prevButton = document.getElementById('prev');
            
            if (offset === 0) {
                prevButton.style.display = 'none';
            } else {
                prevButton.style.display = 'block'; 
            }
            
            if (data.length < limit) {
                nextButton.style.display = 'none'; 
            } else {
                nextButton.style.display = 'block'; 
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
