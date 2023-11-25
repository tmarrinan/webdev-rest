//curl -X PUT "http://localhost:8000/new-incident" -H "Content-Type: application/json" -d "{\"case_number\": 1234, \"date\": \"2023-11-13\", \"incident\": \"student mischieft\"}"

import * as path from 'node:path';
import * as url from 'node:url';

import { default as express } from 'express';
import { default as sqlite3 } from 'sqlite3';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const db_filename = path.join(__dirname, 'db', 'stpaul_crime.sqlite3');

const port = 9000;

let app = express();
app.use(express.json());

/********************************************************************
 ***   DATABASE FUNCTIONS                                         ***
 ********************************************************************/
// Open SQLite3 database (in read-write mode)
let db = new sqlite3.Database(db_filename, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.log('Error opening ' + path.basename(db_filename));
    }
    else {
        console.log('Now connected to ' + path.basename(db_filename));
    }
});

// Create Promise for SQLite3 database SELECT query
function dbSelect(query, params) {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        });
    });
}

// Create Promise for SQLite3 database INSERT or DELETE query
function dbRun(query, params) {
    return new Promise((resolve, reject) => {
        db.run(query, params, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}





/********************************************************************
 ***   REST REQUEST HANDLERS                                      ***
 ********************************************************************/
// GET request handler for crime codes
app.get('/codes', (req, res) => {
    console.log(req.query);

    let query = 'Select * FROM Codes ORDER BY CODE';
    let params = [];

    if(req.query.hasOwnProperty('code')){
        query += "WHERE code = ?";
    }



    query += " LIMIT 1000";
    dbSelect(query, params)
    .then((rows) => { //if dbSelect returns rows
        res.status(200).type('json').send(rows); //then it sends back a json of the rows
    })
    .catch((error) => { //if dbSelect returns an error
        res.status(500).type('txt').send(error); //then it sends back and text file error
    });
});






// GET request handler for neighborhoods
app.get('/neighborhoods', (req, res) => {
    console.log(req.query);

    let query = 'SELECT * FROM neighborhoods';
    let params = [];

    // Check if 'neighborhood' is present in the query parameters
    if (req.query.hasOwnProperty('id')) {
        query += ' WHERE id = ?';
        params.push(req.query.id);
    }
    query += " LIMIT 1000";
    dbSelect(query, params)
    .then((rows) => { //if dbSelect returns rows
        res.status(200).type('json').send(rows); //then it sends back a json of the rows
    })
    .catch((error) => { //if dbSelect returns an error
        res.status(500).type('txt').send(error); //then it sends back and text file error
    });
});



// GET request handler for crime incidents
app.get('/incidents', (req, res) => {
    console.log(req.query); // query object (key-value pairs after the ? in the URL)

    let query = 'SELECT * FROM incidents';
    let params = [];

    let count = 0;
    let limitCount = 0;

    if (req.query.hasOwnProperty('start_date')) {
        query += " WHERE date_time >= '?' ";
        params.push(req.query.date_time);
        count++;
    }

    if (req.query.hasOwnProperty('end_date')) {
        if (count > 0) {
            query += ' AND';
        } else {
            query += ' WHERE';
        }
        query += ' date_time <= ?';
        params.push(req.query.date_time);
        count++;
    }

    //BETWEEN {ts '2008-12-20 00:00:00'} AND {ts '2008-12-20 23:59:59'}

    if (req.query.hasOwnProperty('code')) {
        if (count > 0) {
            query += ' AND';
        } else {
            query += ' WHERE';
        }
        query += ' code = ?';
        params.push(req.query.code);
        count++;
    }

    if (req.query.hasOwnProperty('police_grid')) {
        if (count > 0) {
            query += ' AND';
        } else {
            query += ' WHERE';
        }
        query += ' police_grid = ?';
        params.push(req.query.police_grid);
        count++;
    }

    if (req.query.hasOwnProperty('neighborhood')) {
        if (count > 0) {
            query += ' AND';
        } else {
            query += ' WHERE';
        }
        query += ' neighborhood = ?';
        params.push(req.query.neighborhood);
        count++;
    }

    if (req.query.hasOwnProperty('limit')) {
        limitCount++;
        query += ' LIMIT ?';
        params.push(parseInt(req.query.limit));
    }

    query += " LIMIT 1000";
    dbSelect(query, params)
    .then((rows) => { //if dbSelect returns rows
        res.status(200).type('json').send(rows); //then it sends back a json of the rows
    })
    .catch((error) => { //if dbSelect returns an error
        res.status(500).type('txt').send(error); //then it sends back and text file error
    });

});







// PUT request handler for new crime incident
app.put('/new-incident', (req, res) => {
    console.log(req.body); // uploaded data
   
    res.status(200).type('txt').send('OK'); // <-- you may need to change this
});






// DELETE request handler for new crime incident
app.delete('/remove-incident/:id', async (req, res) => {
    const incidentId = req.params.id;

    if (!incidentId) {
        res.status(400).json({ error: 'Invalid or missing incident ID' });
        return;
    }

    try {
        // You can use your dbRun function to perform the DELETE operation
        const query = 'DELETE FROM incidents WHERE id = ?';
        await dbRun(query, incidentId);

        res.status(200).json({ message: 'Incident deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});






/********************************************************************
 ***   START SERVER                                               ***
 ********************************************************************/
// Start server - listen for client connections
app.listen(port, () => {
    console.log('Now listening on port ' + port);
});