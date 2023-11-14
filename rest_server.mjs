import * as path from 'node:path';
import * as url from 'node:url';

import { default as express } from 'express';
import { default as sqlite3 } from 'sqlite3';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
console.log(__dirname)
const db_filename = path.join(__dirname, 'db', 'stpaul_crime.sqlite3');
console.log(db_filename)

const port = 8080;

let app = express();
app.use(express.json());

/********************************************************************
 ***   DATABASE FUNCTIONS                                         *** 
 ********************************************************************/
// Open SQLite3 database (in read-write mode)
let db = new sqlite3.Database(db_filename, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.log(__dirname)
        console.log(db_filename)
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

    let sql = 'SELECT * FROM Codes';
    let params = [];
    let statm1 = " WHERE";

    if (req.query.hasOwnProperty("code")) {
        sql += statm1 + " code=?";
        let code_list = req.query["code"].split(",");
        console.log(code_list);
        code_list.forEach(code => {
            code = code.trim()
            params.push(parseInt(code));
        });
        for(let i=0; i<code_list.length-1; i++) {
            sql += " OR code=?"
        }
        statm1 = " AND";
    }

    if (req.query.hasOwnProperty("incident_type")) {
        sql += statm1 + " incident_type=?";
        params.push(req.query["incident_type"].toUpperCase());
        statm1 = " AND";
    }

    console.log(sql);
    console.log(params);

    dbSelect(sql, params)
    .then((rows) => {
        res.status(200).type('json').send(rows);

    })
    .catch((error) => {
        res.status(500).type('txt').send(error);
    });
    
});

// GET request handler for neighborhoods
app.get('/neighborhoods', (req, res) => {
    console.log(req.query); // query object (key-value pairs after the ? in the url)
    

    let sql = 'SELECT * FROM Neighborhoods';
    let params = [];
    let statm1 = " WHERE";

    if (req.query.hasOwnProperty("id")) {
        sql += statm1 + " neighborhood_number=?";
        let id_list = req.query["id"].split(",");
        console.log(id_list);
        id_list.forEach(id => {
            id = id.trim()
            params.push(parseInt(id));
        });
        for(let i=0; i<id_list.length-1; i++) {
            sql += " OR neighborhood_number=?"
        }
        statm1 = " AND";
    }

    if (req.query.hasOwnProperty("neighborhood_name")) {
        sql += statm1 + " neighborhood_name=?";
        params.push(req.query['neighborhood_name']);
        statm1 = " AND";
    }

    console.log(sql);
    console.log(params);

    dbSelect(sql, params)
    .then((rows) => {
        res.status(200).type('json').send(rows);

    })
    .catch((error) => {
        res.status(500).type('txt').send(error);
    });
    
});

// GET request handler for crime incidents
app.get('/incidents', (req, res) => {
    console.log(req.query); // query object (key-value pairs after the ? in the url)
    

    let sql = 'SELECT * Incidents';
    let params = [];
    let statm1 = " WHERE";

    if (req.query.hasOwnProperty("neighborhood_number")) {
        sql += statm1 + " neighborhood_number=?";
        params.push(parseInt(req.query["neighborhood_number"]))
        statm1 = " AND";
    }

    if (req.query.hasOwnProperty("neighborhood_name")) {
        sql += statm1 + " neighborhood_name=?";
        params.push(req.query['neighborhood_name']);
        statm1 = " AND";
    }

    console.log(sql);
    console.log(params);

    dbSelect(sql, params)
    .then((rows) => {
        res.status(200).type('json').send(rows);

    })
    .catch((error) => {
        res.status(500).type('txt').send(error);
    });
    
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

//nothing