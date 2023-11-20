import * as path from 'node:path';
import * as url from 'node:url';

import { default as express } from 'express';
import { default as sqlite3 } from 'sqlite3';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const db_filename = path.join(__dirname, 'db', 'stpaul_crime.sqlite3');
//const db_filename = path.join(__dirname, 'db', 'stpaul_crime_copy.sqlite3');

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
    let sql = 'SELECT case_number, date(date_time) AS date, time(date_time) AS time, code, incident, police_grid, neighborhood_number, block FROM Incidents';
    let params = [];
    let limit = 1000;
    let count = 0;
    if(req.query.hasOwnProperty('start_date')){
        sql += count == 0 ? ' WHERE date_time >= ?': ' AND date_time >= ?'
        params.push(req.query.start_date);
        count++;
    }

    if(req.query.hasOwnProperty('end_date')){
        sql += count == 0 ? ' WHERE date_time <= ?': ' AND date_time <= ?'
        params.push(req.query.end_date);
        count++;
    }

    if(req.query.hasOwnProperty('neighborhood')){
        let neighborhoods = req.query.neighborhood.split(',');
        sql += count == 0 ? ' WHERE (neighborhood_number = ?': ' AND (neighborhood_number = ?';
        params.push(parseInt(neighborhoods[0]));
        for(let i=1; i<neighborhoods.length; i++){
            sql += ' OR neighborhood_number = ?';
            params.push(parseInt(neighborhoods[i]));
        }
        sql += ')'
        count++;
    }

    if(req.query.hasOwnProperty('code')){
        let codes = req.query.code.split(',');
        sql += count == 0 ? ' WHERE (code = ?': ' AND (code = ?';
        params.push(parseInt(codes[0]));
        for(let i=1; i<codes.length; i++){
            sql += ' OR code = ?';
            params.push(parseInt(codes[i]));
        }
        count++;
        sql += ')'
    }

    if(req.query.hasOwnProperty('grid')){
        let grids = req.query.grid.split(',');
        sql += count == 0 ? ' WHERE (police_grid = ?': ' AND (police_grid = ?';
        params.push(parseInt(grids[0]));
        for(let i=1; i<grids.length; i++){
            sql += ' OR police_grid = ?';
            params.push(parseInt(grids[i]));
        }
        count++;
        sql += ')'
    }

    if(req.query.hasOwnProperty('limit')){
        limit = parseInt(req.query.limit);
    }
    params.push(limit);
    sql += ' ORDER BY date_time ASC LIMIT ?';

    console.log(sql);
    console.log('PARAM: ', params);
    
    dbSelect(sql, params)
    .then(rows=>{
        logJSON(rows);
        res.status(200).type('json').send(rows);
    }).catch((error)=>{
        res.status(500).type('txt').send(error);
    });
    // res.status(200).type('json').send({}); // <-- you will need to change this
});





// PUT request handler for new crime incident
// curl -X PUT "http://localhost:8000/new-incident" -H "Content-Type: application/json" -d "{\"case_number\": 24199733, \"date\": \"11-18-2023\", \"time\": \"20:48:53\", \"code\": 300, \"incident\": \"Stole my heart\", \"police_grid\": 119, \"neighborhood_number\": 1, \"block\": \"4XX LUELLA ST\"}"
app.put('/new-incident', (req, res) => {
    console.log(req.body); // uploaded data

    let sql = "INSERT INTO Incidents (case_number, date_time, code, incident, police_grid, neighborhood_number, block) VALUES (";
    let params = [];
    if(req.body.hasOwnProperty('case_number')){
        sql += '?, ';
        params.push(req.body.case_number);
    }
    if(req.body.hasOwnProperty('date') && req.body.hasOwnProperty('time')){
        sql += '?, ';
        params.push(`${req.body.date} ${req.body.time}`);
    }
    if(req.body.hasOwnProperty('code')){
        sql += '?, ';
        params.push(parseInt(req.body.code));
    }
    if(req.body.hasOwnProperty('incident')){
        sql += '?, ';
        params.push(req.body.incident);
    }
    if(req.body.hasOwnProperty('police_grid')){
        sql += '?, ';
        params.push(parseInt(req.body.police_grid));
    }
    if(req.body.hasOwnProperty('neighborhood_number')){
        sql += '?, ';
        params.push(parseInt(req.body.neighborhood_number));
    }
    if(req.body.hasOwnProperty('block')){
        sql += '?';
        params.push(req.body.block);
    }
    sql += ')'

    // console.log(sql);

    // build SELECT query
    let sqlCheck = "SELECT * FROM Incidents WHERE case_number = ?";

    // console.log(sqlCheck);
    // console.log('PARAM: ', params);

    // check if row exists
    dbSelect(sqlCheck, [parseInt(req.body.case_number)])
    .then((rows) => {
        // console.log(rows)
        if (rows.length !== 0) {
            throw `Incident for case number ${req.body.case_number} already exists in the database.`
        }
        // insert into database
        console.log('insert successful');
        return dbRun(sql, params)
    })
    .then(() => {
        res.status(200).type('txt').send('OK');
    })
    .catch((error) => {
        console.log(error)
        console.log('Insert NOT successful');
        res.status(500).type('txt').send(error);
    });
});





// DELETE request handler for new crime incident
//http://localhost:8000/remove-incident
app.delete('/remove-incident', (req, res) => {
    console.log(req.body); // uploaded data

    let sql = 'DELETE FROM Incidents';
    let params = [];

    let sqlCheck;
    if(req.body.hasOwnProperty('case_number')){
        params.push(req.body['case_number']);
        sql += ` WHERE case_number = ?`;
        sqlCheck = `SELECT case_number FROM Incidents WHERE case_number = ?`;
    }
    console.log(sql);
    console.log('PARAM: ', params);

    //Checking to see if the row exist
    dbSelect(sqlCheck, params)
    .then(rows=>{
        console.log("It exist: "+rows);
        if (rows.length !== 0){
            console.log("It is true they say");
            dbRun(sql, params)
            .then(()=>{
                res.status(200).type('txt').send('It DOES exist, but not anymore :)');
            }).catch((error)=>{
                res.status(500).type('txt').send('It does not exist');
            });
        }else{
            res.status(500).type('txt').send('It does not exist at all');
        }
    }).catch((error)=>{
        res.status(404).type('json').send("An error, there is: "+error);
    });

});





//TEST FUNCTION SO YOU CAN SEE JSON EASIER (ITS IN CONSOLE)
function logJSON(json){
    let rows = '';
    const t = '   '; //using t instead of \t because the space looks too wide
    console.log('[');
    json.forEach(row => {
        rows += t+'{\n';
        Object.keys(row).forEach(key=>{
            rows += t+t+'"'+key+'": "'+row[key]+'"\n';
        });
        rows += t+'},\n';
    });
    console.log(rows);
    console.log(']');
}











/********************************************************************
 ***   START SERVER                                               *** 
 ********************************************************************/
// Start server - listen for client connections
app.listen(port, () => {
    console.log('Now listening on port ' + port);
});
