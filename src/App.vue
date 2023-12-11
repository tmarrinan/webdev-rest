<template>
    <div class="top-bar" id="responsive-menu">
        <div class="top-bar-left">
            <ul class="dropdown menu">
                <li class="menu-text"><span class="locationIcon"><ion-icon name="location"></ion-icon></span>CRIME MN</li>
                <li><router-link to="/" class="navButton">Home</router-link></li>
                <li><router-link to="/Search" class="navButton">Search</router-link></li>
                <li><router-link to="/upload" class="navButton">Upload</router-link></li>
            </ul>
        </div>
    </div>
    <router-view />
</template>

<style scoped>
.menu-text{
    font-size: 1.6rem;
}
.navButton{
    color: black;
    margin-top: .59rem;
    font-weight: bold;
}

.navButton:hover{
    color: rgba(0, 183, 255);
}

</style>