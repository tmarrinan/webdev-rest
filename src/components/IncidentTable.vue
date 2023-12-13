<script setup>
import IncidentRow from './IncidentRow.vue';
defineProps(['crimes', 'codes', 'neighborhoods']);

</script>



<template>
    <!-- <table v-if="crimes.length > 0">
        <thead>
            <tr>
                <th>Case Number</th>
                <th>Date</th>
                <th>Time</th>
                <th>Incident Type</th>
                <th>Description</th>
                <th>Police Grid</th>
                <th>Neighborhood</th>
                <th>Block</th>
            </tr>
        </thead>
        <tbody>
            <IncidentRow v-for="incident in crimes" :incident="incident" :codes="codes" :neighborhoods="neighborhoods"></IncidentRow>
        </tbody>
    </table> -->

    <div class="cell" style="text-align: center; font-size: 2rem; font-weight: bold; padding: 1em;">Crimes Database</div>
    <div class="boxes grid-x grid-padding-x small-up-2 medium-up-4" v-if="crimes.length > 0">
        <IncidentRow v-for="incident in crimes" :incident="incident" :codes="codes" :neighborhoods="neighborhoods"></IncidentRow>
    </div>



</template>

<style scoped>
.boxes{
    align-items: center;
    justify-content: center;
}

</style>