<template>
    <div id="nav">
        <router-link to="/" class="navButton">Home</router-link>
        <router-link to="/Search" class="navButton">Search</router-link>
    </div>
    <router-view />
</template>

<style>
#nav{
    background-color: black;
    height: 3em;
}
.navButton{
    padding: .5em;
    border: 1px solid red;
}
</style>