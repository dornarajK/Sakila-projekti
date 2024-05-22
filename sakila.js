const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser'); // Add this line to use body-parser
const { port, host } = require('./config.json');
const connection = require('./db');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true })); // Add this line to parse form data
app.use('/img', express.static('image'));    
app.use('/inc', express.static('includes'));
app.use('/lisaa', express.static('lisaa'));

app.get('/', (req, res) => {
    const query = 'SELECT title FROM film ORDER BY film_id LIMIT 3';
   
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Server error');
            return;
        }
        res.render('index', { data: results });
    });
});

app.get('/load-more', (req, res) => {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 3;
    const query = 'SELECT title FROM film ORDER BY film_id LIMIT ?, ?';

    connection.query(query, [offset, limit], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});

app.post('/lisaaa', (req, res) => {
    const etsi = req.body.merkki;
    const query = 'SELECT * FROM film WHERE title LIKE ?';
    
    connection.query(query, [`%${etsi}%`], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Server error');
            return;
        }

        res.render('hakutulos', {
            autot: results,
            lukumaara: results.length,
            nimi: etsi
        });
      
    });
});

app.get('/yhteistidot', (req, res) => {
    res.render('yhteistidot', {});
});

app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
