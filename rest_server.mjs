import * as path from 'node:path';
import * as url from 'node:url';

import { default as express } from 'express';
import { default as sqlite3 } from 'sqlite3';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const db_filename = path.join(__dirname, 'db', 'stpaul_crime.sqlite3');

const port = 8000;


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
    console.log(req.query); // query object (key-value pairs after the ? in the url)

    const query = 'SELECT code, incident_type as type FROM Codes ORDER BY code';
    const codes = [];
    dbSelect(query, codes)

    .then ((rows) => {
        res.status(200).type('json').json(rows);
    })
    .catch((error) => {
        res.status(500).type('txt').send(error);
    })
});

// GET request handler for neighborhoods
app.get('/neighborhoods', (req, res) => {
    console.log(req.query); // query object (key-value pairs after the ? in the url)

    const query = 'SELECT neighborhood_number as id, neighborhood_name as name FROM Neighborhoods ORDER BY id';
    const neighborhoods = [];

    dbSelect(query, neighborhoods)
    .then ((rows) => {
        res.status(200).type('json').json(rows);
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Internal Server Error');
    })
});

// GET request handler for crime incidents
app.get('/incidents', (req, res) => {
    console.log(req.query); // query object (key-value pairs after the ? in the url)
    
    const query = 'SELECT case_number, strftime("%Y-%m-%d", date_time) as date, strftime("%H:%M:%S", date_time) as time, code, incident, police_grid, neighborhood_number, block FROM Incidents ORDER BY date_time DESC LIMIT 1000';

    dbSelect(query)
    .then ((rows) => {
        res.status(200).type('json').json(rows);
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Internal Server Error');
    })
});

// PUT request handler for new crime incident
app.put('/new-incident', (req, res) => {
    console.log(req.body); // uploaded data

    const { case_number, date, time, code, incident, police_grid, neighborhood_number, block } = req.body;

    const checkQuery = 'SELECT * FROM Incidents WHERE case_number = ?';
    
    dbSelect(checkQuery, [case_number])
    .then((checkResult) => {
        if (checkResult.length > 0) {
            res.status(500).send('Case number already exists in the database');
        } else {
            const insertQuery = 'INSERT INTO Incidents (case_number, date_time, code, incident, police_grid, neighborhood_number, block) VALUES (?, ?, ?, ?, ?, ?, ?)';
            return dbRun(insertQuery, [case_number, `${date} ${time}`, code, incident, police_grid, neighborhood_number, block]);
        }
    })
    .then(() => {
        res.status(200).send('OK');
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Internal Server Error');
    });
});

// DELETE request handler for new crime incident
app.delete('/remove-incident', (req, res) => {
    console.log(req.body); // uploaded data

    const { case_number } = req.body;

    const checkQuery = 'SELECT * FROM Incidents WHERE case_number = ?';
    dbSelect(checkQuery, [case_number])
    .then((checkResult) => {
        if (checkResult.length === 0) {
            res.status(500).send('Case number does not exist in the database');
        } else {
            const deleteQuery = 'DELETE FROM Incidents WHERE case_number = ?';
            return dbRun(deleteQuery, [case_number]);
        }
    })
    .then(() => {
        res.status(200).send('OK');
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Internal Server Error');
    });
});

/********************************************************************
 ***   START SERVER                                               *** 
 ********************************************************************/
// Start server - listen for client connections
app.listen(port, () => {
    console.log('Now listening on port ' + port);
});
