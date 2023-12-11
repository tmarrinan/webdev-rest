<script setup>
import IncidentRow from './IncidentRow.vue';
defineProps(['crimes', 'codes', 'neighborhoods']);
</script>

<template>
    <table v-if="crimes.length > 0">
        <thead>
            <tr>
                <th>Case Number</th>
                <th>Date</th>
                <th>Time</th>
                <th>Code</th>
                <th>Incident</th>
                <th>Police Grid</th>
                <th>Neighborhood Number</th>
                <th>Block</th>
            </tr>
        </thead>
        <tbody>
            <IncidentRow v-for="incident in crimes" :incident="incident" :codes="codes" :neighborhoods="neighborhoods"></IncidentRow>
        </tbody>
    </table>
</template>

<style scoped>
td {
    border: solid 1px #000000
}
</style>