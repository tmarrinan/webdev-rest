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
//EX: http://localhost:8000/codes?code=10,20,30
app.get('/codes', (req, res) => {
    console.log(req.query); // query object (key-value pairs after the ? in the url)

    let sql = 'SELECT code, incident_type as type FROM Codes';
    let params = [];

    if(req.query.hasOwnProperty('code')){
        let codes = req.query.code.split(',');
        sql += ' WHERE code = ?';
        params.push(parseInt(codes[0]));
        for(let i=1; i<codes.length; i++){
            sql += ' OR code = ?';
            params.push(parseInt(codes[i]));
        }
    }
    //Order from least to greatest
    sql += " ORDER BY code;"
    console.log(sql);
    console.log('PARAM: ', params);

    dbSelect(sql, params)
    .then(rows=>{
        console.log(rows);
        res.status(200).type('json').send(rows);
    }).catch((error)=>{
        res.status(404).type('json').send("An error, there is: "+error);
    });
});

//http://localhost:8000/api?mfr=p&type=c&sugar=%3E=12
// GET request handler for neighborhoods
app.get('/neighborhoods', (req, res) => {
    console.log(req.query); // query object (key-value pairs after the ? in the url)
    let sql = 'SELECT neighborhood_number as id, neighborhood_name as name FROM Neighborhoods';
    let params = [];
    if(req.query.hasOwnProperty('id')){
        let ids = req.query.id.split(',');
        sql += ' WHERE neighborhood_number = ?';
        params.push(parseInt(ids[0]));
        for(let i=1; i<ids.length; i++){
            sql += ' OR neighborhood_number = ?';
            params.push(parseInt(ids[i]));
        }
    }
    console.log(sql);
    console.log('PARAM: ', params);

    dbSelect(sql, params)
    .then(rows=>{
        res.status(200).type('json').send(rows);
    }).catch((error)=>{
        res.status(500).type('txt').send(error);
    });
    // res.status(200).type('json').send({}); // <-- you will need to change this
});

// GET request handler for crime incidents
app.get('/incidents', (req, res) => {
    console.log(req.query); // query object (key-value pairs after the ? in the url)
    let whereCount = 0;
    let colCount = 0;
    let col = '';
    let where = '';
    let limit = 1000;
    let params = [];
    if(req.query.hasOwnProperty('start_date')){
        where += whereCount == 0 ? ' WHERE date_time >= ?':' and date_time >= ?'
        col += colCount == 0 ? ' date(date_time) as date':', date(date_time) as date';
        params.push(req.query.start_date);
        whereCount++;
        colCount++;
    }
    if(req.query.hasOwnProperty('end_date')){
        where += whereCount == 0 ? ' WHERE date_time <= ?':' and date_time <= ?'
        col += colCount == 0 ? 'time(date_time) as time':', time(date_time) as time';
        params.push(req.query.end_date);
        whereCount++;
        colCount++;
    }
    if(req.query.hasOwnProperty('limit')){
        limit = parseInt(req.query.limit);
    }
    params.push(limit);
    col = col=='' ? ' * ' : col;
    let sql = 'SELECT'+col+' FROM Incidents'+where+' limit ?';
    console.log(sql);
    console.log('PARAM: ', params);
    
    dbSelect(sql, params)
    .then(rows=>{
        res.status(200).type('json').send(rows);
    }).catch((error)=>{
        res.status(500).type('txt').send(error);
    });
    // res.status(200).type('json').send({}); // <-- you will need to change this
});

// PUT request handler for new crime incident
app.put('/new-incident', (req, res) => {
    console.log(req.body); // uploaded data
    
    res.status(200).type('txt').send('OK'); // <-- you may need to change this
});

// DELETE request handler for new crime incident
app.delete('/remove-incident', (req, res) => {
    console.log(req.body); // uploaded data
    
    res.status(200).type('txt').send('OK'); // <-- you may need to change this
});

/********************************************************************
 ***   START SERVER                                               *** 
 ********************************************************************/
// Start server - listen for client connections
app.listen(port, () => {
    console.log('Now listening on port ' + port);
});
