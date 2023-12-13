<script setup>
import { reactive, ref, onMounted, initCustomFormatter } from 'vue'

let crime_url = ref('');
let table = reactive([]);
let dialog_err = ref(false);
let map = reactive(
    {
        leaflet: null,
        center: {
            lat: 44.955139,
            lng: -93.102222,
            address: ''
        },
        zoom: 12,
        bounds: {
            nw: {lat: 45.008206, lng: -93.217977},
            se: {lat: 44.883658, lng: -92.993787}
        },
        neighborhood_markers: [
            {location: [44.942068, -93.020521], marker: null},
            {location: [44.977413, -93.025156], marker: null},
            {location: [44.931244, -93.079578], marker: null},
            {location: [44.956192, -93.060189], marker: null},
            {location: [44.978883, -93.068163], marker: null},
            {location: [44.975766, -93.113887], marker: null},
            {location: [44.959639, -93.121271], marker: null},
            {location: [44.947700, -93.128505], marker: null},
            {location: [44.930276, -93.119911], marker: null},
            {location: [44.982752, -93.147910], marker: null},
            {location: [44.963631, -93.167548], marker: null},
            {location: [44.973971, -93.197965], marker: null},
            {location: [44.949043, -93.178261], marker: null},
            {location: [44.934848, -93.176736], marker: null},
            {location: [44.913106, -93.170779], marker: null},
            {location: [44.937705, -93.136997], marker: null},
            {location: [44.949203, -93.093739], marker: null}
        ]
    }
);

// Vue callback for once <template> HTML has been added to web page
onMounted(() => {
    // Create Leaflet map (set bounds and valied zoom levels)
    map.leaflet = L.map('leafletmap').setView([map.center.lat, map.center.lng], map.zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 11,
        maxZoom: 18
    }).addTo(map.leaflet);
    map.leaflet.setMaxBounds([[44.883658, -93.217977], [45.008206, -92.993787]]);

    // Get boundaries for St. Paul neighborhoods
    let district_boundary = new L.geoJson();
    district_boundary.addTo(map.leaflet);
    fetch('data/StPaulDistrictCouncil.geojson')
    .then((response) => {
        return response.json();
    })
    .then((result) => {
        result.features.forEach((value) => {
            district_boundary.addData(value);
        });
    })
    .catch((error) => {
        console.log('Error:', error);
    });
});

function replaceIncompleteAddress(address) {
  const addressParts = address.split(' ');

  let addressNumberIndex = -1;
  for (let i = 0; i < addressParts.length; i++) {
    if (addressParts[i].includes('X')) {
      addressNumberIndex = i;
      break;
    }
  }

  if (addressNumberIndex !== -1) {
    addressParts[addressNumberIndex] = addressParts[addressNumberIndex].replace(/X/g, '0');
  }

  const updatedAddress = addressParts.join(' ');

  return updatedAddress;
}



// FUNCTIONS
// Function called once user has entered REST API URL
function initializeCrimes() {
    // TODO: get code and neighborhood data
    //       get initial 1000 crimes
    console.log(crime_url.value);
    let code_map = {}
    let neighborhood_map = {}
    let crimes_num_table = {}
    fetch(crime_url.value+"/codes")
    .then((response) => {
        return response.json();
    })
    .then((json) => {

        json.forEach((code_object) => {
            code_map[code_object.code] = code_object.type
        })
    })
    .catch((error) => {
        console.log("error")
        console.log(error)
    });

    fetch(crime_url.value+"/neighborhoods")
    .then((response) => {
        return response.json();
    })
    .then((json) => {

        json.forEach((neigh_object) => {
            neighborhood_map[neigh_object.id] = neigh_object.name
            crimes_num_table[neigh_object.name] = 0
        })

        console.log(crimes_num_table)
    })
    .catch((error) => {
        console.log("error")
        console.log(error)
    });


    fetch(crime_url.value+"/incidents")
    .then((response) => {
        return response.json(); //we need to tell it how we want the result, which is in json
    })
    .then((json) => {

        json.forEach((crime) => {
            table.push({
                case_number: crime.case_number,
                incident_type: code_map[crime.code],
                incident: crime.incident,
                grid: crime.police_grid,
                neighborhood: neighborhood_map[crime.neighborhood_number],
                block: replaceIncompleteAddress(crime.block),
                date: crime.date,
                time: crime.time,
            });
        });

        
        let test = []

        json.forEach((crime) => {
            test.push(crime)
            Object.keys(crimes_num_table).forEach((neigh) => {
                if(neighborhood_map[crime.neighborhood_number] == neigh) {
                    crimes_num_table[neigh]++ 
                }
            })
        })
        
        map.neighborhood_markers.forEach((marker, index) => {
            L.marker(marker.location).addTo(map.leaflet).bindPopup(Object.values(crimes_num_table)[index].toString() + " Crimes").openPopup()
        }) 
    })
    .catch((error) => {
        console.log("error")
        console.log(error)
    });

    console.log(table)
}

