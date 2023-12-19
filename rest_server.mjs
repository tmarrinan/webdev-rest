//curl -X PUT "http://localhost:8000/new-incident" -H "Content-Type: application/json" -d "{\"case_number\": 1234, \"date\": \"2023-11-13\", \"incident\": \"student mischieft\"}"

import * as path from 'node:path';
import * as url from 'node:url';
import cors from 'cors';

import { default as express, json } from 'express';
import { default as sqlite3 } from 'sqlite3';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const db_filename = path.join(__dirname, 'db', 'stpaul_crime.sqlite3');

const port = 8001;

let app = express();
app.use(express.json());
app.use(cors());

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
// GET request handler for crime codes (need to format output)
app.get('/codes', (req, res) => {
   
    let codeSelections = req.query;
    let query = 'Select * FROM Codes';
    let params = [];

    //If user entered in any values to filter query
    if (req.query.hasOwnProperty('code')) {
        codeSelections = req.query.code.replaceAll(',', ' OR code = ');
        query += ' WHERE code = '
        query += codeSelections;
    }

    query += ' ORDER BY code';
   
    //Select data from database
    dbSelect(query, params)
    .then((rows) =>{
        const formattedRows = rows.map(row => ({ code: row.code, type: row.incident_type }));
        res.status(200).json(formattedRows);
    })
    .catch((error) =>{
        res.status(500).type('txt').send(error);
    })
});





// GET request handler for Neighborhoods (need to format the output)
app.get('/neighborhoods', (req, res) => {

    let idSelections = req.query;
    let query = 'Select * FROM Neighborhoods';
    let params = [];

    if (req.query.hasOwnProperty('neighborhood_number')) {
        idSelections = req.query.neighborhood_number.replace(/,/g, ' OR neighborhood_number = ');
        query += ' WHERE neighborhood_number = ';
        query += idSelections;
    }

    query += ' ORDER BY neighborhood_number';

    dbSelect(query, params)
    .then((rows) =>{
        const formattedRows = rows.map(row => ({ id: row.neighborhood_number, name: row.neighborhood_name }));
        res.status(200).json(formattedRows);
    })
    .catch((error) =>{
        res.status(500).type('txt').send(error);
    })
});



// GET request handler for crime incidents
app.get('/incidents', (req, res) => {

    //base query with no filters (DONE)
    let query = 'SELECT * FROM incidents';

    //user params passed to dbSelect statement
    let params = [];

    //Set count to 0 (tracks multiple filters)
    let count = 0;

    //Set base limit (DONE)
    var limit = 1000;

    if(req.query.hasOwnProperty('code')){
        if(count > 0){query += " AND ";}
        else{query += " WHERE "};
        query += "code = " + req.query.code;
        count++;
    }

    if(req.query.hasOwnProperty('grid')){
        if(count > 0){query += " AND ";}
        else{query += " WHERE "};
        query += "police_grid = " + req.query.grid;
        count++;
    }

    if(req.query.hasOwnProperty('id')){
        if(count > 0){query += " AND ";}
        else{query += " WHERE "};
        query += "neighborhood_number = " + req.query.id;
        console.log(query);
        count++;
    }


    //Set limit to user amount or 1000 (DONE)
    if(req.query.hasOwnProperty('limit')){
        limit = req.query.limit;}
    query += " LIMIT " + limit;


    console.log(query);

    // Select from database and send as json
    dbSelect(query, params)
    .then((rows) => {
        res.status(200).type('json').send(rows);
    })
    .catch((error) => {
        res.status(500).type('txt').send(error);
    });
});







// PUT request handler for new crime incident
app.put('/new-incident/:case_number', (req, res) => {
    const case_number = req.params.case_number; 
    const { date_time, code, police_grid, neighborhood_number, block } = req.body;

    if (!date_time || !code || !police_grid || !neighborhood_number || !block) {
        res.status(400).json({ error: 'Missing required fields in the request body' });
        return;
    }

    const query = 'INSERT INTO incidents (case_number, date_time, code, police_grid, neighborhood_number, block) VALUES (?, ?, ?, ?, ?, ?)';
    const params = [case_number, date_time, code, police_grid, neighborhood_number, block];

    dbRun(query, params)
        .then(() => {
            res.status(200).json({ message: 'Incident added successfully' });
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
});
//curl -X PUT "http://localhost:8000/new-incident" -H "Content-Type: application/json" -d "{\"case_number\": 1234, \"date\": \"2023-11-13\", \"incident\": \"student mischieft\", \"police_grid\": 130, \"neighborhood_number\": 6, \"block\": \"2346 Random\"}"

//curl -X PUT "http://localhost:8000/new-incident/1234" -H "Content-Type: application/json" -d '{"date_time": "2023-01-01T00:00:00", "code": 500, "police_grid": 117, "neighborhood_number": 1, "block": "your_block"}'





// DELETE request handler for new crime incident
app.delete('/remove-incident', async (req, res) => {
    const caseNumber = req.body.case_number;

    if (!caseNumber) {
        return res.status(400).json({ error: 'Missing case_number in the request body' });
    }

    const query = 'DELETE FROM Incidents WHERE case_number = ?';
    const params = [caseNumber];

    try {
        await dbRun(query, params);
        console.log('Incident Removed successfully');
        res.status(200).json({ message: 'Incident Removed successfully' });
    } catch (error) {
        console.error('Error Removing incident:', error.message);
        res.status(500).json({ error: error.message });
    }
});
//"http://localhost:8000/Remove-incident?case_number=14174423"





/********************************************************************
 ***   START SERVER                                               ***
 ********************************************************************/
// Start server - listen for client connections
app.listen(port, () => {
    console.log('Now listening on port ' + port);
});
