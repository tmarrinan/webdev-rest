<script setup>
import { reactive, ref, onMounted, initCustomFormatter } from "vue";
import ToggleCrimeButton from "./selectButton.vue";

let crime_url = ref("");
let table = reactive([]);
let dialog_err = ref(false);
let neighborhood_array = reactive([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);
let neighborhood_numbers = reactive([]);
let map = reactive({
  leaflet: null,
  center: {
    lat: 44.955139,
    lng: -93.102222,
    address: "",
  },
  zoom: 12,
  bounds: {
    nw: { lat: 45.008206, lng: -93.217977 },
    se: { lat: 44.883658, lng: -92.993787 },
  },
  neighborhood_markers: [
    { location: [44.942068, -93.020521], marker: null },
    { location: [44.977413, -93.025156], marker: null },
    { location: [44.931244, -93.079578], marker: null },
    { location: [44.956192, -93.060189], marker: null },
    { location: [44.978883, -93.068163], marker: null },
    { location: [44.975766, -93.113887], marker: null },
    { location: [44.959639, -93.121271], marker: null },
    { location: [44.9477, -93.128505], marker: null },
    { location: [44.930276, -93.119911], marker: null },
    { location: [44.982752, -93.14791], marker: null },
    { location: [44.963631, -93.167548], marker: null },
    { location: [44.973971, -93.197965], marker: null },
    { location: [44.949043, -93.178261], marker: null },
    { location: [44.934848, -93.176736], marker: null },
    { location: [44.913106, -93.170779], marker: null },
    { location: [44.937705, -93.136997], marker: null },
    { location: [44.949203, -93.093739], marker: null },
  ],
  crime_markers: [],
});

const getClassForTableRow = (incident) => {
  if (
      incident.toLowerCase().includes("homicide") ||
      incident.toLowerCase().includes("murder") ||
      incident.toLowerCase().includes("rape") ||
      incident.toLowerCase().includes("robbery") ||
      incident.toLowerCase().includes("assault") ||
      incident.toLowerCase().includes("arson")
    ) {
      return "highlight-red";
    } else if (
      incident.toLowerCase().includes("burglary") ||
      incident.toLowerCase().includes("theft") ||
      incident.toLowerCase().includes("property") ||
      incident.toLowerCase().includes("graffiti")
    ) {
      return "highlight-orange";
    } else {
      return "highlight-yellow";
    }
  }

// Vue callback for once <template> HTML has been added to web page
onMounted(() => {
  // Create Leaflet map (set bounds and valied zoom levels)
  map.leaflet = L.map("leafletmap").setView(
    [map.center.lat, map.center.lng],
    map.zoom
  );
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 11,
    maxZoom: 18,
  }).addTo(map.leaflet);
  map.leaflet.setMaxBounds([
    [44.883658, -93.217977],
    [45.008206, -92.993787],
  ]);

  // write the address in that's on the center of the map when initially start the app
  var address = document.getElementById("address");
  var fetchUrl =
    "https://nominatim.openstreetmap.org/reverse?format=json&lat=" +
    map.center.lat +
    "&lon=" +
    map.center.lng;
  fetch(fetchUrl)
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      var location = json.display_name;
      address.value = location;
      map.center.address = location;
    });

  // Get boundaries for St. Paul neighborhoods
  let district_boundary = new L.geoJson();
  district_boundary.addTo(map.leaflet);
  fetch("data/StPaulDistrictCouncil.geojson")
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      result.features.forEach((value) => {
        district_boundary.addData(value);
      });
    })
    .catch((error) => {
      console.log("Error:", error);
    });
    

  map.leaflet.on("moveend", function () {
    var center = map.leaflet.getCenter();
    var latitude = document.getElementById("latitude");
    var longitude = document.getElementById("longitude");
    var address = document.getElementById("address");

    latitude.value = center.lat; //update the boxes with the current center
    longitude.value = center.lng;

    var fetchUrl =
      "https://nominatim.openstreetmap.org/reverse?format=json&lat=" +
      map.center.lat +
      "&lon=" +
      map.center.lng;
    fetch(fetchUrl)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        var location = json.display_name;
        map.center = center;
        address.value = location;
        map.center.address = location;
      });
  });
});