// Function called when user presses 'OK' on dialog box
function closeDialog() {
    let dialog = document.getElementById('rest-dialog');
    let url_input = document.getElementById('dialog-url');
    if (crime_url.value !== '' && url_input.checkValidity()) {
        dialog_err.value = false;
        dialog.close();
        initializeCrimes();
        console.log('valid');
    }
    else {
        dialog_err.value = true;
    }
}

function deleteIncident(caseNumber) {
    return fetch(`${crime_url.value}/remove-incident`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ case_number: caseNumber }),
    })
    .then((response) => {
        if (response.ok) {
            console.log(`Incident with case number ${caseNumber} deleted successfully.`);
            return response.json();
        } else {
            console.error('Failed to delete incident.');
            throw new Error('Failed to delete incident');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        throw error;
    });
}
</script>

<template>
    <dialog id="rest-dialog" open>
        <h1 class="dialog-header">St. Paul Crime REST API</h1>
        <label class="dialog-label">URL: </label>
        <input id="dialog-url" class="dialog-input" type="url" v-model="crime_url" placeholder="http://localhost:8000" />
        <p class="dialog-error" v-if="dialog_err">Error: must enter valid URL</p>
        <br/>
        <button class="button" type="button" @click="closeDialog">OK</button>
    </dialog>
    <div class="grid-container ">
        <div class="grid-x grid-padding-x">
            <div id="leafletmap" class="cell auto"></div>
        </div>
    </div>
    <!-- <div class="grid-container ">
        <div class="grid-x grid-padding-x">
            <div id="table" class="cell auto"></div>
        </div>
    </div> -->


    <table v-if="table.length > 0">
        <thead>
            <tr>
                <th>case_number</th>
                <th>incident_type</th>
                <th>incident</th>
                <th>police_grid</th>
                <th>neighborhood_name</th>
                <th>block</th>
                <th>date</th>
                <th>time</th>
                <th>delete incident</th>
            </tr>
        </thead>
        <tbody>

            <tr v-for="item in table">
                <td>{{ item.case_number }}</td>
                <td> {{ item.incident_type }}</td>
                <td>{{ item.incident }}</td>
                <td>{{ item.grid }}</td>
                <td>{{ item.neighborhood }}</td>
                <td>{{ item.block }}</td>
                <td>{{ item.date }}</td>
                <td>{{ item.time }}</td>
                <td><button class="button" type="button" @click="deleteIncident(item.case_number)">Delete</button></td>
            </tr>
        </tbody>
    </table>
    
    
</template>

<style>
#rest-dialog {
    width: 20rem;
    margin-top: 1rem;
    z-index: 1000;
}

#leafletmap {
    height: 500px;
}

.dialog-header {
    font-size: 1.2rem;
    font-weight: bold;
}

.dialog-label {
    font-size: 1rem;
}

.dialog-input {
    font-size: 1rem;
    width: 100%;
}

.dialog-error {
    font-size: 1rem;
    color: #D32323;
}
</style>
