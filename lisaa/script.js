let offset = 0;
const limit = 3;
const selectedFilms = new Set(); // Käytetään Setiä valittujen elokuvien seurantaan

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
                const  span= document.createElement('span');
                cell.className = 'center-text';

            // Create checkbox

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = JSON.stringify({ id: film.film_id, title: film.title });
                checkbox.name = 'selectedFilms';
                span.className = 'spann';
                checkbox.className = 'film-checkbox';

                checkbox.id = `checkbox-${film.film_id}`

                // Create label
              


                const label = document.createElement('label');
                label.className = 'film-lable';
                label.htmlFor = checkbox.id;

                span.textContent = `Add`; 
            

                label.textContent = `${film.title}`; 
               
                cell.appendChild(checkbox);
                cell.appendChild(label);
                cell.appendChild(span);
                row.appendChild(cell);

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

                // const filmName = document.createElement('div');
                const actor = document.createElement('div');

                actor.className = "actors";
                actor.textContent = `Actor Names: ${film.actor_names}`;

                cell.appendChild(checkbox);
              
                cell.appendChild(actor);

                row.appendChild(cell);
                table.appendChild(row);
            });

            updatePagination(data);
        })
        .catch(error => console.error('Elokuvien lataamisessa tapahtui virhe:', error));
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

    // Päivitetään myös piilotetut input-kentät valittujen elokuvien lähettämistä varten
    selectedFilmsDiv.querySelectorAll('input').forEach(input => input.remove());
    selectedFilms.forEach(film => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'selectedFilms';
        input.value = film;
        selectedFilmsDiv.appendChild(input);
    });
}

function updatePagination(data) {
    const nextButton = document.getElementById('next');
    const prevButton = document.getElementById('prev');

    prevButton.style.display = offset === 0 ? 'none' : 'block';
    nextButton.style.display = data.length < limit ? 'none' : 'block';
}