function getNeighborhoodNumbers(){
  // neighborhood_array.slice(0, neighborhood_array.length);
  neighborhood_array.length = 0; // Clear the array

  var bounds = map.leaflet.getBounds();
  var nw_bounds = bounds.getNorthWest();
  var se_bounds = bounds.getSouthEast();
  console.log("nw_bounds" + nw_bounds);
  console.log("lat? = "+nw_bounds.lat);
  var nw_lat = nw_bounds.lat;
  var se_lat = se_bounds.lat;
  var nw_lng = nw_bounds.lng;
  var se_lng = se_bounds.lng;
  // console.log(se_bounds);
  map.neighborhood_markers.forEach(function(markerData, index) {
    var lat = markerData.location[0];
    var lng = markerData.location[1];
    console.log(lat);
    console.log(nw_lat);
    console.log(se_lat);
    console.log('lng'+lng);
    console.log(nw_lng);
    console.log(se_lng);
    if ((lat < nw_lat) && (lat > se_lat) && ((lng > nw_lng) && (lng < se_lng))) {
        console.log("neighborhood included!");
        // console.log(markerData.location);
        neighborhood_array.push(index);
    }
  });
  console.log(neighborhood_array);
  return neighborhood_array;
  //filter using a v-if the table
  //table_length > 0 
  
  // table = table.filter((item) => array.includes(item.neighborhood_number))
}


function replaceIncompleteAddress(address) {
  const addressParts = address.split(" ");

  let addressNumberIndex = -1;
  for (let i = 0; i < addressParts.length; i++) {
    if (addressParts[i].includes("X")) {
      addressNumberIndex = i;
      break;
    }
  }

  if (addressNumberIndex !== -1) {
    addressParts[addressNumberIndex] = addressParts[addressNumberIndex].replace(
      /X/g,
      "0"
    );
  }

  const updatedAddress = addressParts.join(" ");

  return updatedAddress;
}

// FUNCTIONS
// Function called once user has entered REST API URL
function initializeCrimes() {
  // TODO: get code and neighborhood data
  //       get initial 1000 crimes
  console.log(crime_url.value);
  let code_map = {};
  let neighborhood_map = {};
  let crimes_num_table = {};
  fetch(crime_url.value + "/codes")
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      json.forEach((code_object) => {
        code_map[code_object.code] = code_object.type;
      });
    })
    .catch((error) => {
      console.log("error");
      console.log(error);
    });

  fetch(crime_url.value + "/neighborhoods")
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      json.forEach((neigh_object) => {
        neighborhood_map[neigh_object.id] = neigh_object.name;
        crimes_num_table[neigh_object.name] = 0;
      });

      console.log(crimes_num_table);
    })
    .catch((error) => {
      console.log("error");
      console.log(error);
    });

  fetch(crime_url.value + "/incidents")
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
          neighborhood_number: crime.neighborhood_number,
        });
        Object.keys(crimes_num_table).forEach((neigh) => {
          if (neighborhood_map[crime.neighborhood_number] == neigh) {
            crimes_num_table[neigh]++;
          }
        });
      });

      map.neighborhood_markers.forEach((marker, index) => {
        L.marker(marker.location)
          .addTo(map.leaflet)
          .bindPopup(
            Object.values(crimes_num_table)[index].toString() + " Crimes"
          )
          .openPopup();
      });
    })
    .catch((error) => {
      console.log("error");
      console.log(error);
    });

  console.log(table);
}

// Function called when user presses 'OK' on dialog box
function closeDialog() {
  let dialog = document.getElementById("rest-dialog");
  let url_input = document.getElementById("dialog-url");
  if (crime_url.value !== "" && url_input.checkValidity()) {
    dialog_err.value = false;
    dialog.close();

    initializeCrimes();
    map.leaflet.on('moveend', getNeighborhoodNumbers);
    console.log("valid");
    //add event listener for a new function?
  } else {
    dialog_err.value = true;
  }
}

