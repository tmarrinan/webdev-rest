<script setup>
import { ref } from 'vue';
import Popup from './IncidentPopUp.vue';
defineProps(['incident', 'codes', 'neighborhoods']);
const isOpen = ref(false);

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
    <div class="cell box">
        <div class="caseNum">
            <h1>Case</h1>
            <h4>{{ incident.case_number }}</h4>
        </div>
        <div class="infopreview">
            <h1>Date:</h1>
            <h4>{{ incident.date }}</h4>
        </div>
        <div class="learnButton">
            <button @click="isOpen = true">Learn More</button>
        </div>
        <teleport to="body">
            <div class="moreInfo" v-if="isOpen">
                <Popup :incident="incident" :codes="codes" :neighborhoods="neighborhoods" @close="isOpen = false"></Popup>
            </div>
        </teleport>
    </div>
</template>

<style scoped>
.box {
    padding: .5em;
    margin: .5em;
    height: 18em;
    border: 4px solid rgb(30, 97, 130);
}
h1{
    text-align: center;
    font-size: 2em;
    font-weight: bold;
}
h4{
    text-align: center;
    font-size: 1.5em;
}

.learnButton{
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: .5em;
}
.learnButton button{
    border: 3px solid rgb(0, 0, 0);
    border-radius: 1em;
    padding: 1em;
    font-weight: bold;
    cursor: pointer;
}
.learnButton button:hover{
    background-color: black;
    color: white;
}

</style>