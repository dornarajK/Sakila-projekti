const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const { port, host } = require('./config.json');
const connection = require('./db');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/img', express.static('image'));
app.use('/inc', express.static('includes'));
app.use('/lisaa', express.static('lisaa'));

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get('/', (req, res) => {
    const query = 'SELECT film_id, title FROM film ORDER BY film_id LIMIT 3';


    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Server error');
            return;
        }
        res.render('index', { 
            data: results
        });
    });
});

app.post('/lisaa', (req, res) => {
    const searchTerm = req.body.merkki;
    const query = 'SELECT * FROM film WHERE title LIKE ?';
    const searchValue = `%${searchTerm}%`;

    connection.query(query, [searchValue], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Server error');
            return;
        }

        res.render('hakutulos', {
            lukumaara: results.length,
            nimi: searchTerm,
            autot: results
        });
    });
});
app.get('/load-more', (req, res) => {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 3;
    const query = `
    SELECT f.film_id, f.title, 
    SUBSTRING_INDEX(GROUP_CONCAT(CONCAT(a.first_name, ' ', a.last_name) ORDER BY a.actor_id SEPARATOR ', '), ', ', 2) AS actor_names
    FROM film f
    JOIN film_actor fa ON f.film_id = fa.film_id
    JOIN actor a ON fa.actor_id = a.actor_id
    GROUP BY f.film_id
    ORDER BY f.film_id
    LIMIT ?, ?`;
    
    connection.query(query, [offset, limit], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});


// app.get('/load-more', (req, res) => {
//     const offset = parseInt(req.query.offset) || 0;
//     const limit = parseInt(req.query.limit) || 3;
//     const query = 'SELECT film_id, title FROM film ORDER BY film_id LIMIT ?, ?';

//     connection.query(query, [offset, limit], (err, results) => {
//         if (err) {
//             console.error('Error executing query:', err);
//             res.status(500).send('Server error');
//             return;
//         }
//         res.json(results);
//     });
// });


const generateUniqueId = (kauppaData) => {
    let newId;
    do {
        newId = Math.floor(Math.random() * 1000000).toString(); 
    } while (kauppaData.some(film => film.id === newId));
    return newId;
};

app.post('/osta', (req, res) => {
    const selectedFilms = req.body.selectedFilms;

    if (!selectedFilms || selectedFilms.length === 0) {
        res.status(400).send('<script>alert("Lisää elokuva"); window.location.href = "/";</script>');
        return;
    }

    const films = Array.isArray(selectedFilms) ? selectedFilms.map(film => JSON.parse(film)) : [JSON.parse(selectedFilms)];

    const filePath = path.join(__dirname, 'data', 'kauppa.json');

    fs.readFile(filePath, (err, data) => {
        let kauppaData = [];
        if (err && err.code === 'ENOENT') {
            console.log('File not found, initializing new file.');
        } else if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Server error');
            return;
        } else {
            try {
                kauppaData = JSON.parse(data);
            } catch (err) {
                console.error('Error parsing JSON:', err);
                res.status(500).send('Server error');
                return;
            }
        }

        films.forEach(film => {
            if (!kauppaData.some(f => f.id === film.id)) {
                film.id = generateUniqueId(kauppaData);
                kauppaData.push(film);
            }
        });

        fs.writeFile(filePath, JSON.stringify(kauppaData, null, 2), err => {
            if (err) {
                console.error('Error writing file:', err);
                res.status(500).send('Server error');
                return;
            }

            res.redirect('/osta');
        });
    });
});

app.get('/osta', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'kauppa.json');

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Server error');
            return;
        }

        let kauppaData;
        try {
            kauppaData = JSON.parse(data);
        } catch (err) {
            console.error('Error parsing JSON:', err);
            res.status(500).send('Server error');
            return;
        }

        res.render('osta', { selectedFilms: kauppaData });
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
//!
app.post('/poista', (req, res) => {
    const filmIdToRemove = req.body.filmId;

    const filePath = path.join(__dirname, 'data', 'kauppa.json');

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Server error');
            return;
        }

        let kauppaData;
        try {
            kauppaData = JSON.parse(data);
        } catch (err) {
            console.error('Error parsing JSON:', err);
            res.status(500).send('Server error');
            return;
        }

        kauppaData = kauppaData.filter(film => film && film.id && film.id.toString() !== filmIdToRemove);

        fs.writeFile(filePath, JSON.stringify(kauppaData, null, 2), err => {
            if (err) {
                console.error('Error writing file:', err);
                res.status(500).send('Server error');
                return;
            }

            res.redirect('/osta');
        });
    });
});


app.get('/osta-check', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'kauppa.json');

    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.json([]); 
            } else {
                console.error('Error reading file:', err);
                return res.status(500).json({ error: 'Server error' });
            }
        }

        let kauppaData;
        try {
            kauppaData = JSON.parse(data);
        } catch (err) {
            console.error('Error parsing JSON:', err);
            return res.status(500).json({ error: 'Server error' });
        }

        res.json(kauppaData);
    });
});

app.post('/lisaaKauppaan', (req, res) => {
    let film;
    try {
        film = JSON.parse(req.body.film);
    } catch (err) {
        console.error('Error parsing film data:', err);
        return res.status(400).send('Invalid film data');
    }

    const filePath = path.join(__dirname, 'data', 'kauppa.json');

    fs.readFile(filePath, (err, data) => {
        let kauppaData = [];
        if (err && err.code === 'ENOENT') {
            console.log('File not found, initializing new file.');
        } else if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Server error');
            return;
        } else {
            try {
                kauppaData = JSON.parse(data);
            } catch (err) {
                console.error('Error parsing JSON:', err);
                res.status(500).send('Server error');
                return;
            }
        }

        if (!kauppaData.some(f => f.id === film.id)) {
            film.id = generateUniqueId(kauppaData); 
            kauppaData.push(film);
        }

        fs.writeFile(filePath, JSON.stringify(kauppaData, null, 2), err => {
            if (err) {
                console.error('Error writing file:', err);
                res.status(500).send('Server error');
                return;
            }

            res.redirect('/osta');
        });
    });
});

app.get('/yhteistidot', (req, res) => {
    res.render('yhteistidot');
});

app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