function deleteIncident(caseNumber) {
  return fetch(`${crime_url.value}/remove-incident`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ case_number: caseNumber }),
  })
    .then((response) => {
      if (response.ok) {
        console.log(
          `Incident with case number ${caseNumber} deleted successfully.`
        );
        return response.json();
      } else {
        console.error("Failed to delete incident.");
        throw new Error("Failed to delete incident");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
}

function pressGo() {
  // pull all inputs in from the boxes
  var address = document.getElementById("address").value;
  var latitude = document.getElementById("latitude").value;
  var longitude = document.getElementById("longitude").value;
  if (address.trim() !== "") {
    // see if an address was entered
    address = address.replaceAll(" ", "+"); // change spaces to pluses
    // console.log(address)
    var baseUrl = "https://nominatim.openstreetmap.org/search?q=";
    var fetchUrl =
      baseUrl +
      address +
      "+Saint+Paul+Minnesota&format=json&polygon=1&addressdetails=1";
    // console.log(fetchUrl);

    fetch(fetchUrl)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        var newCenter = L.latLng(json[0].lat, json[0].lon);
        map.leaflet.setView(newCenter, 14, { animate: true }); // move the map to the new center and zoom in
      });
  } else if (latitude.trim() !== "" && longitude.trim() !== "") {
    console.log("both lat and long are entred");
    var fetchUrl =
      "https://nominatim.openstreetmap.org/reverse?format=json&lat=" +
      latitude +
      "&lon=" +
      longitude;

    fetch(fetchUrl)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        console.log(json);
        var location = json.display_name;
        console.log(location);
        //should we update the address box with this display name?
        map.leaflet.setView([latitude, longitude], 14, { animate: true }); // move the map to the new center and zoom in
      });
  }
}

