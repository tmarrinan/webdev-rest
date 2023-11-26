//curl -X PUT "http://localhost:8000/new-incident" -H "Content-Type: application/json" -d "{\"case_number\": 1234, \"date\": \"2023-11-13\", \"incident\": \"student mischieft\"}"

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
let db = new sqlite3.Database('./stpaul_crime.sqlite3', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.log('Error opening ' + path.basename(db_filename));
        console.log(__dirname);
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

/*app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/home.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname+'/home.html'));
});*/

// GET request handler for crime codes
app.get('/codes', (req, res) => {

    let query = 'Select code, incident_type FROM codes Order by code';
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message})
            return;
        }
        res.status(200).json({rows});
    });
    //res.sendFile(path.join(__dirname+'/codes.html'));
});

// GET request handler for specific crime codes
app.get('/codes/:id', (req, res) => {
    console.log('id= ' + req.params.id);
    var code = req.params.id;
    let query = 'Select code, incident_type FROM codes where code in (' + code + ') Order by code';
    console.log(query);
    db.all(query, [] , (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message})
            return;
        }
        res.status(200).json({rows});
    });
    //res.sendFile(path.join(__dirname+'/codes.html'));
});

// GET request handler for neighborhoods
app.get('/neighborhoods', (req, res) => {
    let query = 'SELECT neighborhood_number, neighborhood_name FROM neighborhoods Order by neighborhood_number';
    //res.sendFile(path.join(__dirname+'/neighborhoods.html'));

    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message})
            return; 
        }
        res.status(200).json({rows});
    });
});

// GET request handler for specific neighborhoods
app.get('/neighborhoods/:id', (req, res) => {
    var code = req.params.id;
    let query = 'SELECT neighborhood_number, neighborhood_name FROM neighborhoods where neighborhood_number in (' + code + ') Order by neighborhood_number';
    //res.sendFile(path.join(__dirname+'/neighborhoods.html'));
    console.log(query);
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message})
            return; 
        }
        res.status(200).json({rows});
    });
});

// GET request handler for crime incidents
app.get('/incidents', (req, res) => {
    var start_date = req.query.start_date;
    var end_date = req.query.end_date;
    var code = req.query.code;
    var grid = req.query.grid;
    var neighborhood =  req.query.neighborhood;
    var limit = req.query.limit;



    console.log('start date = ' + start_date);
    console.log(start_date.length);
    let query = 'SELECT  *, date([date_time]) as incident_date,  time([date_time]) as incident_time FROM incidents';

    if ((start_date?.length > 0) || (end_date?.length > 0) || (code?.length > 0) || (grid?.length > 0) || (neighborhood?.lenght > 0))
    {
        query += ' where 1=1 ';
    }

    if (start_date?.length > 0)
    {
        query = query + 'and incident_date >= ' + '\'' + start_date + '\' ';
    }

    if (end_date?.length > 0)
    {
        query = query + 'and incident_date <= ' + '\'' + start_date + '\' ';
    }

    if (code?.length > 0)
    {
        query = query + 'and code in (' + code + ') ';
    }

    if (grid?.length > 0)
    {
        query = query + 'and police_grid in (' + grid + ') ';
    }

    if (neighborhood?.length > 0)
    {
        query = query + 'and neighborhood_number in (' + neighborhood + ') ';
    }

    query = query + ' Order by date_time ';

    if (limit?.length > 0)
    {
        query = query + 'limit ' + limit;
    }

    console.log(query);
    db.all(query, [], (err, rows) => {
        if(err) {
            res.status(400).json({"error":err.message})
            return;
        }
        res.status(200).json({rows});
    });
});


app.post("/new-incident/", (req,res, next) => {
    var reqBody = req.body; 
    db.run('INSERT INTO incidents (case_number, date_time, code, incident, police_grid, neighborhood_number, block) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [reqBody.case_number, reqBody.date_time, reqBody.code, reqBody.incident, reqBody.police_grid, reqBody.neighborhood_number, reqBody.block], 
    function (err, result) {
        if (err) {
            res.status(500).json({"error": err.message})
            return;
        }
        res.status(201).json({
            "case_number": reqBody.case_number
        })
    });
});









// PUT request handler for new crime incident
/* app.put('/new-incident', (req, res) => {
    console.log(req.body); // uploaded data
    let query = "insert into incidents values('" + req.
    res.status(200).type('txt').send('OK'); // <-- you may need to change this
}); */

// DELETE request handler for new crime incident
app.delete('/remove-incident/:id', (req, res) => {
    let query = 'DELETE FROM incidents WHERE case_number = ?';
    console.log('id= ' + req.params.id);
    db.run(query,
        req.params.id, 
        function (err, result) {
            if (err) {
                res.status(500).json({"error":res.message})
                return;
            }
            res.status(200).json({deletedID: this.message})
        });
    //console.log(req.body); // uploaded data
    //res.status(200).type('txt').send('OK'); // <-- you may need to change this
});

/********************************************************************
 ***   START SERVER                                               *** 
 ********************************************************************/
// Start server - listen for client connections
app.listen(port, () => {
    console.log('Now listening on port ' + port);
});