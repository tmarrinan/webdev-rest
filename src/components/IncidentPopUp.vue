<script setup>
defineProps(['incident', 'codes', 'neighborhoods']);
defineEmits('close');

async function deleteData(caseNum){
    console.log('Deleted: '+caseNum);
    let formValues = {"case_number": caseNum};
    // curl -X DELETE "http://localhost:8000/remove-incident" -H "Content-Type: application/json" -d "{\"case_number\": 999999999}"
    const response = await fetch('http://localhost:8001/remove-incident', { 
        method: 'DELETE', 
        headers: { 
            'Content-type': 'application/json'
        }, 
        body: JSON.stringify(formValues) 
    }); 
            
    // Awaiting response.json() 
    const resData = response;
    location.reload();
    return resData;
}

function getIncidentTypeByCode(code, codes) {
    // finds json object for code passed
    const incident = codes.find(i => i.code === code);
    return incident ? incident.type : null;
}

function getNeighborhoodNameById(id, neighborhoods) {
    // finds json object for id passed
    const neighborhood = neighborhoods.find(i => i.id === id);
    return neighborhood ? neighborhood.name : null;
}

</script>

<template>
    <!-- <tr>
        <td>{{ incident.case_number }}</td>
        <td>{{ incident.date }}</td>
        <td>{{ incident.time }} mph</td>
        <td>{{ getIncidentTypeByCode(incident.code, codes)}}</td>
        <td>{{ incident.incident }}</td>
        <td>{{ incident.police_grid }}</td>
        <td>{{ getNeighborhoodNameById(incident.neighborhood_number, neighborhoods) }}</td>
        <td>{{ incident.block }}</td>
    </tr> -->
	<div class="popup">
		<div class="popup-inner grid-container">
            <div class="grid-x grid-padding-x">
                <h1 class="cell">Case Number: {{ incident.case_number }}</h1>
                <h2 class="cell">Dated/Time: {{ incident.date }} {{ incident.time }}</h2>
                <h3 class="cell">Incident: {{ incident.incident }} / {{ getIncidentTypeByCode(incident.code, codes)}}</h3>
                <h4 class="cell">Police Grid: {{ incident.police_grid }}</h4>
                <h5 class="cell">Address: {{ incident.block }} / {{ getNeighborhoodNameById(incident.neighborhood_number, neighborhoods) }}</h5>


                <div class="cell options grid-x grid-padding-x">
                    <button class="cell medium-6 popup-close" @click="$emit('close')">
                        Close
                    </button>
                    <button class="cell medium-6 popup-closeDel" @click="deleteData(incident.case_number); $emit('close')">
                        Delete
                    </button>
                </div>

            </div>
		</div>
	</div>
</template>

<style scoped>
.popup {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 9999;
	background-color: rgba(0, 0, 0, 0.2);
	
	display: flex;
	align-items: center;
	justify-content: center;
}
.popup-inner{
	background: #FFF;
	padding: 32px;
    z-index: 99999;
}

.popup-close,
.popup-closeDel{
    border: 3px solid rgb(0, 0, 0);
    border-radius: 1em;
    padding: 1em;
    font-weight: bold;
    cursor: pointer;
}
.popup-close:hover{
    background-color: black;
    color: white;
}
.popup-closeDel:hover{
    background-color: red;
    color: white;
}
</style>