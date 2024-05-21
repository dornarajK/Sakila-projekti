const express = require('express');
const app = express();
const path = require('path');
const { port, host } = require('./config.json');
const fs = require('fs');
const connection = require('./db');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/img', express.static('image'));    
app.use('/inc', express.static('includes'));


app.get('/', (req, res) => {
    // const query = 'SELECT title FROM film';
    const query = ' select title from film ';
   
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

app.get('/yhteistidot', (req, res) => {
    res.render('yhteistidot', {});
});

app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
