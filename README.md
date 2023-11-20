# St. Paul Crime Database API

# GET requests

### /codes

Returns a list of codes and their corresponding incident type (ordered by code number).

```bash
curl "http://localhost:8000/codes?code=110,700"
```

### /neighborhoods

Returns a list of neighborhood ids and their corresponding neighborhood name (ordered by id).

```bash
curl "http://localhost:8000/neighborhoods?id=11,14"
```

### /incidents

Returns a list of crime incidents (ordered by date/time).

```bash
curl "http://localhost:8000/incidents?limit=10&start_date=2019-09-01&end_date=2019-10-31&code=110,700"
```

The following query parameters are supported:

- `limit` - the maximum number of incidents to return (e.g. `?limit=10`). _The default limit is 1000_.
- `start_date` - specifies the earliest date of incidents to be returned (e.g. `?start_date=2019-09-01`).
- `end_date` - specifies the lastest date of incidents to be returned(e.g. `?end_date=2019-10-31`).
- `code` - specifies the type of incidents that should be returned (e.g. `?code=110,700`). _All types will be returned by default_.
- `grid` - specifies which incidents to return based on police gird (e.g. `?grid=38,65`). _All police grids will returned by default_.
- `neighboorhood` - specifies which incidents to return based on neighboorhood (e.g. `neighborhood=11,14`) _All neighboorhoods will be returned by default_.

# PUT requests

### /new-incident

Puts a new incident and its data into the crime database.

```bash
curl -X PUT "http://localhost:8000/new-incident" -H "Content-Type: application/json" -d '{"case_number": 999999999, "date": "2023-11-18", "time": "20:48:53", "code": 23, "incident": "Vandalism", "police_grid": 119, "neighborhood_number": 1, "block": "4XX LUELLA ST"}'
```

_A 500 error will be returned if the incident already exists._

# DELETE requests

### /remove-incident

Removes an incident from the crime database.

```bash
curl -X DELETE "http://localhost:8000/remove-incident" -H "Content-Type: application/json" -d '{"case_number": 999999999}'
```

_A 500 error will be returned if the incident already exists._
