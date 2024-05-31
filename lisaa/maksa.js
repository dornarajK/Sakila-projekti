function maksa() {
    fetch('/osta-check')
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                alert("Valitse elokuvia ennen maksamista.");
                window.location.href = "/";
            } else {
                var selectedFilms = data.map(film => film.title).join("\n");
                alert("Kiitos ja nauti elokuvista:\n" + selectedFilms);
            
            }
        })
        .catch(error => {
            console.error('Error checking kauppa.json:', error);
            alert("Tapahtui virhe. Yritä uudelleen myöhemmin.");
        });
}
