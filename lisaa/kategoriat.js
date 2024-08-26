function loadCategory(category) {
    fetch(`/elokuvat/kategoria?name=${encodeURIComponent(category)}`)
        .then(response => response.json())
        .then(data => {
            const moviesSection = document.getElementById('moviesSection');
            moviesSection.innerHTML = '';
            if (data.length > 0) {
                data.forEach(movie => {
                    const movieDiv = document.createElement('div');
                    movieDiv.className = 'movie';
                    movieDiv.innerHTML = `<h3>${movie.title}</h3><p>Categories: ${movie.categories}</p>`;
                    moviesSection.appendChild(movieDiv);
                });
            } else {
                moviesSection.innerHTML = '<p>No movies found for this category.</p>';
            }
        })
        .catch(error => console.error('Error:', error));
}


loadCategory('New');