const selectCrime = (address, date, time, incident, case_number) => {
  address = address.replaceAll(" ", "+");
  var redIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  var baseUrl = "https://nominatim.openstreetmap.org/search?q=";
  var fetchUrl =
    baseUrl +
    address +
    "+Saint Paul+Minnesota&format=json&polygon=1&addressdetails=1";
  console.log(fetchUrl);
  fetch(fetchUrl)
    .then((response) => {
      return response.json();
    })

    .then((json) => {
      let markerLocation = [json[0].lat, json[0].lon];
      const marker = L.marker(markerLocation, { icon: redIcon })
        .addTo(map.leaflet)
        .bindPopup(
          `<b>Date:</b> ${date} </br>
          <b>Time:</b> ${time} </br>
          <b>Incident:</b> ${incident}`
        )
        .openPopup();
      map.crime_markers.push({
        location: markerLocation,
        marker: marker,
        case_number: case_number,
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};

const unselectCrime = (address, case_number) => {
  let indexToRemove = -1;

  console.log(case_number);

  map.crime_markers.forEach((item, index) => {
    if (item.case_number === case_number) {
      console.log(item.case_number);
      indexToRemove = index;
    }
  });

  if (indexToRemove !== -1) {
    let markerToRemove = map.crime_markers[indexToRemove].marker;
    console.log(markerToRemove);

    // Assuming markerToRemove is a Leaflet marker
    if (map.leaflet && markerToRemove) {
      console.log(markerToRemove);
      markerToRemove.remove();
      map.leaflet.removeLayer(markerToRemove);
      map.crime_markers.splice(indexToRemove, 1); // Remove the marker from the array
    }
  }

};
</script>
<template>
  <dialog id="rest-dialog" open>
    <h1 class="dialog-header">St. Paul Crime REST API</h1>
    <label class="dialog-label">URL: </label>
    <input
      id="dialog-url"
      class="dialog-input"
      type="url"
      v-model="crime_url"
      placeholder="http://localhost:8000"
    />
    <p class="dialog-error" v-if="dialog_err">Error: must enter valid URL</p>
    <br />
    <button class="button" type="button" @click="closeDialog">OK</button>
  </dialog>
  <div class="grid-container">
    <div class="grid-x grid-padding-x">
      <div id="leafletmap" class="cell auto"></div>
    </div>
  </div>

  <div class="ui-row">
    <label>Address: </label><input id="address" type="text" />
  </div>

  <!-- should I add a new thing for lat/long? and then depending on what is filled in do that? what if the user types some in both? -->
  <div class="ui-row">
    <label>Latitude: </label><input id="latitude" type="text" />
  </div>
  <div class="ui-row">
    <label>Longitude: </label><input id="longitude" type="text" />
  </div>

  <div class="ui-row">
    <button class="button" type="button" @click="pressGo">Go</button>
  </div>

  <div class="legend">
    <span class="legend-item violent-crime">Violent Crime</span>
    <span class="legend-item property-crime">Property Crime</span>
    <span class="legend-item other-crime">Other Crime</span>
  </div>

  <div id="checkboxList">
    <label><input type="checkbox"> Narcotics</label>
    <label><input type="checkbox"> Proactive Polic Visit</label>
    <label><input type="checkbox"> Discharge </label>
    <label><input type="checkbox"> Theft</label>
    <label><input type="checkbox"> Robbery </label>
    <label><input type="checkbox"> Community Event</label>
    <label><input type="checkbox"> Auto Theft</label>
    <label><input type="checkbox"> Criminal Damage</label>
    <label><input type="checkbox"> Burglary</label>
    <label><input type="checkbox"> Simple Assault Dom</label>
    <label><input type="checkbox"> Agg. Assault Dom</label>  
    <label><input type="checkbox"> Agg. Assault</label>
  </div>


  <table class = "unstriped" v-if="table.length > 0">
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
        <th>view crime</th>
        <th>delete incident</th>
      </tr>
    </thead>
    <tbody>
      
      <!-- <tr
        v-for="item in table"
        :id="getClassForTableRow(item.incident_type.trim())"
        v-if="neighborhood_array.includes(item.neighborhood_number)"
      > -->
      <tr>
        {{ neighborhood_array }}
        {{ neighborhood_numbers }}
      </tr>

      <template v-for="item in table" :key="item.case_number">
          <template v-if="neighborhood_array.includes(item.neighborhood_number)">
       <tr :id="getClassForTableRow(item.incident_type.trim())">
      
        <td>{{ neighborhood_array.includes(item.neighborhood_number)}} </td>
        <td>{{ item.case_number }}</td>
        <td>{{ item.incident_type }}</td>
        <td>{{ item.incident }}</td>
        <td>{{ item.grid }}</td>
        <td>{{ item.neighborhood }}</td>
        <td>{{ item.block }}</td>
        <td>{{ item.date }}</td>
        <td>{{ item.time }}</td>
        <td>
          <ToggleCrimeButton
            :address="item.block"
            :date="item.date"
            :time="item.time"
            :incident="item.incident"
            :case_number="item.case_number"
            :onSelect="selectCrime"
            :onUnselect="unselectCrime"
          ></ToggleCrimeButton>
        </td>
        <td>
          <button
            class="button"
            type="button"
            @click="deleteIncident(item.case_number)"
          >
            Delete
          </button>
        </td>
      </tr>
      </template>
      </template>
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
  color: #d32323;
}

.red-icon {
  background-color: red;
}

#highlight-red {
  background-color: #FF4D4D;
}

#highlight-orange {
  background-color: #FFA500;
}

#highlight-yellow {
  background-color: lightgray
}

.legend {
  margin-bottom: 1%;
}

.legend-item {
  margin-right: 1% ;
  padding: 0.5%;
  border: 1px black;
}

.violent-crime { background-color: #FF4D4D; }
.property-crime { background-color: #FFA500; }
.other-crime { background-color: lightgray;}

.ui-row {
  display: inline-block;
  margin-right: 15px;
}

#checkboxList label {
      display: inline-block;
      margin-right: 10px; 
    }
</style>
